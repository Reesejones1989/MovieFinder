import { useState, useEffect } from "react";
import './SearchBar.css';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isTVShow, setIsTVShow] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  });

  useEffect(() => {
    const visitCount = localStorage.getItem("visitCount");
    if (!visitCount) {
      localStorage.setItem("visitCount", 1);
    } else {
      localStorage.setItem("visitCount", Number(visitCount) + 1);
    }
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

              return {
                ...item,
                imdb_id: detailData.imdb_id || null,
              };
            })
          );

          setSuggestions(detailedResults);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isTVShow]);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
  
    let formattedSearch = searchTerm
      .trim()
      .replace(/\s+/g, "-")
      .replace(/:/g, "");
  
    if (formattedSearch.includes("Spider-Man")) {
      formattedSearch = formattedSearch.replace("Spider-Man", "Spiderman");
    }
  
    const matchedSuggestion = suggestions.find(s =>
      (s.title || s.name)
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase())
    );
  
    const imdbId = matchedSuggestion?.imdb_id;
    console.log(imdbId);
  
    if (imdbId) {
      const vidsrcUrl = `https://vidsrc.xyz/embed/${isTVShow ? "tv" : "movie"}/${imdbId}`;
      window.open(vidsrcUrl, "_blank");
    } else {
      alert("No match with IMDb ID found. Try selecting a suggestion.");
    }
  
    /*
    // Old Levidia search fallback (kept in case needed again)
    const levidiaUrl = isTVShow
      ? `https://www.levidia.ch/tv-show.php?watch=${formattedSearch}`
      : `https://www.levidia.ch/movie.php?watch=${formattedSearch}`;
    window.open(levidiaUrl, "_blank");
    */
  };

  const handleAddToFavorites = async (item) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("You need to log in first!");
      return;
    }

    try {
      const response = await fetch("/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ movieId: item.id, title: item.title || item.name }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add favorite: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Favorite added successfully:", data);
    } catch (error) {
      console.error("Error adding favorite:", error);
      alert(error.message);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.title || suggestion.name);
    setSuggestions([]);
  };

  return (
    <div className="search-bar">
      <button className="toggle-btn" onClick={() => setIsTVShow(!isTVShow)}>
        {isTVShow ? "Search Movies" : "Search TV Shows"}
      </button>

      <div className="search-container">
        <input
          type="text"
          placeholder={isTVShow ? "Search TV Shows..." : "Search Movies..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>Search</button>

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
                    <button onClick={() => handleAddToFavorites(item)}>
                      Add to Favorites
                    </button>
                  </div>
                </div>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
