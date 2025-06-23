import { useEffect, useState } from "react";
import React from 'react'

import "./TvShowList.css";

export default function NetflixShows() {
  const [shows, setShows] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [showDescriptions, setShowDescriptions] = useState({});
  const [error, setError] = useState(null);
  const [showNetflixShows, setShowNetflixShows] = useState(true);
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  const toggleFlip = (id) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleDescription = (id) => {
    setShowDescriptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleNetflixShows = () => setShowNetflixShows((prev) => !prev);

  const formatTitleForLevidia = (title) =>
    title.replace(/:/g, "").replace(/\s+/g, "-").replace(/&/g, "").replace(/'/g, "");

  const getWatchLinks = (show) => {
    const links = [];

    if (show.imdb_id) {
      links.push({
        url: `https://vidsrc.xyz/embed/tv/${show.imdb_id}`,
        label: "▶️ Watch on Vidsrc",
      });
    }

    links.push({
      url: `https://www.levidia.ch/movie.php?watch=${formatTitleForLevidia(show.name)}`,
      label: "▶️ Watch on Levidia",
    });

    return links;
  };

  useEffect(() => {
    const fetchPopularNetflixShows = async () => {
      try {
        const today = new Date();
        const ninetyDaysAgo = new Date(today);
        ninetyDaysAgo.setDate(today.getDate() - 90);
        const gteDate = ninetyDaysAgo.toISOString().split("T")[0];

        const url = `https://api.themoviedb.org/3/discover/tv?` +
          `api_key=${apiKey}` +
          `&with_watch_providers=8` +
          `&watch_region=US` +
          `&with_watch_monetization_types=flatrate` +
          `&first_air_date.gte=${gteDate}` +
          `&sort_by=popularity.desc` +
          `&page=1`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch Netflix shows: ${res.status}`);

        const data = await res.json();

        const enrichedShows = await Promise.all(
          data.results.map(async (show) => {
            const detailRes = await fetch(
              `https://api.themoviedb.org/3/tv/${show.id}?api_key=${apiKey}&append_to_response=external_ids`
            );
            const detailData = await detailRes.json();

            return {
              id: show.id,
              name: show.name,
              year: show.first_air_date ? parseInt(show.first_air_date.split("-")[0]) : "N/A",
              poster: show.poster_path
                ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${show.poster_path}`
                : "",
              imdb_id: detailData?.external_ids?.imdb_id || null,
              overview: detailData.overview || "",
            };
          })
        );

        setShows(enrichedShows);
      } catch (err) {
        console.error("Error fetching Netflix shows:", err);
        setError("Could not load Netflix shows.");
      }
    };

    fetchPopularNetflixShows();
  }, [apiKey]);

  return (
    <div className="collapsible-section">
      <h2 onClick={toggleNetflixShows} className="collapsible-header">
        📺 Popular Netflix Shows (Last 90 Days) {showNetflixShows ? "▲" : "▼"}
      </h2>
      {error && <p>{error}</p>}
      {showNetflixShows && (
        <div className="movie-container">
          {shows.map((show) => {
            const watchLinks = getWatchLinks(show);
            return (
              <div
                key={show.id}
                className={`movie-card ${flipped[show.id] ? "flipped" : ""}`}
                onClick={() => toggleFlip(show.id)}
              >
                <div className="movie-card-inner">
                  <div className="movie-card-front">
                    <img
                      src={show.poster || "https://via.placeholder.com/250x300"}
                      alt={show.name}
                    />
                    <h3>{show.name}</h3>
                    <p>({show.year})</p>

                    {show.overview && (
                      <>
                        <button
                          className="read-desc-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDescription(show.id);
                          }}
                        >
                          {showDescriptions[show.id] ? "Hide Description" : "Read Description"}
                        </button>
                        {showDescriptions[show.id] && (
                          <p className="movie-description">{show.overview}</p>
                        )}
                      </>
                    )}
                  </div>

                  <div className="movie-card-back">
                    <img
                      src={show.poster || "https://via.placeholder.com/250x300"}
                      alt={show.name}
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
