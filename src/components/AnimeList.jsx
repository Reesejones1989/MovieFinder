import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AnimeList.css";
import Card from "../components/Cards";
import initialAnimes from "./hardCodedLists/initialAnimes";

export default function AnimeList() {
  const [anime, setAnime] = useState([]);
  const [initialAnime, setInitialAnime] = useState(initialAnimes);
  const [error, setError] = useState(null);
  const [showAnime, setShowAnime] = useState(true);
  const [showInitialAnime, setShowInitialAnime] = useState(true);

  const navigate = useNavigate();
  const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY;

  const toggleAnime = () => setShowAnime((prev) => !prev);
  const toggleInitialAnime = () => setShowInitialAnime((prev) => !prev);

  const handleNavigate = (item) => {
    if (!item.imdb_id) return;

    navigate(`/tv/${item.imdb_id}?season=1&episode=1`);
  };

  // 🔹 Enrich Hardcoded Anime
  useEffect(() => {
    const fetchInitialAnimeDetails = async () => {
      const updatedAnime = await Promise.all(
        initialAnime.map(async (item) => {
          try {
            const searchTitle = encodeURIComponent(item.title);
            const searchRes = await fetch(
              `https://api.themoviedb.org/3/search/tv?api_key=${tmdbApiKey}&query=${searchTitle}`
            );
            const searchData = await searchRes.json();
            const firstResult = searchData.results?.[0];

            if (firstResult) {
              const detailRes = await fetch(
                `https://api.themoviedb.org/3/tv/${firstResult.id}?api_key=${tmdbApiKey}&append_to_response=external_ids`
              );
              const detailData = await detailRes.json();

              return {
                ...item,
                poster:
                  item.poster ||
                  (firstResult.poster_path
                    ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${firstResult.poster_path}`
                    : ""),
                year:
                  item.year ||
                  (firstResult.first_air_date
                    ? parseInt(firstResult.first_air_date.split("-")[0])
                    : "N/A"),
                imdb_id: detailData?.external_ids?.imdb_id || null,
              };
            }

            return item;
          } catch (err) {
            console.warn(`Failed to enrich ${item.title}:`, err);
            return item;
          }
        })
      );

      setInitialAnime(updatedAnime);
    };

    fetchInitialAnimeDetails();
  }, [tmdbApiKey]);

  // 🔹 Fetch Dynamic Anime
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const today = new Date();
        const ninetyDaysAgo = new Date(today);
        ninetyDaysAgo.setDate(today.getDate() - 90);
        const gteDate = ninetyDaysAgo.toISOString().split("T")[0];

        const url = `https://api.themoviedb.org/3/discover/tv?api_key=${tmdbApiKey}&with_genres=16&with_keywords=210024&first_air_date.gte=${gteDate}&sort_by=popularity.desc&page=1`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch anime");

        const data = await res.json();

        const enrichedAnime = await Promise.all(
          data.results.map(async (show) => {
            const detailRes = await fetch(
              `https://api.themoviedb.org/3/tv/${show.id}?api_key=${tmdbApiKey}&append_to_response=external_ids`
            );
            const detailData = await detailRes.json();

            return {
              id: show.id,
              title: show.name,
              year: show.first_air_date
                ? parseInt(show.first_air_date.split("-")[0])
                : "N/A",
              poster: show.poster_path
                ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${show.poster_path}`
                : "",
              imdb_id: detailData?.external_ids?.imdb_id || null,
              overview: detailData.overview || "",
            };
          })
        );

        setAnime(enrichedAnime);
      } catch (err) {
        console.error("Error fetching anime:", err);
        setError("Could not load anime list.");
      }
    };

    fetchAnime();
  }, [tmdbApiKey]);

  return (
    <div>
      {/* Requested Anime */}
      <div className="collapsible-section">
        <h2 onClick={toggleInitialAnime} className="collapsible-header">
          🎌 Requested Anime List {showInitialAnime ? "▲" : "▼"}
        </h2>

        {showInitialAnime && (
          <div className="anime-container">
            {initialAnime.map((item) => (
              <Card
                key={item.id}
                item={item}
                type="anime"
                onClick={() => handleNavigate(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Popular Anime */}
      <div className="collapsible-section">
        <h2 onClick={toggleAnime} className="collapsible-header">
          🎌 Popular Anime (Last 90 Days) {showAnime ? "▲" : "▼"}
        </h2>

        {error && <p>{error}</p>}

        {showAnime && (
          <div className="anime-container">
            {anime.map((item) => (
              <Card
                key={item.id}
                item={item}
                type="anime"
                onClick={() => handleNavigate(item)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
