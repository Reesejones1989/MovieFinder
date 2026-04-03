import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
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

  const resetHideTimer = () => {
  setShowControls(true);

  if (hideTimeoutRef.current) {
    clearTimeout(hideTimeoutRef.current);
  }

  hideTimeoutRef.current = setTimeout(() => {
    setShowControls(false);
  }, 15000); // 15 seconds
};

useEffect(() => {
  if (!activated) return;

  const handleMouseMove = () => {
    resetHideTimer();
  };

  window.addEventListener("mousemove", handleMouseMove);

  // start timer immediately
  resetHideTimer();

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  };
}, [activated]);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await api.get(`/movies/${imdbID}`);
        setMovie(res.data);
      } catch (err) {
        console.error("Movie fetch error:", err);
      }
    }

    if (imdbID) fetchMovie();
  }, [imdbID]);

  // ▶️ Play handler
  const handlePlay = () => {
    setActivated(true);
    setLoadingPlayer(true);

    // 🔥 Auto fullscreen
    setTimeout(() => {
      if (videoRef.current?.requestFullscreen) {
        videoRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    }, 300);
  };

  const handleIframeLoad = () => {
    setLoadingPlayer(false);
  };

  // 🔲 Toggle fullscreen manually
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // 🔄 Track fullscreen changes (user presses ESC, etc.)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
  }, []);

  if (!movie?.vidSrc) {
    return <div className="loading">Loading...</div>;
  }

  const vidSrcUrl = movie?.vidSrc;

  return (
    <div className="movie-page">
      {/* 🎬 UPDATED TITLE */}
      <h1 className="movie-title">
        {movie?.Title
          ? `Now Playing: ${movie.Title} (${movie.Year})`
          : "Now Playing"}
      </h1>

      <div className="video-container" ref={videoRef}>
        
        {/* ▶️ CLICK SHIELD */}
        {!activated && (
          <div className="click-shield" onClick={handlePlay}>
            <button className="play-btn">▶ Play Movie</button>
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
              allowFullScreen
              frameBorder="0"
              onLoad={handleIframeLoad}
            />

            {/* 🔲 FULLSCREEN BUTTON */}
           {activated && showControls && (
  <button className="fullscreen-btn" onClick={toggleFullscreen}>
    {isFullscreen ? "⤢ Exit Fullscreen" : "⤢ Fullscreen"}
  </button>
)}
          </>
        )}
      </div>
    </div>
  );
}