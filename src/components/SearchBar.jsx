import React, { useState, useEffect } from "react";
import './SearchBar.css';
import { useFavorites } from './FavoritesContext.jsx';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isTVShow, setIsTVShow] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const { addToFavorites, isFavorite } = useFavorites();

  useEffect(() => {
    const visitCount = localStorage.getItem("visitCount");
    localStorage.setItem("visitCount", visitCount ? Number(visitCount) + 1 : 1);
    console.log("Visitor count:", localStorage.getItem("visitCount"));
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const type = isTVShow ? "tv" : "movie";
      const url = `https://api.themoviedb.org/3/search/${type}?query=${searchTerm}&api_key=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results) {
          const detailedResults = await Promise.all(
            data.results.slice(0, 5).map(async (item) => {
              const detailsUrl = `https://api.themoviedb.org/3/${type}/${item.id}?api_key=${apiKey}`;
              const detailResp = await fetch(detailsUrl);
              const detailData = await detailResp.json();

              let imdb_id = detailData.imdb_id || null;

              if (isTVShow) {
                const externalIdsUrl = `https://api.themoviedb.org/3/tv/${item.id}/external_ids?api_key=${apiKey}`;
                const externalIdsResp = await fetch(externalIdsUrl);
                const externalIdsData = await externalIdsResp.json();
                imdb_id = externalIdsData.imdb_id || imdb_id;
              }

              return {
                ...item,
                imdb_id,
              };
            })
          );

          setSuggestions(detailedResults);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const delayDebounceFn = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isTVShow]);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    let formattedSearch = searchTerm.trim().replace(/\s+/g, "-").replace(/:/g, "");
    if (formattedSearch.includes("Spider-Man")) {
      formattedSearch = formattedSearch.replace("Spider-Man", "Spiderman");
    }

    const matchedSuggestion = suggestions.find(s =>
      (s.title || s.name).toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    const imdbId = matchedSuggestion?.imdb_id;
    if (imdbId) {
      const vidsrcUrl = `https://vidsrc.xyz/embed/${isTVShow ? "tv" : "movie"}/${imdbId}`;
      window.open(vidsrcUrl, "_blank");
    } else {
      alert("No match with IMDb ID found. Try selecting a suggestion.");
    }
  };

  const handleAddToFavorites = async (item) => {
    const itemWithType = {
      ...item,
      type: isTVShow ? 'tv' : 'movie'
    };
    
    const success = await addToFavorites(itemWithType);
    if (success) {
      alert(`${item.title || item.name} added to favorites!`);
    } else {
      alert(`${item.title || item.name} is already in your favorites!`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.title || suggestion.name);
    setSuggestions([]);
  };

  return (
    <div className="search-wrapper">
      <div className="search-bar">
        <button className="toggle-btn" onClick={() => setIsTVShow(!isTVShow)}>
          {isTVShow ? "Switch to Search Movies" : "Switch to Search TV Shows"}
        </button>

        <input
          type="text"
          placeholder={isTVShow ? "Search TV Shows..." : "Search Movies..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>Search</button>
      </div>

      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((item) => {
            const formattedTitle = (item.title || item.name)
              .replace(/\s+/g, "-")
              .replace(/:/g, "")
              .replace("Spider-Man", "Spiderman");

            const levidiaUrl = isTVShow
              ? `https://www.levidia.ch/tv-show.php?watch=${formattedTitle}`
              : `https://www.levidia.ch/movie.php?watch=${formattedTitle}`;

            const vidsrcUrl = item.imdb_id
              ? `https://vidsrc.xyz/embed/${isTVShow ? "tv" : "movie"}/${item.imdb_id}`
              : null;

            return (
              <div key={item.id} className="suggestion-item">
                <img
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                      : "https://via.placeholder.com/50x75"
                  }
                  height="200"
                  width="150"
                  alt={item.title || item.name}
                  className="poster"
                  onClick={() => handleSuggestionClick(item)}
                />
                <div className="suggestion-details">
                  <span>{item.title || item.name}</span>
                  <div className="link-buttons">
                    <a href={levidiaUrl} target="_blank" rel="noopener noreferrer">
                      <button>Levidia</button>
                    </a>
                    {vidsrcUrl && (
                      <a href={vidsrcUrl} target="_blank" rel="noopener noreferrer">
                        <button>VidSrc</button>
                      </a>
                    )}
                  </div>
                  <button 
                    onClick={() => handleAddToFavorites(item)}
                    className={isFavorite(item.id, isTVShow ? 'tv' : 'movie') ? 'favorite-btn active' : 'favorite-btn'}
                  >
                    {isFavorite(item.id, isTVShow ? 'tv' : 'movie') ? '❤️ In Favorites' : '⭐ Add to Favorites'}
                  </button>
                </div>
              </div>
            );
          })}
        </ul>
      )}
    </div>
  );
}
