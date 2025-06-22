import "./AnimeList.css";
import { useState, useEffect } from "react";

const initialAnimes = [
  { id: 1, title: "Solo Leveling", year: 2025, poster: "" },
  { id: 2, title: "Dragon Ball Daima", year: 2025, poster: "" },
  { id: 3, title: "Invincible", year: 2024, poster: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/hNdCIFmVCZRg1NgU2lveqnZRPZj.jpg" },
  { id: 4, title: "My Hero Academia", year: 2024, poster: "" },
  { id: 5, title: "Demon Slayer", year: 2024, poster: "" },
  { id: 6, title: "One Piece", year: 2024, poster: "" },
  { id: 7, title: "JuJutsu Kaisen", year: 2024, poster: "" },
  { id: 8, title: "Hunter x Hunter", year: 2007, poster: "" },
  { id: 9, title: "Bleach", year: 2025, poster: "" },
  { id: 10, title: "Boruto", year: 2022, poster: "" },
  { id: 11, title: "Dan-Da-dan", year: 2022, poster: "" },
  { id: 12, title: "Dr. Stone", year: 2024, poster: "" },
];

export default function AnimeList() {
  const [animes, setAnimes] = useState(initialAnimes);
  const [trending, setTrending] = useState([]);
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchPostersAndIds = async () => {
      const updatedAnimes = await Promise.all(
        animes.map(async (anime) => {
          if (anime.poster && anime.imdb_id) return anime;

          try {
            const searchRes = await fetch(
              `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(anime.title)}`
            );
            const searchData = await searchRes.json();

            if (searchData.results && searchData.results.length > 0) {
              const match = searchData.results[0];

              const detailsRes = await fetch(
                `https://api.themoviedb.org/3/tv/${match.id}/external_ids?api_key=${apiKey}`
              );
              const detailsData = await detailsRes.json();

              return {
                ...anime,
                poster:
                  anime.poster || `https://image.tmdb.org/t/p/w600_and_h900_bestv2${match.poster_path}`,
                imdb_id: detailsData.imdb_id,
              };
            }
          } catch (error) {
            console.error(`Error fetching data for ${anime.title}:`, error);
          }

          return anime;
        })
      );

      setAnimes(updatedAnimes);
    };

    if (animes.some((anime) => !anime.poster || !anime.imdb_id)) {
      fetchPostersAndIds();
    }
  }, [animes, apiKey]);

  useEffect(() => {
    const fetchTrendingAnime = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`
        );
        const data = await res.json();

        const trendingAnime = data.results.filter((item) =>
          item.genre_ids.includes(16) // Filter for Animation genre (ID 16)
        );

        const animeSubset = await Promise.all(
          trendingAnime.slice(0, 12).map(async (item, index) => {
            const detailsRes = await fetch(
              `https://api.themoviedb.org/3/tv/${item.id}/external_ids?api_key=${apiKey}`
            );
            const detailsData = await detailsRes.json();

            return {
              id: `trend-${index}`,
              title: item.name,
              year: item.first_air_date?.split("-")[0] || "N/A",
              poster: `https://image.tmdb.org/t/p/w600_and_h900_bestv2${item.poster_path}`,
              imdb_id: detailsData.imdb_id || null, // Retrieve imdb_id for each trending anime
            };
          })
        );

        setTrending(animeSubset);
      } catch (err) {
        console.error("Error fetching trending anime:", err);
      }
    };

    fetchTrendingAnime();
  }, [apiKey]);

  const getWatchLinks = (anime) => {
    const links = [];

    if (anime.imdb_id) {
      links.push({
        url: `https://vidsrc.xyz/embed/tv/${anime.imdb_id}`,
        label: "▶️ Watch on Vidsrc",
      });
    }

    links.push({
      url: `https://fastflix.to/tvshows/${anime.title.replace(/\s+/g, "-")}`,
      label: "▶️ Search on FastFlix",
    });

    return links;
  };

  const renderAnimeCard = (anime) => {
    const links = getWatchLinks(anime);

    return (
      <div key={anime.id} className="anime">
        <img
          src={anime.poster || "https://via.placeholder.com/250x300"}
          height="300"
          width="250"
          alt={anime.title}
        />
        <div>
          <h3>{anime.title}</h3>
          <p>({anime.year})</p>
          {links.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="watch-link">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    );
  };

  const renderTrendingAnimeCard = (anime) => {
    const links = getWatchLinks(anime);

    return (
      <div key={anime.id} className="anime">
        <img
          src={anime.poster || "https://via.placeholder.com/250x300"}
          height="300"
          width="250"
          alt={anime.title}
        />
        <div>
          <h3>{anime.title}</h3>
          <p>({anime.year})</p>
          {links.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="watch-link">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="anime-list">
      <div className="anime-container">
        {animes.map(renderAnimeCard)}
      </div>

      <h2>Trending Anime</h2>
      <div className="anime-container">
        {trending.map(renderTrendingAnimeCard)}
      </div>
    </div>
  );
}
