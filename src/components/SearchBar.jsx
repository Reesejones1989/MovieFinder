import { useState, useEffect } from "react";
import './SearchBar.css'


export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isTVShow, setIsTVShow] = useState(true);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      const apiKey = "0b4c1848f729594e1ebc42d7493cc838"; 
      
      const type = isTVShow ? "tv" : "movie";
      const url = `https://api.themoviedb.org/3/search/${type}?query=${searchTerm}&api_key=${apiKey}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results) {
          setSuggestions(data.results.slice(0, 5)); // Show top 5 suggestions
          console.log("We're Here")
        }
      } catch (error) {
        console.log(poster_url.poster_path)

        console.error("Error fetching data:", error);
      }
    };

    fetchSuggestions();
  }, [searchTerm, isTVShow]);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    let formattedSearch = searchTerm.trim();

    if (formattedSearch.includes("Spider-Man")) {
      formattedSearch = formattedSearch.split(" ").join("-").replace("Spider-Man", "Spiderman");
    }

    if (!isTVShow) {
      formattedSearch = formattedSearch.split(" ").join("-"); // Convert spaces to dashes for movies
    }

    // Replace spaces with dashes for movie or TV show search
    //formattedSearch = formattedSearch.split(" ").join("-");
    const apiKey = "0b4c1848f729594e1ebc42d7493cc838"; 
    const poster_url = `http://api.themoviedb.org/3/search/movie?${apiKey}&query=${formattedSearch}`
console.log(poster_url)
    const baseUrl = isTVShow
      ? "https://www.levidia.ch/tv-show.php?watch="
      : "https://www.levidia.ch/movie.php?watch=";

    window.location.href = baseUrl + formattedSearch; // No need for encodeURIComponent since we already replaced spaces
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
