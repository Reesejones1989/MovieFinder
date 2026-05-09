import { useParams } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import api from "../api/axios";
import "./OneMovie.css";

export default function OneMovie() {
  const { imdbID } = useParams();

  const [movie, setMovie] = useState(null);
  const [activated, setActivated] = useState(false);
  const [loadingPlayer, setLoadingPlayer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const hideTimeoutRef = useRef(null);
  const videoRef = useRef(null);

  // 🎯 Reset hide controls timer
  const resetHideTimer = useCallback(() => {
    setShowControls(true);

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    hideTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 15000);
  }, []);

  // 🎯 Mouse movement controls
  useEffect(() => {
    if (!activated) return;

    const handleMouseMove = () => {
      resetHideTimer();
    };

    window.addEventListener("mousemove", handleMouseMove);

    resetHideTimer();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);

      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [activated, resetHideTimer]);

  // 🎬 Fetch movie
  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await api.get(`/movies/${imdbID}`);
        setMovie(res.data);
      } catch (err) {
        console.error("Movie fetch error:", err);
      }
    }

    if (imdbID) {
      fetchMovie();
    }
  }, [imdbID]);

  // ▶️ Start playback
  const handlePlay = () => {
    setActivated(true);
    setLoadingPlayer(true);

    setTimeout(() => {
      if (videoRef.current?.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }, 300);
  };

  // 📺 Iframe loaded
  const handleIframeLoad = () => {
    setLoadingPlayer(false);
  };

  // 🔲 Toggle fullscreen
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

  // 🔄 Track fullscreen changes
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

  if (!movie?.vidSrc) {
    return <div className="loading">Loading...</div>;
  }

  const vidSrcUrl = movie.vidSrc;

  return (
    <div className="movie-page">
      <h1 className="movie-title">
        {movie?.Title
          ? `Now Playing: ${movie.Title} (${movie.Year})`
          : "Now Playing"}
      </h1>

      <div className="video-container" ref={videoRef}>
        
        {/* ▶️ PLAY OVERLAY */}
        {!activated && (
          <div className="click-shield" onClick={handlePlay}>
            <button className="play-btn">
              ▶ Play Movie
            </button>
          </div>
        )}

        {/* 🔄 LOADING */}
        {loadingPlayer && (
          <div className="spinner-overlay">
            <div className="spinner"></div>
          </div>
        )}

        {/* 🎬 PLAYER */}
        {activated && (
          <>
            <iframe
              src={vidSrcUrl}
              title="Movie Player"
              frameBorder="0"
              allowFullScreen
              referrerPolicy="no-referrer"
              allow="autoplay; encrypted-media; picture-in-picture"
              onLoad={handleIframeLoad}
            />

            {/* 🔲 FULLSCREEN BUTTON */}
            {showControls && (
              <button
                className="fullscreen-btn"
                onClick={toggleFullscreen}
              >
                {isFullscreen
                  ? "⤢ Exit Fullscreen"
                  : "⤢ Fullscreen"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}