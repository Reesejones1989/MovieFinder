import "./TvShowList.css";
import React, { useState, useEffect } from "react";
import initialTvShows from "../hardCodedLists/initialTvShows";
import NetflixShows from "./NetflixShows";
import Cards from "../Cards.jsx";

export default function TvShowList() {
  const [tvShows, setTvShows] = useState(initialTvShows);
  const [trendingShows, setTrendingShows] = useState([]);
  const [postersFetched, setPostersFetched] = useState(false);
  const [showTrending, setShowTrending] = useState(true);
  const [showPopular, setShowPopular] = useState(true);

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  const toggleTrending = () => setShowTrending((prev) => !prev);
  const togglePopular = () => setShowPopular((prev) => !prev);

  useEffect(() => {
    const fetchTrending = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`
      );
      const data = await res.json();

      const enriched = await Promise.all(
        data.results.map(async (show) => {
          const detailRes = await fetch(
            `https://api.themoviedb.org/3/tv/${show.id}?api_key=${apiKey}&append_to_response=external_ids`
          );
          const detailData = await detailRes.json();

          return {
            id: show.id,
            title: show.name,
            year: show.first_air_date?.split("-")[0] || "N/A",
            poster: show.poster_path
              ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${show.poster_path}`
              : "",
            imdb_id: detailData.external_ids?.imdb_id || null,
            overview: detailData.overview || "",
          };
        })
      );
      setTrendingShows(enriched);
    };
    fetchTrending();
  }, [apiKey]);

  useEffect(() => {
    if (!postersFetched) {
      const fetchPosters = async () => {
        const updated = await Promise.all(
          tvShows.map(async (show) => {
            try {
              const res = await fetch(
                `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(show.title)}`
              );
              const data = await res.json();
              if (data.results?.length > 0) {
                const match = data.results[0];
                const detailRes = await fetch(
                  `https://api.themoviedb.org/3/tv/${match.id}?api_key=${apiKey}&append_to_response=external_ids`
                );
                const details = await detailRes.json();
                return {
                  ...show,
                  poster: match.poster_path
                    ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${match.poster_path}`
                    : show.poster,
                  imdb_id: details.external_ids?.imdb_id,
                  overview: details.overview,
                };
              }
            } catch (e) {
              console.error(`Error fetching ${show.title}:`, e);
            }
            return show;
          })
        );
        setTvShows(updated);
        setPostersFetched(true);
      };
      fetchPosters();
    }
  }, [postersFetched, apiKey, tvShows]);

  const getWatchLinks = (show) => {
    const links = [];
    if (show.imdb_id)
      links.push({
        url: `https://vidsrc.xyz/embed/tv/${show.imdb_id}`,
        label: "▶️ Watch on Vidsrc",
      });
    links.push({
      url: `https://www.levidia.ch/tv-show.php?watch=${show.title
        .replace(/:/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase()}`,
      label: "▶️ Watch on Levidia",
    });
    return links;
  };

  return (
    <div className="tv-show-list">
      <h2>TV Shows</h2>

      <h2 onClick={toggleTrending} className="collapsible-header">
        🔥 Trending TV Shows {showTrending ? "▲" : "▼"}
      </h2>
      {showTrending && (
        <div className="tv-show-container">
          {trendingShows.map((s) => (
            <Cards key={s.id} item={s} type="tv" getWatchLinks={getWatchLinks} />
          ))}
        </div>
      )}

      <h2 onClick={togglePopular} className="collapsible-header">
        ⭐ Requested TV Shows {showPopular ? "▲" : "▼"}
      </h2>
      {showPopular && (
        <div className="tv-show-container">
          {tvShows.map((s) => (
            <Cards key={s.id} item={s} type="tv" getWatchLinks={getWatchLinks} />
          ))}
        </div>
      )}

      <NetflixShows />
    </div>
  );
}
