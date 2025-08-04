import "./MovieList.css";
import React from 'react'
import { useState, useEffect } from "react";
import initialMovies from '../hardCodedLists/InitialMovies';
import NetflixMovies from './NetflixMovies';

export default function MovieList() {
  const [movies, setMovies] = useState(initialMovies);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [postersFetched, setPostersFetched] = useState(false);
  const [showDescriptions, setShowDescriptions] = useState({});
  const [showTrending, setShowTrending] = useState(true);
  const [showPopular, setShowPopular] = useState(true);

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  const token = localStorage.getItem("token");

  const toggleFlip = (id) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleDescription = (id) => {
    setShowDescriptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTrending = () => setShowTrending(prev => !prev);
  const togglePopular = () => setShowPopular(prev => !prev);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
        );
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

        setTrendingMovies(enrichedMovies);
      } catch (err) {
        console.error("Failed to fetch trending movies:", err);
      }
    };

    fetchTrendingMovies();
  }, [apiKey]);

  useEffect(() => {
    if (!postersFetched) {
      const fetchPosters = async () => {
        const updatedMovies = await Promise.all(
          movies.map(async (movie) => {
            if (movie.poster && movie.imdb_id && movie.overview) return movie;

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
                  overview: detailsData.overview,
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
  }, [postersFetched, apiKey, movies]);

  const formatTitleForLevidia = (title) =>
    title.replace(/:/g, "").replace(/\s+/g, "-").replace(/&/g, "").replace(/'/g, "");

  const getWatchLinks = (movie) => {
    const links = [];

    if (movie.title === "Thunderbolts*") {
      links.push({
        url: "https://mcloud.vvid30c.site/watch/?v41#V21XWnRxbStia0MySnlRNlBVMzVYTHNEQ2JwN0FsWlRHaTBXeUtQUm5icjl1cG92a01xMWl0eGkzY2UwMmdGejE2dkFvb1N0Vmw4PQ",
        label: "▶️ Watch Thunderbolts* (Direct)",
      });
    }

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

  const addToFavorites = async (movie) => {
    try {
      //const apiBase = import.meta.env.VITE_API_URL;
      const response = await fetch(`http://localhost:5000/api/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieId: movie.id,
          title: movie.title,
        }),
      });

      const text = await response.text();

      try {
        const data = JSON.parse(text);
        
        if (response.ok) {
          // Handle success with data
          console.log("Success:", data);
        } else {
          // Handle error response with data.message or similar
          alert(data.message || "Something went wrong");
        }
      
      } catch (err) {
        // Not JSON (likely HTML error page)
        console.error("Failed to parse JSON, response was:", text);
        alert("Unexpected server response, please try again later.");
      }
     

      if (response.ok) {
        alert(`${movie.title} added to favorites!`);
      } else {
        alert(data.message || "Failed to add favorite.");
      }
    } catch (error) {
      console.error("Error adding favorite:", error);
      alert("Server response was not valid JSON. See console.");
    }
  };

  const renderMovieCards = (movieArray) => (
    <div className="movie-container">
      
      {movieArray.map((movie) => {
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
                <button
                  className="favorite-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToFavorites(movie);
                  }}
                >
                  ⭐ Add to Favorites
                </button>
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
  );

  return (
    <div className="movie-list">
      <div className="collapsible-section">
        <h2 onClick={toggleTrending} className="collapsible-header">
          🔥 Trending Movies {showTrending ? "▲" : "▼"}
        </h2>
        {showTrending && renderMovieCards(trendingMovies)}
      </div>

      <div className="collapsible-section">
        <h2 onClick={togglePopular} className="collapsible-header">
          🎬 Popular Movies {showPopular ? "▲" : "▼"}
        </h2>
        {showPopular && renderMovieCards(movies)}
      </div>

      <NetflixMovies />
    </div>
  );
}
