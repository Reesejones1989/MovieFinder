import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import "./OneMovie.css";

export default function OneMovie() {
  const { imdbID } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const videoRef = useRef(null);

  // 🔥 Redirect if imdbID missing
  useEffect(() => {
    if (!imdbID) {
      navigate("/movies");
    }
  }, [imdbID, navigate]);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await api.get(`/movies/${imdbID}`);
        setMovie(res.data);

        if (!res.data?.vidSrc) {
          navigate("/movies");
        }
      } catch (err) {
        console.error("Movie fetch error:", err);
        navigate("/movies");
      }
    }

    if (imdbID) fetchMovie();
  }, [imdbID, navigate]);

  const handleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate("/movies");
    }
  };

  if (!movie?.vidSrc) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="movie-page">
      <button className="back-btn" onClick={handleBack}>
        ⬅ Back
      </button>

      <h1 className="movie-title">
        {movie?.Title ? `${movie.Title} (${movie.Year})` : "Now Playing"}
      </h1>

      <button className="fullscreen-btn" onClick={handleFullscreen}>
        Fullscreen
      </button>

      <div className="video-container" ref={videoRef}>
        <iframe
          src={movie.vidSrc}
          title="Movie Player"
          allowFullScreen
          frameBorder="0"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
}