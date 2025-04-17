import "./MovieList.css";
import { useState, useEffect } from "react";

const initialMovies = [
  { id: 1, title: "The Monkey", year: "2025", poster: "" },
  { id: 2, title: "Opus", year: "2025", poster: "" },
  { id: 3, title: "One Of Them Days", year: "2025", poster: "" },
  { id: 4, title: "Novocaine", year: "2025", poster: "" },
  { id: 5, title: "Black Bag", year: "2025", poster: "" },
  { id: 6, title: "Both Eyes Open", year: "2025", poster: "" },
  { id: 7, title: "Cleaner", year: "2024", poster: "" },
  { id: 8, title: "Captain America: Brave New World", year: "2024", poster: "" },
  { id: 9, title: "Sacramento", year: "2025", poster: "" },
  { id: 10, title: "Mickey 17", year: "2025", poster: "" },
  { id: 11, title: "Companion", year: "2025", poster: "" },
  { id: 12, title: "The Substance", year: "2024", poster: "" },
  { id: 13, title: "It's What's Inside", year: "2024", poster: "" },
  { id: 14, title: "Blink Twice", year: "2024", poster: "" },
  { id: 15, title: "You're Cordially Invited", year: "2024", poster: "" },
];

export default function MovieList() {
  const [movies, setMovies] = useState(initialMovies);
  const [flipped, setFlipped] = useState({});
  const [postersFetched, setPostersFetched] = useState(false);

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    if (!postersFetched) {
      const fetchPosters = async () => {
        const updatedMovies = await Promise.all(
          movies.map(async (movie) => {
            if (movie.poster) return movie;

            try {
              const response = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movie.title)}`
              );
              const data = await response.json();

              if (data.results && data.results.length > 0 && data.results[0].poster_path) {
                return {
                  ...movie,
                  poster: `https://image.tmdb.org/t/p/w600_and_h900_bestv2${data.results[0].poster_path}`,
                };
              }
            } catch (error) {
              console.error(`Error fetching poster for ${movie.title}:`, error);
            }
            return movie;
          })
        );

        setMovies(updatedMovies);
        setPostersFetched(true);
      };

      fetchPosters();
    }
  }, [postersFetched, apiKey]);

  const formatTitleForLevidia = (title) =>
    title.replace(/:/g, "").replace(/\s+/g, "-").replace(/&/g, "").replace(/'/g, "");

  const toggleFlip = (id) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="movie-list">
      <h2>Popular Movies</h2>
      <div className="movie-container">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className={`movie-card ${flipped[movie.id] ? "flipped" : ""}`}
            onClick={() => toggleFlip(movie.id)}
          >
            <div className="movie-card-inner">
              {/* Front Side */}
              <div className="movie-card-front">
                <img
                  src={movie.poster || "https://via.placeholder.com/250x300"}
                  alt={movie.title}
                />
                <h3>{movie.title}</h3>
                <p>({movie.year})</p>
              </div>

              {/* Back Side */}
              <div className="movie-card-back">
                <img
                  src={movie.poster || "https://via.placeholder.com/250x300"}
                  alt={movie.title}
                />
                <button className="favorite-btn">⭐ Add to Favorites</button>
                <a
                  href={`https://www.levidia.ch/movie.php?watch=${formatTitleForLevidia(movie.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="levidia-link"
                >
                  ▶️ Watch on Levidia
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
