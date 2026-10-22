import "./MovieList.css";
import React, { useState, useEffect } from "react";
import initialMovies from "../hardCodedLists/InitialMovies";
import NetflixMovies from "./NetflixMovies";
import MediaRow from "../MediaRow/MediaRow.jsx";
import { useFavorites } from "../FavoritesContext.jsx";

export default function MovieList() {
  const [movies, setMovies] = useState(initialMovies);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [postersFetched, setPostersFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trendingError, setTrendingError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const { addToFavorites } = useFavorites();


  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        setLoading(true);
        setTrendingError(null);

        const res = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
        );
        if (!res.ok) throw new Error(`TMDB error ${res.status}`);

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
        setTrendingError("Couldn't load trending movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, [apiKey, reloadKey]);

  useEffect(() => {
    if (!postersFetched) {
      const fetchPosters = async () => {
        try {
          setLoading(true);

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

                  const detailRes = await fetch(
                    `https://api.themoviedb.org/3/movie/${match.id}?api_key=${apiKey}`
                  );

                  const details = await detailRes.json();

                  return {
                    ...movie,
                    id: match.id,
                    title: match.title,
                    year: match.release_date?.split("-")[0] || "N/A",

                    poster: match.poster_path
                      ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${match.poster_path}`
                      : movie.poster,

                    imdb_id: details.imdb_id || null,
                    overview: details.overview || "",
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
        } finally {
          setLoading(false);
        }
      };

      fetchPosters();
    }
  }, [postersFetched, apiKey]);

  const formatTitleForLevidia = (title) =>
    title
      .replace(/:/g, "")
      .replace(/\s+/g, "-")
      .replace(/&/g, "")
      .replace(/'/g, "");

  const getWatchLinks = (movie) => {
    const links = [];

    if (movie.imdb_id)
      links.push({
        url: `https://vsembed.ru/embed/movie/${movie.imdb_id}`,
        label: "▶️ Watch on Vidsrc",
      });

    links.push({
      url: `https://www.levidia.ch/movie.php?watch=${formatTitleForLevidia(
        movie.title
      )}`,
      label: "▶️ Watch on Levidia",
    });

    return links;
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <h2 className="loading-text">Loading Movies...</h2>
      </div>
    );
  }

  return (
    <div className="movie-list">
      <h2>Movies</h2>

      <MediaRow
        title="🔥 Trending Movies"
        items={trendingMovies}
        type="movie"
        error={trendingError}
        empty={!trendingError && trendingMovies.length === 0}
        emptyText="No trending movies right now."
        onRetry={() => setReloadKey((k) => k + 1)}
      />

      <MediaRow title="🎬 Popular Movies" items={movies} type="movie" />

      <NetflixMovies />
    </div>
  );
}
