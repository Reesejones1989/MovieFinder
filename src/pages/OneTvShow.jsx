import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import "./OneTvShow.css";

export default function OneTvShow() {
  const { imdbID } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const videoRef = useRef(null);

  // 🔥 State
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [showInfo, setShowInfo] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const STORAGE_KEY = `continue-${imdbID}`;

  // 🔥 Fetch show info
  useEffect(() => {
    async function fetchShow() {
      try {
        setLoading(true);

        const res = await api.get(`/tv/${imdbID}/info`);
        setShowInfo(res.data);

      } catch (err) {
        console.error("TV show fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (imdbID) fetchShow();
  }, [imdbID]);

  // 🔥 Fetch episodes
  useEffect(() => {
    async function fetchEpisodes() {
      try {
        const res = await api.get(`/tv/${imdbID}/info?season=${season}`);
        const eps = res.data.episodes || [];
        setEpisodes(eps);
        

        // 🔥 INITIAL LOAD LOGIC
        if (!initialized && eps.length > 0) {
          const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

          if (saved && saved.season === season) {
            setEpisode(saved.episode);
          } else {
            // ✅ Auto-select latest episode
          setEpisode(latest.episode_number);
          }

          setInitialized(true);
        }

        // Prevent overflow
        if (episode > eps.length) {
          setEpisode(1);
        }

      } catch (err) {
        console.error("Episode fetch error:", err);
      }
    }

    if (imdbID && season) fetchEpisodes();
  }, [season, imdbID]);

  // 🔥 Save progress (Continue Watching)
  useEffect(() => {
    if (season && episode) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ season, episode })
      );
    }
  }, [season, episode]);

  // 🔥 Auto Next Episode (basic autoplay trigger)
  const goToNextEpisode = () => {
    if (episode < episodes.length) {
      setEpisode((prev) => prev + 1);
    } else if (season < showInfo.totalSeasons) {
      setSeason((prev) => prev + 1);
      setEpisode(1);
    }
  };

  // Fullscreen
  const handleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const maxSeasons = Number(showInfo?.totalSeasons || 1);
  const maxEpisodes = episodes.length;

  const vidSrcUrl = `https://vidsrc.xyz/embed/tv/${imdbID}/${season}/${episode}`;

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
        
        {/* Season */}
        <label>
          Season:
          <select
            value={season}
            onChange={(e) => {
              setSeason(Number(e.target.value));
              setInitialized(false); // 🔥 re-trigger auto-select
            }}
          >
            {[...Array(maxSeasons)].map((_, i) => (
              <option key={i} value={i + 1}>
                Season {i + 1}
              </option>
            ))}
          </select>
        </label>

        {/* Episode */}
        <label>
          Episode:
          <select
            value={episode}
            onChange={(e) => setEpisode(Number(e.target.value))}
          >
           {episodes.map((ep) => (
  <option key={ep.episode_number} value={ep.episode_number}>
    Ep {ep.episode_number}: {ep.name}
  </option>
))}
          </select>
        </label>
      </div>

      {/* ⏯ Navigation */}
      <div className="nav-buttons">

        <button
          onClick={() => setEpisode((prev) => prev - 1)}
          disabled={episode <= 1}
        >
          ◀ Previous
        </button>

        <button
          onClick={() => setEpisode((prev) => prev + 1)}
          disabled={episode >= maxEpisodes}
        >
          Next ▶
        </button>

        <button
          onClick={() => {
            if (season < maxSeasons) {
              setSeason((prev) => prev + 1);
              setInitialized(false);
            }
          }}
          disabled={season >= maxSeasons}
        >
          ⏭ Season
        </button>

        <button onClick={goToNextEpisode}>
          ▶ Auto Next
        </button>

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