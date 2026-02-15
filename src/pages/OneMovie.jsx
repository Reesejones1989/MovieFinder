import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import "./OneMovie.css";

export default function OneMovie() {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await api.get(`/api/movies/${imdbID}`);
        setMovie(res.data);
      } catch (err) {
        console.error("Movie fetch error:", err);
      }
    }

    if (imdbID) fetchMovie();
  }, [imdbID]);

  const handleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  if (!movie) return <div className="loading">Loading...</div>;

  const vidSrcUrl = `https://vidsrc.xyz/embed/movie/${imdbID}`;

  return (
    <div className="movie-page">
     <h1 className="movie-title">
  {movie?.Title ? `${movie.Title} (${movie.Year})` : "Now Playing"}
</h1>


      <button className="fullscreen-btn" onClick={handleFullscreen}>
        Fullscreen
      </button>

      <div className="video-container" ref={videoRef}>
        <iframe
          src={vidSrcUrl}
          title="Movie Player"
          allowFullScreen
          frameBorder="0"
        />
      </div>
    </div>
  );
}
