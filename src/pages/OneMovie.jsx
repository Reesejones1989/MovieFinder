import { useParams } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import api from "../api/axios";
import "./OneMovie.css";
import LoadingScreen from "../components/LoadingScreen";

export default function OneMovie() {
  const { imdbID } = useParams();

  const [movie, setMovie] = useState(null);

  const [pageLoading, setPageLoading] = useState(true); // ⬅ main loading
  const [activated, setActivated] = useState(false);
  const [loadingPlayer, setLoadingPlayer] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const hideTimeoutRef = useRef(null);
  const videoRef = useRef(null);

  // 🎯 Hide controls timer
  const resetHideTimer = useCallback(() => {
    setShowControls(true);

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    hideTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 15000);
  }, []);

  // 🎬 Fetch movie
  useEffect(() => {
    async function fetchMovie() {
      setPageLoading(true);

      try {
        const res = await api.get(`/movies/${imdbID}`);
        setMovie(res.data);
      } catch (err) {
        console.error("Movie fetch error:", err);
      } finally {
        setPageLoading(false);
      }
    }

    if (imdbID) fetchMovie();
  }, [imdbID]);

  // 🎯 Mouse movement controls (only after activation)
  useEffect(() => {
    if (!activated) return;

    const handleMouseMove = () => resetHideTimer();

    window.addEventListener("mousemove", handleMouseMove);
    resetHideTimer();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [activated, resetHideTimer]);

  // ▶️ Play
  const handlePlay = () => {
    setActivated(true);
    setLoadingPlayer(true);

    setTimeout(() => {
      videoRef.current?.requestFullscreen?.();
    }, 300);
  };

  // 🎬 iframe loaded
  const handleIframeLoad = () => {
    setLoadingPlayer(false);
  };

  // 🔲 fullscreen toggle
  const toggleFullscreen = async () => {
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

  // 🔄 fullscreen tracking
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // 🚨 GLOBAL LOADING SCREEN (FIRST THING USER SEES)
  if (pageLoading) return <LoadingScreen />;

  if (!movie?.vidSrc) {
    return <div className="loading">Movie not found</div>;
  }

  return (
    <div className="movie-page">
      <h1 className="movie-title">
        Now Playing: {movie?.Title} ({movie?.Year})
      </h1>

      <div className="video-container" ref={videoRef}>
        {/* ▶ PLAY OVERLAY */}
        {!activated && (
          <div className="click-shield" onClick={handlePlay}>
            <button className="play-btn">▶ Play Movie</button>
          </div>
        )}

        {/* 🔄 PLAYER LOADING */}
        {loadingPlayer && (
          <div className="spinner-overlay">
            <div className="spinner"></div>
          </div>
        )}

        {/* 🎬 IFRAME */}
        {activated && (
          <>
            <iframe
              src={movie.vidSrc}
              title="Movie Player"
              frameBorder="0"
              allowFullScreen
              referrerPolicy="no-referrer"
              allow="autoplay; encrypted-media; picture-in-picture"
              onLoad={handleIframeLoad}
            />

            {/* 🔲 Controls */}
            {showControls && (
              <button
                className="fullscreen-btn"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? "⤢ Exit Fullscreen" : "⤢ Fullscreen"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}