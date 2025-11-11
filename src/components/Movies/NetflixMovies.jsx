import React, { useEffect, useState } from "react";
import "./MovieList.css";
import Card from "../Cards";

export default function NetflixMovies() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [showMovies, setShowMovies] = useState(true);
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  const toggleMovies = () => setShowMovies((prev) => !prev);

  const formatTitleForLevidia = (title) =>
    (title || "")
      .replace(/:/g, "")
      .replace(/\s+/g, "-")
      .replace(/&/g, "")
      .replace(/'/g, "")
      .toLowerCase();

  const getWatchLinks = (movie) => {
    const links = [];

    if (movie.imdb_id) {
      links.push({
        url: `https://vidsrc.xyz/embed/movie/${movie.imdb_id}`,
        label: "▶️ Watch on VidSrc",
      });
    }

    const formattedTitle = formatTitleForLevidia(movie.title);
    if (formattedTitle) {
      links.push({
        url: `https://www.levidia.ch/movie.php?watch=${formattedTitle}`,
        label: "▶️ Watch on Levidia",
      });
    }

    return links;
  };

  useEffect(() => {
    const fetchPopularNetflixMovies = async () => {
      try {
        const today = new Date();
        const ninetyDaysAgo = new Date(today);
        ninetyDaysAgo.setDate(today.getDate() - 90);
        const gteDate = ninetyDaysAgo.toISOString().split("T")[0];

        const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_watch_providers=8&watch_region=US&with_watch_monetization_types=flatrate&primary_release_date.gte=${gteDate}&sort_by=popularity.desc&page=1`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch Netflix movies: ${res.status}`);

        const data = await res.json();

        const enrichedMovies = await Promise.all(
          data.results.map(async (movie) => {
            const detailRes = await fetch(
              `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&append_to_response=external_ids`
            );
            const detailData = await detailRes.json();

            return {
              id: movie.id,
              title: movie.title,
              year: movie.release_date ? parseInt(movie.release_date.split("-")[0]) : "N/A",
              poster: movie.poster_path
                ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`
                : "",
              imdb_id: detailData?.external_ids?.imdb_id || null,
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
      <h2 onClick={toggleMovies} className="collapsible-header">
        🎬 Popular Netflix Movies (Last 90 Days) {showMovies ? "▲" : "▼"}
      </h2>
      {error && <p>{error}</p>}
      {showMovies && (
        <div className="movie-container">
          {movies.map((movie) => (
            <Card key={movie.id} item={movie} type="movie" getWatchLinks={getWatchLinks} />
          ))}
        </div>
      )}
    </div>
  );
}
