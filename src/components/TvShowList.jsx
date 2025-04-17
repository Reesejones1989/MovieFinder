import "./TvShowList.css";
import { useState, useEffect } from "react";

const initialTvShows = [
  { id: 1, title: "Breaking Bad", year: 2008, poster: "" },
  { id: 2, title: "The Righteous Gemstones", year: 2011, poster: "" },
  { id: 3, title: "Stranger Things", year: 2016, poster: "" },
  { id: 4, title: "The Office", year: 2005, poster: "" },
  { id: 5, title: "Suits LA", year: 2025, poster: "" },
  { id: 6, title: "The Mandalorian", year: 2019, poster: "" },
  { id: 7, title: "The White Lotus", year: 2021, poster: "" },
  { id: 8, title: "Power Book III: Raising Kanan", year: 2025, poster: "" },
  { id: 9, title: "BelAir", year: 2022, poster: "" },
  { id: 10, title: "YellowJackets", year: 2022, poster: "" },
  { id: 11, title: "Severance", year: 2022, poster: "" },
  { id: 12, title: "Paradise", year: 2025, poster: "" },
];

export default function TvShowList() {
  const [tvShows, setTvShows] = useState(initialTvShows);
  const [flipped, setFlipped] = useState({});
  const [iframeSrc, setIframeSrc] = useState("");

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchPosters = async () => {
      const updatedTvShows = await Promise.all(
        tvShows.map(async (show) => {
          if (show.poster) return show;

          try {
            const response = await fetch(
              `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(show.title)}`
            );
            const data = await response.json();

            if (data.results && data.results.length > 0 && data.results[0].poster_path) {
              return {
                ...show,
                poster: `https://image.tmdb.org/t/p/w600_and_h900_bestv2${data.results[0].poster_path}`,
              };
            }
          } catch (error) {
            console.error(`Error fetching poster for ${show.title}:`, error);
          }
          return show;
        })
      );

      setTvShows(updatedTvShows);
    };

    if (tvShows.some((show) => !show.poster)) {
      fetchPosters();
    }
  }, [tvShows, apiKey]);

  const handleFlip = (id) => {
    setFlipped((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const formatTitleForLevidia = (title) =>
    title.replace(/:/g, "").replace(/\s+/g, "-").replace(/&/g, "").replace(/'/g, "");

  const openInIframe = (title) => {
    const url = `https://www.levidia.ch/tv-show.php?watch=${formatTitleForLevidia(title)}`;
    setIframeSrc(url);
  };

  return (
    <div className="tv-show-list">
      <h2>Popular TV Shows</h2>
      <div className="tv-show-container">
        {tvShows.map((show) => (
          <div
            key={show.id}
            className={`tv-show-card ${flipped[show.id] ? "flipped" : ""}`}
            onClick={() => handleFlip(show.id)}
          >
            <div className="tv-show-card-inner">
              {/* Front Side */}
              <div className="tv-show-card-front">
                <img src={show.poster || "https://via.placeholder.com/250x300"} alt={show.title} />
                <h3>{show.title}</h3>
                <h5>({show.year})</h5>
              </div>

              {/* Back Side */}
              <div className="tv-show-card-back">
                <img
                  src={show.poster || "https://via.placeholder.com/250x300"}
                  alt={show.title}
                />
                <button className="favorite-btn">⭐ Add to Favorites</button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openInIframe(show.title);
                  }}
                  className="levidia-link"
                >
                  ▶️ Watch in Page
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {iframeSrc && (
        <div className="iframe-wrapper" style={{ marginTop: "30px" }}>
          <h3>Now Playing:</h3>
          <iframe
            title="TV Show Stream"
            src={iframeSrc}
            width="100%"
            height="800px"
            style={{ border: "2px solid #ccc", borderRadius: "12px" }}
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
}
