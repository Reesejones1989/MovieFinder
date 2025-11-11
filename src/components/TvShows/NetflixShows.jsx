import React, { useEffect, useState } from "react";
import "./TvShowList.css";
import Cards from "../Cards.jsx"

export default function NetflixShows() {
  const [shows, setShows] = useState([]);
  const [error, setError] = useState(null);
  const [showNetflixShows, setShowNetflixShows] = useState(true);
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  const toggleNetflixShows = () => setShowNetflixShows((prev) => !prev);

  const formatTitleForLevidia = (title) =>
    (title || "")
      .replace(/:/g, "")
      .replace(/\s+/g, "-")
      .replace(/&/g, "")
      .replace(/'/g, "")
      .toLowerCase();

  const getWatchLinks = (show) => {
    const links = [];

    if (show.imdb_id) {
      links.push({
        url: `https://vidsrc.xyz/embed/tv/${show.imdb_id}`,
        label: "▶️ Watch on VidSrc",
      });
    }

    const formattedTitle = formatTitleForLevidia(show.title);
    if (formattedTitle) {
      links.push({
        url: `https://www.levidia.ch/tv-show.php?watch=${formattedTitle}`,
        label: "▶️ Watch on Levidia",
      });
    }

    return links;
  };

  useEffect(() => {
    const fetchPopularNetflixShows = async () => {
      try {
        const today = new Date();
        const ninetyDaysAgo = new Date(today);
        ninetyDaysAgo.setDate(today.getDate() - 90);
        const gteDate = ninetyDaysAgo.toISOString().split("T")[0];

        const url = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_watch_providers=8&watch_region=US&with_watch_monetization_types=flatrate&first_air_date.gte=${gteDate}&sort_by=popularity.desc&page=1`;

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
              title: show.name,
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
          {shows.map((show) => (
            <Cards key={show.id} item={show} type="tv" getWatchLinks={getWatchLinks} />
          ))}
        </div>
      )}
    </div>
  );
}
