import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import "./OneTvShow.css";

export default function OneTvShow() {
  const { imdbID } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const videoRef = useRef(null);

  // State
  const [season, setSeason] = useState(Number(params.get("season")) || 1);
  const [episode, setEpisode] = useState(Number(params.get("episode")) || 1);
  const [showInfo, setShowInfo] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch show info (total seasons)
  useEffect(() => {
    async function fetchShow() {
      try {
        setLoading(true);

        const res = await api.get(`/tv/${imdbID}/info`);
        setShowInfo(res.data);

        // Reset defaults
        setSeason(1);
        setEpisode(1);

      } catch (err) {
        console.error("TV show fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (imdbID) fetchShow();
  }, [imdbID]);

  // 🔥 Fetch episodes when season changes
  useEffect(() => {
    async function fetchEpisodes() {
      try {
        const res = await api.get(
          `/tv/${imdbID}/info?season=${season}`
        );

        const eps = res.data.Episodes || [];
        setEpisodes(eps);

        // Prevent invalid episode selection
        if (episode > eps.length) {
          setEpisode(1);
        }

      } catch (err) {
        console.error("Episode fetch error:", err);
      }
    }

    if (imdbID && season) fetchEpisodes();
  }, [season, imdbID]);

  // Fullscreen
  const handleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  // Limits
  const maxSeasons = Number(showInfo?.totalSeasons || 1);
  const maxEpisodes = episodes.length;

  // VidSrc URL
  const vidSrcUrl = `https://vidsrc.xyz/embed/tv/${imdbID}/${season}/${episode}`;

  // Loading state
  if (loading || !showInfo) {
    return <div className="loading">Loading show...</div>;
  }

  return (
    <div className="tv-page">
      
      {/* 🎬 Title */}
      <h1 className="tv-title">
        {showInfo?.Title
          ? `${showInfo.Title} (${showInfo.Year})`
          : "Now Playing"}
      </h1>

      {/* 🎛 Controls */}
      <div className="controls">
        
        {/* Season Dropdown */}
        <label>
          Season:
          <select
            value={season}
            onChange={(e) => {
              setSeason(Number(e.target.value));
              setEpisode(1);
            }}
          >
            {[...Array(maxSeasons)].map((_, i) => (
              <option key={i} value={i + 1}>
                Season {i + 1}
              </option>
            ))}
          </select>
        </label>

        {/* Episode Dropdown */}
        <label>
          Episode:
          <select
            value={episode}
            onChange={(e) => setEpisode(Number(e.target.value))}
          >
            {episodes.map((ep) => (
              <option key={ep.Episode} value={ep.Episode}>
                Ep {ep.Episode}: {ep.Title}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* ⏯ Navigation */}
      <div className="nav-buttons">

        {/* Previous Episode */}
        <button
          onClick={() => setEpisode((prev) => prev - 1)}
          disabled={episode <= 1}
        >
          ◀ Previous
        </button>

        {/* Next Episode */}
        <button
          onClick={() => setEpisode((prev) => prev + 1)}
          disabled={episode >= maxEpisodes}
        >
          Next ▶
        </button>

        {/* Next Season */}
        <button
          onClick={() => {
            if (season < maxSeasons) {
              setSeason((prev) => prev + 1);
              setEpisode(1);
            }
          }}
          disabled={season >= maxSeasons}
        >
          ⏭ Season
        </button>

        {/* Fullscreen */}
        <button onClick={handleFullscreen}>
          ⛶ Fullscreen
        </button>
      </div>

      {/* 📺 Video */}
      <div className="video-container" ref={videoRef}>
        <iframe
          key={`${imdbID}-${season}-${episode}`}
          src={vidSrcUrl}
          allowFullScreen
          frameBorder="0"
          title="TV Player"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}