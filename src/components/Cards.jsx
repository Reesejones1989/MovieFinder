import React, { useState, useEffect } from "react";
import "./Cards.css";

export default function Cards({ item, type, getWatchLinks }) {
  const [showModal, setShowModal] = useState(false);

  const [showVidSrcControls, setShowVidSrcControls] = useState(false);
  const [season, setSeason] = useState("");
  const [episode, setEpisode] = useState("");
  const [episodesForSeason, setEpisodesForSeason] = useState([]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setShowVidSrcControls(false);
    setSeason("");
    setEpisode("");
  };

  const links = getWatchLinks ? getWatchLinks(item) : [];

  /* 🔁 Update episode list when season changes */
  useEffect(() => {
    if (!season || !item.seasons) return;

    const selectedSeason = item.seasons.find(
      (s) => s.season_number === Number(season)
    );

    if (selectedSeason?.episode_count) {
      setEpisodesForSeason(
        Array.from({ length: selectedSeason.episode_count }, (_, i) => i + 1)
      );
    } else {
      setEpisodesForSeason([]);
    }

    setEpisode("");
  }, [season, item.seasons]);

  const vidsrcEpisodeUrl =
    item.imdb_id && season && episode
      ? `https://vidsrc-embed.ru/embed/tv?imdb=${item.imdb_id}&season=${season}&episode=${episode}`
      : null;

  return (
    <>
      <div className="card" onClick={handleOpenModal}>
        <img
          src={item.poster || "/no-poster.png"}
          alt={item.title}
          className="card-poster"
        />
        <div className="card-title">
          {item.title} ({item.year})
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>
              ✖
            </button>

            <img
              src={item.poster || "/no-poster.png"}
              alt={item.title}
              className="modal-poster"
            />

            <h2>{item.title}</h2>

            <p className="modal-overview">
              {item.overview || "No description available."}
            </p>

            {/* 🎬 WATCH LINKS */}
            <div className="modal-links">
              {links.map((link, i) => {
                const isVidSrcTV =
                  type === "tv" && link.label.toLowerCase().includes("vidsrc");

                if (isVidSrcTV) {
                  return (
                    <button
                      key={i}
                      className="modal-watch-link"
                      onClick={() => setShowVidSrcControls(true)}
                    >
                      ▶️ Watch on VidSrc
                    </button>
                  );
                }

                return (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-watch-link"
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>

            {/* 📺 SEASON / EPISODE CONTROLS */}
            {type === "tv" && showVidSrcControls && item.seasons?.length > 0 && (
              <div className="season-episode-controls">
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                >
                  <option value="">Select Season</option>
                  {item.seasons
                    .filter((s) => s.season_number > 0)
                    .map((s) => (
                      <option key={s.id} value={s.season_number}>
                        Season {s.season_number}
                      </option>
                    ))}
                </select>

                {season && (
                  <select
                    value={episode}
                    onChange={(e) => setEpisode(e.target.value)}
                  >
                    <option value="">Select Episode</option>
                    {episodesForSeason.map((ep) => (
                      <option key={ep} value={ep}>
                        Episode {ep}
                      </option>
                    ))}
                  </select>
                )}

                {vidsrcEpisodeUrl && (
                  <a
                    href={vidsrcEpisodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="play-episode-btn">
                      ▶ Play Episode
                    </button>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
