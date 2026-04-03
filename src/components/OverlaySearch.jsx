import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./OverlaySearch.css";

export default function OverlaySearch() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  // 🔥 Safer route check (case-insensitive)
  const path = location.pathname.toLowerCase();
  const isSearchAllowed =
    path.startsWith("/movies") || path.startsWith("/tv");

  // 🔁 Toggle function
  const toggleSearch = () => {
    setOpen((prev) => !prev);
  };

  // ⌨️ Open "/" + Close "ESC"
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "/" && isSearchAllowed) {
        e.preventDefault();
        setOpen(true);
      }

      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isSearchAllowed]);

  // 🎯 Focus input when open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // 🔥 Debounced search
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

  // 🎮 Keyboard navigation
  useEffect(() => {
    const handleNav = (e) => {
      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }

      if (e.key === "Enter") {
        const item = results[activeIndex];
        if (!item) return;
        navigateTo(item);
      }
    };

    window.addEventListener("keydown", handleNav);
    return () => window.removeEventListener("keydown", handleNav);
  }, [results, activeIndex, open]);

  // 🚀 Navigate to movie/tv
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

    // reset state
    setOpen(false);
    setSearchTerm("");
    setResults([]);
  };

  // 🚫 Hide completely if not allowed
  if (!isSearchAllowed) return null;

  return (
    <>
      {/* 🔘 Toggle Button */}
      <button className="search-trigger" onClick={toggleSearch}>
        {open ? "✖ Close" : "🔍 Search"}
      </button>

      {open && (
        <div className="overlay" onClick={toggleSearch}>
          <div
            className="overlay-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ❌ Close Button */}
            <div className="overlay-header">
              <button className="close-btn" onClick={toggleSearch}>
                ✖
              </button>
            </div>

            {/* 🔍 Input */}
            <input
              ref={inputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search movies or TV..."
            />

            {/* 🔄 Loader */}
            {loading && <div className="loader" />}

            {/* 📄 Results */}
            <div className="results">
              {results.map((item, index) => {
                const title = item.title || item.name;

                return (
                  <div
                    key={item.id}
                    className={`result-item ${
                      index === activeIndex ? "active" : ""
                    }`}
                    onClick={() => navigateTo(item)}
                  >
                    {title}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}