import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import "./OneTvShow.css";

export default function OneTvShow() {
  const { imdbID } = useParams();

  const videoRef = useRef(null);

  // 🎯 State
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [showInfo, setShowInfo] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const [activated, setActivated] = useState(false);
  const [loadingPlayer, setLoadingPlayer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const STORAGE_KEY = `continue-${imdbID}`;

  // 🎬 Fetch show info
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

    if (imdbID) {
      fetchShow();
    }
  }, [imdbID]);

  // 📺 Fetch episodes
  useEffect(() => {
    async function fetchEpisodes() {
      try {
        const res = await api.get(
          `/tv/${imdbID}/info?season=${season}`
        );

        const eps = res.data.episodes || [];

        setEpisodes(eps);

        if (!initialized && eps.length > 0) {
          const saved = JSON.parse(
            localStorage.getItem(STORAGE_KEY)
          );

          if (saved && saved.season === season) {
            setEpisode(saved.episode);
          } else {
            setEpisode(eps[0].episode_number);
          }

          setInitialized(true);
        }

        if (episode > eps.length) {
          setEpisode(1);
        }

      } catch (err) {
        console.error("Episode fetch error:", err);
      }
    }

    if (imdbID && season) {
      fetchEpisodes();
    }
  }, [season, imdbID, initialized, episode, STORAGE_KEY]);

  // 💾 Save progress
  useEffect(() => {
    if (season && episode) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          season,
          episode,
        })
      );
    }
  }, [season, episode, STORAGE_KEY]);

  // 🔄 Reset player on episode change
  useEffect(() => {
    setActivated(false);
    setLoadingPlayer(false);
  }, [season, episode]);

  // ▶️ Play
  const handlePlay = () => {
    setActivated(true);
    setLoadingPlayer(true);

    setTimeout(() => {
      if (videoRef.current?.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }, 300);
  };

  // 📺 Loaded
  const handleIframeLoad = () => {
    setLoadingPlayer(false);
  };

  // ⏭ Next episode
  const goToNextEpisode = () => {
    if (episode < episodes.length) {
      setEpisode((prev) => prev + 1);
    } else if (season < maxSeasons) {
      setSeason((prev) => prev + 1);
      setEpisode(1);
      setInitialized(false);
    }
  };

  // 🔲 Fullscreen
  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await videoRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  // 🔄 Fullscreen tracking
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  const maxSeasons = Number(showInfo?.totalSeasons || 1);
  const maxEpisodes = episodes.length;

  // ✅ UPDATED EMBED URL
  const vidSrcUrl = `https://vsembed.su/embed/tv/${imdbID}/${season}/${episode}`;

  if (loading || !showInfo) {
    return <div className="loading">Loading show...</div>;
  }

  return (
    <div className="tv-page">

      {/* 🎬 TITLE */}
      <h1 className="tv-title">
        {showInfo?.Title
          ? `Now Playing: ${showInfo.Title} (${showInfo.Year})`
          : "Now Playing"}
      </h1>

      {/* 🎛 CONTROLS */}
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
              <option
                key={i}
                value={i + 1}
              >
                Season {i + 1}
              </option>
            ))}
          </select>
        </label>

        <label>
          Episode:
          <select
            value={episode}
            onChange={(e) =>
              setEpisode(Number(e.target.value))
            }
          >
            {episodes.map((ep) => (
              <option
                key={ep.episode_number}
                value={ep.episode_number}
              >
                Ep {ep.episode_number}: {ep.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* ⏯ NAVIGATION */}
      <div className="nav-buttons">

        <button
          onClick={() =>
            setEpisode((prev) => prev - 1)
          }
          disabled={episode <= 1}
        >
          ◀ Previous
        </button>

        <button
          onClick={() =>
            setEpisode((prev) => prev + 1)
          }
          disabled={episode >= maxEpisodes}
        >
          Next ▶
        </button>

        <button
          onClick={() => {
            if (season < maxSeasons) {
              setSeason((prev) => prev + 1);
              setEpisode(1);
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
          {isFullscreen
            ? "⤢ Exit Fullscreen"
            : "⛶ Fullscreen"}
        </button>
      </div>

      {/* 📺 PLAYER */}
      <div className="video-container" ref={videoRef}>

        {!activated && (
          <div
            className="click-shield"
            onClick={handlePlay}
          >
            <button className="play-btn">
              ▶ Play Episode
            </button>
          </div>
        )}

        {loadingPlayer && (
          <div className="spinner-overlay">
            <div className="spinner"></div>
          </div>
        )}

        {activated && (
          <iframe
            key={`${imdbID}-${season}-${episode}`}
            src={vidSrcUrl}
            title="TV Player"
            frameBorder="0"
            allowFullScreen
            referrerPolicy="no-referrer"
            allow="autoplay; encrypted-media; picture-in-picture"
            onLoad={handleIframeLoad}
          />
        )}
      </div>
    </div>
  );
}