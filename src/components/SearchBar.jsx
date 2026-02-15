import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";
import { useFavorites } from "./FavoritesContext.jsx";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const { addToFavorites, isFavorite } = useFavorites();

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        // 🔥 Multi search (movie + tv automatically)
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?query=${searchTerm}&api_key=${apiKey}`
        );

        const data = await res.json();
        if (!data.results) return;

        // Only keep movies + tv
        const filtered = data.results.filter(
          (item) => item.media_type === "movie" || item.media_type === "tv"
        );

        // Fetch imdb_id for each result
        const detailed = await Promise.all(
          filtered.slice(0, 5).map(async (item) => {
            const endpoint =
              item.media_type === "movie"
                ? `https://api.themoviedb.org/3/movie/${item.id}?api_key=${apiKey}`
                : `https://api.themoviedb.org/3/tv/${item.id}/external_ids?api_key=${apiKey}`;

            const detailRes = await fetch(endpoint);
            const detailData = await detailRes.json();

            const imdb_id =
              item.media_type === "movie"
                ? detailData.imdb_id
                : detailData.imdb_id;

            return { ...item, imdb_id };
          })
        );

        setSuggestions(detailed.filter((item) => item.imdb_id));
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    const delay = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(delay);
  }, [searchTerm, apiKey]);

  const handleNavigate = (item) => {
    if (!item.imdb_id) return;

    if (item.media_type === "movie") {
      navigate(`/movie/${item.imdb_id}`);
    } else {
      navigate(`/tv/${item.imdb_id}?season=1&episode=1`);
    }

    setSearchTerm("");
    setSuggestions([]);
  };

  return (
    <div className="search-wrapper">
      <h3>MovieFinder Search</h3>
      <div className="search-bar">
        <img src="/MovieFinder.jpg" width={100} height={100} ></img>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Movies or TV Shows..."
        />
      </div>

      {suggestions.map((item) => {
        const title = item.title || item.name;
        const year =
          (item.release_date && item.release_date.substring(0, 4)) ||
          (item.first_air_date && item.first_air_date.substring(0, 4)) ||
          "";

        return (
          <div key={item.id} className="suggestion-item">
            <img
              src={
                item.poster_path
                  ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                  : "https://via.placeholder.com/50x75"
              }
              alt={title}
            />

            <div className="suggestion-details">
              <span>
                {title} {year && `(${year})`}
              </span>

              <div className="link-buttons">
                <button onClick={() => handleNavigate(item)}>
                  Open
                </button>
              </div>

              <button
                onClick={() =>
                  addToFavorites({
                    ...item,
                    type: item.media_type,
                  })
                }
                className={
                  isFavorite(item.id, item.media_type)
                    ? "favorite-btn active"
                    : "favorite-btn"
                }
              >
                {isFavorite(item.id, item.media_type)
                  ? "❤️ In Favorites"
                  : "⭐ Add to Favorites"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
