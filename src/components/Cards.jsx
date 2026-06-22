import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "./FavoritesContext.jsx";
import "./Cards.css";

export default function Cards({ item, type }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { addToFavorites, removeFromFavorites, isFavorite, user } = useFavorites();

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleWatchMovie = () => {
    if (!item.imdb_id) return;
    navigate(`/movie/${item.imdb_id}`);
  };

  const handleWatchTV = () => {
    if (!item.imdb_id) return;
    navigate(`/tv/${item.imdb_id}?season=1&episode=1`);
  };

  const isTV = type === "tv" || type === "anime";
  const favoriteType = isTV ? "tv" : "movie";
  const favorited = isFavorite(item.id, favoriteType);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (favorited) {
      await removeFromFavorites(item.id, favoriteType);
    } else {
      await addToFavorites({ ...item, type: favoriteType });
    }
  };

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

            <div className="modal-links">
              {type === "movie" && (
                <button
                  className="modal-watch-link"
                  onClick={handleWatchMovie}
                >
                  ▶️ Watch Movie
                </button>
              )}

              {isTV && (
                <button
                  className="modal-watch-link"
                  onClick={handleWatchTV}
                >
                  ▶️ Watch This {type === "anime" ? "Anime" : "TV Show"}
                </button>
              )}

              {user && (
                <button
                  className={`modal-favorite-btn ${favorited ? "favorited" : ""}`}
                  onClick={handleToggleFavorite}
                >
                  {favorited ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
