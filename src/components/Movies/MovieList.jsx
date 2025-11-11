import "./MovieList.css";
import React, { useState, useEffect } from "react";
import initialMovies from "../hardCodedLists/InitialMovies";
import NetflixMovies from "./NetflixMovies";
import Cards from "../Cards.jsx";
import { useFavorites } from "../FavoritesContext.jsx";

export default function MovieList() {
  const [movies, setMovies] = useState(initialMovies);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [postersFetched, setPostersFetched] = useState(false);
  const [showTrending, setShowTrending] = useState(true);
  const [showPopular, setShowPopular] = useState(true);

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const { addToFavorites } = useFavorites();

  const toggleTrending = () => setShowTrending((prev) => !prev);
  const togglePopular = () => setShowPopular((prev) => !prev);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
        );
        const data = await res.json();

        const enriched = await Promise.all(
          data.results.map(async (movie) => {
            const detailRes = await fetch(
              `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`
            );
            const detailData = await detailRes.json();
            return {
              id: movie.id,
              title: movie.title,
              year: movie.release_date?.split("-")[0] || "N/A",
              poster: movie.poster_path
                ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`
                : "",
              imdb_id: detailData.imdb_id || null,
              overview: detailData.overview || "",
            };
          })
        );

        setTrendingMovies(enriched);
      } catch (err) {
        console.error("Failed to fetch trending movies:", err);
      }
    };

    fetchTrendingMovies();
  }, [apiKey]);

  useEffect(() => {
    if (!postersFetched) {
      const fetchPosters = async () => {
        const updated = await Promise.all(
          movies.map(async (movie) => {
            try {
              const res = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
                  movie.title
                )}`
              );
              const data = await res.json();
              if (data.results?.length > 0) {
                const match = data.results[0];
                const detailsRes = await fetch(
                  `https://api.themoviedb.org/3/movie/${match.id}?api_key=${apiKey}`
                );
                const details = await detailsRes.json();
                return {
                  ...movie,
                  poster: movie.poster
                    ? movie.poster
                    : `https://image.tmdb.org/t/p/w600_and_h900_bestv2${match.poster_path}`,
                  imdb_id: details.imdb_id,
                  overview: details.overview,
                };
              }
            } catch (error) {
              console.error(`Error fetching ${movie.title}:`, error);
            }
            return movie;
          })
        );

        setMovies(updated);
        setPostersFetched(true);
      };
      fetchPosters();
    }
  }, [postersFetched, apiKey, movies]);

  const formatTitleForLevidia = (title) =>
    title.replace(/:/g, "").replace(/\s+/g, "-").replace(/&/g, "").replace(/'/g, "");

  const getWatchLinks = (movie) => {
    const links = [];
    if (movie.imdb_id)
      links.push({
        url: `https://vidsrc.xyz/embed/movie/${movie.imdb_id}`,
        label: "▶️ Watch on Vidsrc",
      });
    links.push({
      url: `https://www.levidia.ch/movie.php?watch=${formatTitleForLevidia(movie.title)}`,
      label: "▶️ Watch on Levidia",
    });
    return links;
  };

  return (
    <div className="movie-list">
      <h2>Movies</h2>

      <h2 onClick={toggleTrending} className="collapsible-header">
        🔥 Trending Movies {showTrending ? "▲" : "▼"}
      </h2>
      {showTrending && (
        <div className="movie-container">
          {trendingMovies.map((m) => (
            <Cards key={m.id} item={m} type="movie" getWatchLinks={getWatchLinks} />
          ))}
        </div>
      )}

      <h2 onClick={togglePopular} className="collapsible-header">
        🎬 Popular Movies {showPopular ? "▲" : "▼"}
      </h2>
      {showPopular && (
        <div className="movie-container">
          {movies.map((m) => (
            <Cards key={m.id} item={m} type="movie" getWatchLinks={getWatchLinks} />
          ))}
        </div>
      )}

      <NetflixMovies />
    </div>
  );
}
