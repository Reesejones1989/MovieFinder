import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";
import { useFavorites } from "./FavoritesContext.jsx";
import newMovieFinder from "../assets/NewMovieFinder.jpg";
import MovieFinder from "../assets/MovieFinder.jpg";


export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchError, setSearchError] = useState(null);
  const itemRefs = useRef([]);
  const navigate = useNavigate();
  const { addToFavorites, isFavorite } = useFavorites();

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setSearchError(null);
      setActiveIndex(-1);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        // 🔥 Multi search (movie + tv automatically)
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(searchTerm.trim())}&api_key=${apiKey}`
        );

        if (!res.ok) throw new Error(`TMDB search failed (${res.status})`);
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
        setSearchError(null);
        setActiveIndex(-1);
      } catch (err) {
        console.error("Search error:", err);
        setSuggestions([]);
        setSearchError("Search is unavailable right now. Please try again in a moment.");
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
    setActiveIndex(-1);
  };

  // ⌨️ Arrow keys move through suggestions, Enter opens, Escape clears
  const handleKeyDown = (e) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleNavigate(suggestions[activeIndex >= 0 ? activeIndex : 0]);
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  // Keep the highlighted suggestion visible
  useEffect(() => {
    if (activeIndex >= 0) {
      itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  return (
    <div className="search-wrapper">
      <h3>MovieFinder Search</h3>
      <div className="search-bar">
        <img src={MovieFinder} width={100} height={100} alt="Movie Finder"></img>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search Movies or TV Shows..."
          role="combobox"
          aria-expanded={suggestions.length > 0}
          aria-controls="search-suggestions"
          aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
        />
      </div>

      {searchError && <p className="search-error" role="alert">{searchError}</p>}

      <div id="search-suggestions" role="listbox">
      {suggestions.map((item, index) => {
        const title = item.title || item.name;
        const year =
          (item.release_date && item.release_date.substring(0, 4)) ||
          (item.first_air_date && item.first_air_date.substring(0, 4)) ||
          "";

        return (
          <div
            key={`${item.media_type}-${item.id}`}
            id={`suggestion-${index}`}
            ref={(el) => (itemRefs.current[index] = el)}
            role="option"
            aria-selected={index === activeIndex}
            className={`suggestion-item${index === activeIndex ? " active" : ""}`}
            onMouseEnter={() => setActiveIndex(index)}
          >
            <img
              loading="lazy"
              decoding="async"
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
    </div>
  );
}
