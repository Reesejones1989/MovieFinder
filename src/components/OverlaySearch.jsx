import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./OverlaySearch.css";

export default function OverlaySearch({ open, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef();
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchTerm("");
      setResults([]);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Debounced search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?query=${searchTerm}&api_key=${apiKey}`
        );
        const data = await res.json();
        const filtered = (data.results || []).filter(
          (item) => item.media_type === "movie" || item.media_type === "tv"
        );
        setResults(filtered.slice(0, 8));
        setActiveIndex(0);
      } catch (err) {
        console.error("Search error:", err);
      }
      setLoading(false);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchTerm, apiKey]);

  // Keyboard navigation
  useEffect(() => {
    const handleNav = (e) => {
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }
      if (e.key === "Enter") {
        const item = results[activeIndex];
        if (item) navigateTo(item);
      }
    };
    window.addEventListener("keydown", handleNav);
    return () => window.removeEventListener("keydown", handleNav);
  }, [results, activeIndex, open]);

  const navigateTo = async (item) => {
    let imdb_id = null;
    try {
      const endpoint =
        item.media_type === "movie"
          ? `https://api.themoviedb.org/3/movie/${item.id}?api_key=${apiKey}`
          : `https://api.themoviedb.org/3/tv/${item.id}/external_ids?api_key=${apiKey}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      imdb_id = data.imdb_id;
    } catch (err) {
      console.error(err);
    }
    if (!imdb_id) return;

    if (item.media_type === "movie") {
      navigate(`/movie/${imdb_id}`);
    } else {
      navigate(`/tv/${imdb_id}?season=1&episode=1`);
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
        <div className="overlay-header">
          <span className="overlay-hint">Press ESC to close</span>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <input
          ref={inputRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search movies or TV shows..."
        />

        {loading && <div className="loader" />}

        <div className="results">
          {results.map((item, index) => (
            <div
              key={item.id}
              className={`result-item${index === activeIndex ? " active" : ""}`}
              onClick={() => navigateTo(item)}
            >
              <span className="result-title">{item.title || item.name}</span>
              <span className="result-type">
                {item.media_type === "movie" ? "Movie" : "TV"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
