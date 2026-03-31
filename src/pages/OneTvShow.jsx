import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import "./OneTvShow.css";

export default function OneTvShow() {
  const { imdbID } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
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

  // 🔥 Redirect if imdbID is missing
  useEffect(() => {
    if (!imdbID) {
      navigate("/tv");
    }
  }, [imdbID, navigate]);

  // 🔥 Fetch show info
  useEffect(() => {
    async function fetchShow() {
      try {
        setLoading(true);
        const res = await api.get(`/tv/${imdbID}/info`);
        setShowInfo(res.data);

        // Redirect if show not found
        if (!res.data) {
          navigate("/tv");
        }
      } catch (err) {
        console.error("TV show fetch error:", err);
        navigate("/tv");
      } finally {
        setLoading(false);
      }
    }

    if (imdbID) fetchShow();
  }, [imdbID, navigate]);

  // 🔥 Fetch episodes
  useEffect(() => {
    async function fetchEpisodes() {
      try {
        const res = await api.get(`/tv/${imdbID}/info?season=${season}`);
        const eps = res.data.episodes || [];
        setEpisodes(eps);

        if (!initialized && eps.length > 0) {
          const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
          if (saved && saved.season === season) {
            setEpisode(saved.episode);
          } else {
            const latest = eps[eps.length - 1];
            setEpisode(latest.episode_number);
          }
          setInitialized(true);
        }

        if (episode > eps.length) {
          setEpisode(1);
        }
      } catch (err) {
        console.error("Episode fetch error:", err);
        navigate("/tv");
      }
    }

    if (imdbID && season) fetchEpisodes();
  }, [season, imdbID, episode, initialized, navigate]);

  // 🔥 Save progress
  useEffect(() => {
    if (season && episode) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ season, episode })
      );
    }
  }, [season, episode]);

  // 🔥 Auto Next Episode
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

  // Back button fallback
  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate("/tv");
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
      <button className="back-btn" onClick={handleBack}>
        ⬅ Back
      </button>

      <h1 className="tv-title">
        {showInfo?.Title
          ? `${showInfo.Title} (${showInfo.Year})`
          : "Now Playing"}
      </h1>

      <div className="controls">
        <label>
          Season:
          <select
            value={season}
            onChange={(e) => {
              setSeason(Number(e.target.value));
              setInitialized(false);
            }}
          >
            {[...Array(maxSeasons)].map((_, i) => (
              <option key={i} value={i + 1}>
                Season {i + 1}
              </option>
            ))}
          </select>
        </label>

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

        <button onClick={goToNextEpisode}>▶ Auto Next</button>
        <button onClick={handleFullscreen}>⛶ Fullscreen</button>
      </div>

      <div className="video-container" ref={videoRef}>
        <iframe
          key={`${imdbID}-${season}-${episode}`}
          src={vidSrcUrl}
          allowFullScreen
          frameBorder="0"
          title="TV Player"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
}