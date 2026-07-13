import React, { useEffect, useState } from "react";
import "./TvShowList.css";
import Cards from "../Cards.jsx";

export default function NetflixRealityShows() {

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  const [shows, setShows] = useState([]);
  const [error, setError] = useState(null);
  const [showNetflix, setShowNetflix] = useState(true);

  const toggleNetflix = () =>
    setShowNetflix(!showNetflix);

  const getWatchLinks = (show) => {
    const links = [];

    if (show.imdb_id) {
      links.push({
        url: `https://vsembed.ru/tv/${show.imdb_id}`,
        label: "▶️ Watch on Vidsrc",
      });
    }

    links.push({
      url: `https://www.levidia.ch/tv-show.php?watch=${show.title
        .replace(/:/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase()}`,
      label: "▶️ Watch on Levidia",
    });

    return links;
  };

  useEffect(() => {
    async function fetchNetflixReality() {
      try {
        const today = new Date();
        const ninety = new Date(today);

        ninety.setDate(today.getDate() - 90);

        const date = ninety.toISOString().split("T")[0];

        const url =
          `https://api.themoviedb.org/3/discover/tv?` +
          `api_key=${apiKey}` +
          `&with_watch_providers=8` +
          `&watch_region=US` +
          `&with_watch_monetization_types=flatrate` +
          `&with_genres=10764` +
          `&first_air_date.gte=${date}` +
          `&sort_by=popularity.desc`;

        const res = await fetch(url);

        const data = await res.json();

        const enriched = await Promise.all(
          data.results.map(async (show) => {

            const detailRes = await fetch(
              `https://api.themoviedb.org/3/tv/${show.id}?api_key=${apiKey}&append_to_response=external_ids`
            );

            const details = await detailRes.json();

            return {
              id: show.id,
              title: show.name,
              year: show.first_air_date?.split("-")[0] || "N/A",
              poster: show.poster_path
                ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${show.poster_path}`
                : "",
              imdb_id: details.external_ids?.imdb_id,
              overview: details.overview,
            };
          })
        );

        setShows(enriched);

      } catch (err) {
        console.error(err);
        setError("Unable to load Netflix Reality TV.");
      }
    }

    fetchNetflixReality();
  }, [apiKey]);

  return (
    <div className="collapsible-section">

      <h2
        className="collapsible-header"
        onClick={toggleNetflix}
      >
        📺 Netflix Reality TV (Last 90 Days) {showNetflix ? "▲" : "▼"}
      </h2>

      {error && <p>{error}</p>}

      {showNetflix && (
        <div className="tv-show-container">
          {shows.map((show) => (
            <Cards
              key={show.id}
              item={show}
              type="tv"
              getWatchLinks={getWatchLinks}
            />
          ))}
        </div>
      )}

    </div>
  );
}