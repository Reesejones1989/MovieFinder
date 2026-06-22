import React from "react";
import "./FavoriteList.css";
import { useFavorites } from './FavoritesContext.jsx';
import Cards from './Cards.jsx';

export default function FavoriteList() {
  const { favorites, loading, user } = useFavorites();

  if (loading) {
    return (
      <div className="favorite-container">
        <h2>Your Favorites</h2>
        <div className="loading-favorites">
          <p>Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="favorite-container">
        <h2>Your Favorites</h2>
        <div className="login-required">
          <p>Please log in to view your favorites.</p>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="favorite-container">
        <h2>Your Favorites</h2>
        <div className="empty-favorites">
          <p>No favorites yet! Start adding movies and TV shows to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorite-container">
      <h2>Your Favorites ({favorites.length})</h2>
      <div className="card-grid">
        {favorites.map((item) => (
          <Cards
            key={`${item.movieId}-${item.type}`}
            item={{ ...item, id: item.movieId }}
            type={item.type}
          />
        ))}
      </div>
    </div>
  );
}
