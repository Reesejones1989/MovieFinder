import { useEffect, useState } from "react";
import "./MovieList.css";

export default function NetflixMovies() {
  const [movies, setMovies] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [showDescriptions, setShowDescriptions] = useState({});
  const [error, setError] = useState(null);
  const [showNetflix, setShowNetflix] = useState(true);
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  const toggleFlip = (id) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleDescription = (id) => {
    setShowDescriptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleNetflix = () => setShowNetflix((prev) => !prev);

  const formatTitleForLevidia = (title) =>
    title.replace(/:/g, "").replace(/\s+/g, "-").replace(/&/g, "").replace(/'/g, "");

  const getWatchLinks = (movie) => {
    const links = [];

    if (movie.imdb_id) {
      links.push({
        url: `https://vidsrc.xyz/embed/movie/${movie.imdb_id}`,
        label: "▶️ Watch on Vidsrc",
      });
    }

    links.push({
      url: `https://www.levidia.ch/movie.php?watch=${formatTitleForLevidia(movie.title)}`,
      label: "▶️ Watch on Levidia",
    });

    return links;
  };

  useEffect(() => {
    const fetchPopularNetflixMovies = async () => {
      try {
        const today = new Date();
        const ninetyDaysAgo = new Date(today);
        ninetyDaysAgo.setDate(today.getDate() - 90);
        const gteDate = ninetyDaysAgo.toISOString().split("T")[0];

        const url = `https://api.themoviedb.org/3/discover/movie?` +
          `api_key=${apiKey}` +
          `&watch_providers=8` +
          `&watch_region=US` +
          `&with_watch_monetization_types=flatrate` +
          `&primary_release_date.gte=${gteDate}` +
          `&sort_by=popularity.desc` +
          `&page=1`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch Netflix movies: ${res.status}`);

        const data = await res.json();

        const enrichedMovies = await Promise.all(
          data.results.map(async (movie) => {
            const detailRes = await fetch(
              `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`
            );
            const detailData = await detailRes.json();

            return {
              id: movie.id,
              title: movie.title,
              year: movie.release_date ? parseInt(movie.release_date.split("-")[0]) : "N/A",
              poster: movie.poster_path
                ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`
                : "",
              imdb_id: detailData.imdb_id || null,
              overview: detailData.overview || "",
            };
          })
        );

        setMovies(enrichedMovies);
      } catch (err) {
        console.error("Error fetching Netflix movies:", err);
        setError("Could not load Netflix movies.");
      }
    };

    fetchPopularNetflixMovies();
  }, [apiKey]);

  return (
    <div className="collapsible-section">
      <h2 onClick={toggleNetflix} className="collapsible-header">
        🎥 Popular Netflix Movies (Last 90 Days) {showNetflix ? "▲" : "▼"}
      </h2>
      {error && <p>{error}</p>}
      {showNetflix && (
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
                  <div className="movie-card-front">
                    <img
                      src={movie.poster || "https://via.placeholder.com/250x300"}
                      alt={movie.title}
                    />
                    <h3>{movie.title}</h3>
                    <p>({movie.year})</p>

                    {movie.overview && (
                      <>
                        <button
                          className="read-desc-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDescription(movie.id);
                          }}
                        >
                          {showDescriptions[movie.id] ? "Hide Description" : "Read Description"}
                        </button>
                        {showDescriptions[movie.id] && (
                          <p className="movie-description">{movie.overview}</p>
                        )}
                      </>
                    )}
                  </div>

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
      )}
    </div>
  );
}
