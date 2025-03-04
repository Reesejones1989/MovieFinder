import { useState, useEffect } from "react";
import './SearchBar.css'



export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isTVShow, setIsTVShow] = useState(true);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Visitor count logic (runs only once)
    let visitCount = localStorage.getItem("visitCount");
    if (!visitCount) {
      localStorage.setItem("visitCount", 1);
    } else {
      localStorage.setItem("visitCount", Number(visitCount) + 1);
    }
    console.log("Visitor count:", localStorage.getItem("visitCount"));
  }, []); // <-- This should NOT be inside another useEffect
  
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
          setSuggestions(data.results.slice(0, 5)); // Show top 5 suggestions
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 500);
  
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isTVShow]); // This effect tracks search input changes
  


  
  const handleSearch = () => {
    if (!searchTerm.trim()) return;
  
    let formattedSearch = searchTerm
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with dashes globally
    .replace(/:/g, ""); //removes colons
  
    if (formattedSearch.includes("Spider-Man")) {
      formattedSearch = formattedSearch.replace("Spider-Man", "Spiderman");
    }
    const apiKey = import.meta.env.VITE_TMDB_API_KEY; 
    const poster_url = `http://api.themoviedb.org/3/search/movie?${apiKey}&query=${formattedSearch}`
    console.log(poster_url)

    const baseUrl = isTVShow
      ? "https://www.levidia.ch/tv-show.php?watch="
      : "https://www.levidia.ch/movie.php?watch=";
  
    window.open(baseUrl + formattedSearch, "_blank");
  };



  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.title || suggestion.name); // Use title for movies, name for TV shows
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

        {/* Display search suggestions with posters */}
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((item) => (
              <div key={item.id} onClick={() => handleSuggestionClick(item)}>
                <img 
                  src={item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : "https://via.placeholder.com/50x75"} 
                  height="200" width="150" alt={item.title || item.name}
                  className="poster"
                />
                <span>{item.title || item.name}</span>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
