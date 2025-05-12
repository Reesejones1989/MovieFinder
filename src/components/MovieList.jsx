import "./MovieList.css";
import { useState, useEffect } from "react";

const initialMovies = [
  { id: 1, title: "Sinners", year: "2025", poster: "" },
  { id: 2, title: "Thunderbolts*", year: "2025", poster: "" },
  { id: 3, title: "A Minecraft Movie", year: "2025", poster: "" },
  { id: 4, title: "Novocaine", year: "2025", poster: "" },
  { id: 5, title: "Black Bag", year: "2025", poster: "" },
  { id: 6, title: "Drop", year: "2025", poster: "" },
  { id: 7, title: "Cleaner", year: "2024", poster: "" },
  { id: 8, title: "Captain America: Brave New World", year: "2024", poster: "" },
  { id: 9, title: "Sacramento", year: "2025", poster: "" },
  { id: 10, title: "Mickey 17", year: "2025", poster: "" },
  { id: 11, title: "Companion", year: "2025", poster: "" },
  { id: 12, title: "The Substance", year: "2024", poster: "" },
  { id: 13, title: "It's What's Inside", year: "2024", poster: "" },
  { id: 14, title: "The Monkey", year: "2024", poster: "" },
  { id: 15, title: "You're Cordially Invited", year: "2024", poster: "" },
  { id: 16, title: "Opus", year: "2025", poster: "" },
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
            if (movie.poster && movie.imdb_id) return movie;

            try {
              const searchRes = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movie.title)}`
              );
              const searchData = await searchRes.json();

              if (searchData.results && searchData.results.length > 0) {
                const movieMatch = searchData.results[0];

                const detailsRes = await fetch(
                  `https://api.themoviedb.org/3/movie/${movieMatch.id}?api_key=${apiKey}`
                );
                const detailsData = await detailsRes.json();

                return {
                  ...movie,
                  poster:
                    movie.poster ||
                    `https://image.tmdb.org/t/p/w600_and_h900_bestv2${movieMatch.poster_path}`,
                  imdb_id: detailsData.imdb_id,
                };
              }
            } catch (error) {
              console.error(`Error fetching data for ${movie.title}:`, error);
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

  const getWatchLinks = (movie) => {
    const links = [];

    // Special case for Thunderbolts*
    if (movie.title === "Thunderbolts*") {
      links.push({
        url: "https://mcloud.vvid30c.site/watch/?v41#V21XWnRxbStia0MySnlRNlBVMzVYTHNEQ2JwN0FsWlRHaTBXeUtQUm5icjl1cG92a01xMWl0eGkzY2UwMmdGejE2dkFvb1N0Vmw4PQ",
        label: "▶️ Watch Thunderbolts* (Direct)",
      });
    }

    // Vidsrc link
    if (movie.imdb_id) {
      links.push({
        url: `https://vidsrc.xyz/embed/movie/${movie.imdb_id}`,
        label: `▶️ Watch on Vidsrc`,
      });
    }

    // Levidia fallback
    links.push({
      url: `https://www.levidia.ch/movie.php?watch=${formatTitleForLevidia(movie.title)}`,
      label: `▶️ Watch on Levidia`,
    });

    return links;
  };

  return (
    <div className="movie-list">
      <h2>Popular Movies</h2>
      <div className="movie-container">
        {movies.map((movie) => {
          const watchLinks = getWatchLinks(movie);
          return (
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
                  {watchLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="levidia-link"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
