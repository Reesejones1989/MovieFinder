import "./TvShowList.css";
import React, { useState, useEffect } from "react";
import initialTvShows from "../hardCodedLists/initialTvShows";
import NetflixShows from "./NetflixShows";
import MediaRow from "../MediaRow/MediaRow.jsx";

export default function TvShowList() {
  const [tvShows, setTvShows] = useState(initialTvShows);
  const [trendingShows, setTrendingShows] = useState([]);
  const [postersFetched, setPostersFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trendingError, setTrendingError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;


  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        setTrendingError(null);

        const res = await fetch(
          `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`
        );
        if (!res.ok) throw new Error(`TMDB error ${res.status}`);

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
              seasons: detailData.seasons || [],
            };
          })
        );

        setTrendingShows(enriched);
      } catch (err) {
        console.error("Failed to fetch trending TV shows:", err);
        setTrendingError("Couldn't load trending TV shows.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [apiKey, reloadKey]);

  useEffect(() => {
    if (!postersFetched) {
      const fetchPosters = async () => {
        try {
          setLoading(true);

          const updated = await Promise.all(
            tvShows.map(async (show) => {
              try {
                const res = await fetch(
                  `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(
                    show.title
                  )}`
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
                    seasons: details.seasons || [],
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
        } finally {
          setLoading(false);
        }
      };

      fetchPosters();
    }
  }, [postersFetched, apiKey]);

  const getWatchLinks = (show) => {
    const links = [];

    if (show.imdb_id)
      links.push({
        url: `https://vsembed.ru/tv/${show.imdb_id}`,
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

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <h2 className="loading-text">Loading TV Shows...</h2>
      </div>
    );
  }

  return (
    <div className="tv-show-list">
      <h2>TV Shows</h2>

      <MediaRow
        title="🔥 Trending TV Shows"
        items={trendingShows}
        type="tv"
        error={trendingError}
        empty={!trendingError && trendingShows.length === 0}
        emptyText="No trending TV shows right now."
        onRetry={() => setReloadKey((k) => k + 1)}
      />

      <MediaRow title="⭐ Requested TV Shows" items={tvShows} type="tv" />

      <NetflixShows />
    </div>
  );
}
