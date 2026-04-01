import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import "./OneMovie.css";

export default function OneMovie() {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);
  const [activated, setActivated] = useState(false);
  const [loadingPlayer, setLoadingPlayer] = useState(false); // 🔥 NEW
  const videoRef = useRef(null);

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

  const handlePlay = () => {
    setActivated(true);
    setLoadingPlayer(true);

    // 🔥 Auto fullscreen after slight delay (DOM ready)
    setTimeout(() => {
      if (videoRef.current?.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }, 300);
  };

  const handleIframeLoad = () => {
    setLoadingPlayer(false);
  };

  if (!movie?.vidSrc) {
    return <div className="loading">Loading...</div>;
  }

  const vidSrcUrl = movie?.vidSrc;

  return (
    <div className="movie-page">
      <h1 className="movie-title">
        {movie?.Title ? `${movie.Title} (${movie.Year})` : "Now Playing"}
      </h1>

      <div className="video-container" ref={videoRef}>
        
        {/* 🔥 CLICK SHIELD */}
        {!activated && (
          <div className="click-shield" onClick={handlePlay}>
            <button className="play-btn">▶ Play Movie</button>
          </div>
        )}

        {/* 🔥 LOADING SPINNER */}
        {loadingPlayer && (
          <div className="spinner-overlay">
            <div className="spinner"></div>
          </div>
        )}

        {/* 🔥 IFRAME */}
        {activated && (
          <iframe
            src={vidSrcUrl}
            title="Movie Player"
            allowFullScreen
            frameBorder="0"
            onLoad={handleIframeLoad}
          />
        )}
      </div>
    </div>
  );
}