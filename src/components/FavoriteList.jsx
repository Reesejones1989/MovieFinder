import React from "react";
import "./FavoriteList.css";
import { useFavorites } from './FavoritesContext.jsx';

export default function FavoriteList() {
  const { favorites, removeFromFavorites, loading, user } = useFavorites();

  const handleRemoveFavorite = async (id, type) => {
    await removeFromFavorites(id, type);
  };

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

  const getWatchLinks = (item) => {
    const links = [];
    
    if (item.imdb_id) {
      links.push({
        url: `https://vidsrc.xyz/embed/${item.type}/${item.imdb_id}`,
        label: `▶️ Watch on Vidsrc`,
      });
    }

    const formatTitleForLevidia = (title) =>
      title
        .replace(/:/g, "")
        .replace(/\s+/g, "-")
        .replace(/&/g, "")
        .replace(/'/g, "")
        .toLowerCase();

    links.push({
      url: item.type === 'tv' 
        ? `https://www.levidia.ch/tv-show.php?watch=${formatTitleForLevidia(item.title)}`
        : `https://www.levidia.ch/movie.php?watch=${formatTitleForLevidia(item.title)}`,
      label: `▶️ Watch on Levidia`,
    });

    return links;
  };

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
        {favorites.map((item) => {
          const watchLinks = getWatchLinks(item);
          return (
            <div className="flip-card" key={`${item.movieId}-${item.type}`}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img
                    src={item.poster || "https://via.placeholder.com/250x300"}
                    alt={item.title}
                    className="favorite-poster"
                  />
                  <h3>{item.title}</h3>
                  <p>({item.year})</p>
                  <p className="item-type">{item.type === 'tv' ? 'TV Show' : 'Movie'}</p>
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveFavorite(item.movieId, item.type)}
                  >
                    ❌ Remove
                  </button>
                </div>
                <div className="flip-card-back">
                  <img
                    src={item.poster || "https://via.placeholder.com/250x300"}
                    alt={item.title}
                    className="favorite-poster"
                  />
                  {item.overview && (
                    <p className="overview">{item.overview.substring(0, 150)}...</p>
                  )}
                  {watchLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="watch-link"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
