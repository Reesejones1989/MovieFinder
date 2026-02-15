import { useParams, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import "./OneTvShow.css";

export default function OneTvShow() {
  const { imdbID } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [season, setSeason] = useState(Number(params.get("season")) || 1);
  const [episode, setEpisode] = useState(Number(params.get("episode")) || 1);

  const videoRef = useRef(null);

  const handleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const vidSrcUrl = `https://vidsrc.xyz/embed/tv/${imdbID}/${season}/${episode}`;

  return (
    <div className="tv-page">
      {/* Controls */}
      <div className="controls">
        Season: 
        <input
          type="number"
          min="1"
          placeholder="Season"
          value={season}
          onChange={(e) => {
            setSeason(Number(e.target.value));
            setEpisode(1);
          }}
        />
        Episode:
        <input
          type="number"
          min="1"
          placeholder="Episode"
          value={episode}
          onChange={(e) => setEpisode(Number(e.target.value))}
        />
      </div>

      {/* Navigation */}
      <div className="nav-buttons">
        <button
          onClick={() => episode > 1 && setEpisode((prev) => prev - 1)}
          disabled={episode <= 1}
        >
          ◀ Previous Episode
        </button>

        <button onClick={() => setEpisode((prev) => prev + 1)}>
          Next Episode ▶
        </button>

        <button onClick={() => {
          setSeason((prev) => prev + 1);
          setEpisode(1);
        }}>
          ⏭ Next Season
        </button>

        <button onClick={handleFullscreen}>
          ⛶ Fullscreen
        </button>
      </div>

      {/* Video */}
      <div className="video-container" ref={videoRef}>
        <iframe
          src={vidSrcUrl}
          allowFullScreen
          frameBorder="0"
          title="TV Player"
        />
      </div>
    </div>
  );
}
