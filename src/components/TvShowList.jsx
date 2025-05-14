import "./TvShowList.css";
import { useState, useEffect } from "react";

// ⬇️ Add your manual TV shows here
const initialTvShows = [
  { id: 1, title: "Severance", year: 2008, poster: "" },
  { id: 2, title: "The Righteous Gemstones", year: 2011, poster: "" },
  { id: 3, title: "Last of Us", year: 2016, poster: "" },
  { id: 4, title: "Mayor of Kingstown", year: 2005, poster: "" },
  { id: 5, title: "Suits LA", year: 2025, poster: "" },
  { id: 6, title: "The Handmaid's Tale", year: 2019, poster: "" },
  { id: 7, title: "The White Lotus", year: 2021, poster: "" },
  { id: 8, title: "Power Book III: Raising Kanan", year: 2025, poster: "" },
  { id: 9, title: "BelAir", year: 2022, poster: "" },
  { id: 10, title: "YellowJackets", year: 2022, poster: "" },
  { id: 11, title: "The Studio", year: 2025, poster: "" },
  { id: 12, title: "Paradise", year: 2025, poster: "" },
];

export default function TvShowList() {
  const [tvShows, setTvShows] = useState(initialTvShows);
  const [trendingShows, setTrendingShows] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [postersFetched, setPostersFetched] = useState(false);

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`
        );
        const data = await res.json();

        const enrichedShows = await Promise.all(
          data.results.map(async (show) => {
            const detailRes = await fetch(
              `https://api.themoviedb.org/3/tv/${show.id}?api_key=${apiKey}&append_to_response=external_ids`
            );
            const detailData = await detailRes.json();

            return {
              id: show.id,
              title: show.name,
              year: show.first_air_date ? parseInt(show.first_air_date.split("-")[0]) : "N/A",
              poster: show.poster_path
                ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${show.poster_path}`
                : "",
              imdb_id: detailData.external_ids?.imdb_id || null,
            };
          })
        );

        setTrendingShows(enrichedShows);
      } catch (err) {
        console.error("Failed to fetch trending TV shows:", err);
      }
    };

    fetchTrending();
  }, [apiKey]);

  useEffect(() => {
    if (!postersFetched) {
      const fetchPosters = async () => {
        const updatedShows = await Promise.all(
          tvShows.map(async (show) => {
            try {
              const res = await fetch(
                `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(show.title)}`
              );
              const data = await res.json();

              if (data.results && data.results.length > 0) {
                const match = data.results[0];

                const detailRes = await fetch(
                  `https://api.themoviedb.org/3/tv/${match.id}?api_key=${apiKey}&append_to_response=external_ids`
                );
                const detailData = await detailRes.json();

                return {
                  ...show,
                  poster: match.poster_path
                    ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${match.poster_path}`
                    : show.poster,
                  imdb_id: detailData.external_ids?.imdb_id || null,
                };
              }
            } catch (error) {
              console.error(`Error fetching data for ${show.title}:`, error);
            }
            return show;
          })
        );

        setTvShows(updatedShows);
        setPostersFetched(true);
      };

      fetchPosters();
    }
  }, [postersFetched, apiKey, tvShows]);

  const formatTitleForLevidia = (title) =>
    title
      .replace(/:/g, "")
      .replace(/\s+/g, "-")
      .replace(/&/g, "")
      .replace(/'/g, "")
      .toLowerCase();

  const toggleFlip = (id) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getWatchLinks = (show) => {
    const links = [];

    if (show.imdb_id) {
      links.push({
        url: `https://vidsrc.xyz/embed/tv/${show.imdb_id}`,
        label: "▶️ Watch on Vidsrc",
      });
    }

    links.push({
      url: `https://www.levidia.ch/tv-show.php?watch=${formatTitleForLevidia(show.title)}`,
      label: "▶️ Watch on Levidia",
    });

    return links;
  };

  const renderShowCards = (shows) => (
    <div className="tv-show-container">
      {shows.map((show) => {
        const watchLinks = getWatchLinks(show);
        return (
          <div
            key={show.id}
            className={`tv-show-card ${flipped[show.id] ? "flipped" : ""}`}
            onClick={() => toggleFlip(show.id)}
          >
            <div className="tv-show-card-inner">
              {/* Front */}
              <div className="tv-show-card-front">
                <img
                  src={show.poster || "https://via.placeholder.com/250x300"}
                  alt={show.title}
                />
                <h3>{show.title}</h3>
                <p>({show.year})</p>
              </div>

              {/* Back */}
              <div className="tv-show-card-back">
                <img
                  src={show.poster || "https://via.placeholder.com/250x300"}
                  alt={show.title}
                />
                <button className="favorite-btn">⭐ Add to Favorites</button>
                {watchLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="levidia-link"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="tv-show-list">
      <h2>🔥 Trending TV Shows</h2>
      {renderShowCards(trendingShows)}

      <h2>⭐ Popular TV Shows</h2>
      {renderShowCards(tvShows)}
    </div>
  );
}
