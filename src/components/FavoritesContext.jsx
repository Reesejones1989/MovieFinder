import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebaseConfig.jsx';
import { onAuthStateChanged } from 'firebase/auth';
import api from '../api/axios.js';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

// Favorites are stored per-user in MongoDB (see moviefinder-backend), keyed
// off the user's stable Firebase uid via the /api/favorites routes. Because
// the data lives in the database (not the browser), it follows the user's
// account across any computer or device they sign in on.
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setFavorites([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch favorites from the backend whenever the signed-in user changes
  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/favorites');
        if (!cancelled) setFavorites(data || []);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchFavorites();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const normalizeType = (type) => (type === 'tv' || type === 'anime' ? 'tv' : 'movie');

  const addToFavorites = async (item) => {
    if (!user) {
      alert('Please log in to add favorites!');
      return false;
    }

    const type = normalizeType(item.type);
    const movieId = String(item.id);

    // Check if already exists locally first to avoid an unnecessary request
    const exists = favorites.some(
      (fav) => String(fav.movieId) === movieId && fav.type === type
    );
    if (exists) return false;

    const newFavorite = {
      movieId,
      type,
      title: item.title || item.name,
      year: item.year || item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || 'N/A',
      poster: item.poster || (item.poster_path ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${item.poster_path}` : ''),
      imdb_id: item.imdb_id,
      overview: item.overview || '',
    };

    try {
      const { data } = await api.post('/favorites', newFavorite);
      setFavorites(data.favorites || []);
      return true;
    } catch (error) {
      if (error.response?.status === 400) {
        // Already in favorites (e.g. added from another tab/device)
        return false;
      }
      console.error('Error adding favorite:', error);
      alert('Failed to add favorite. Please try again.');
      return false;
    }
  };

  const removeFromFavorites = async (id, type = 'movie') => {
    if (!user) return;

    const normalizedType = normalizeType(type);

    try {
      const { data } = await api.delete(`/favorites/${id}`, {
        params: { type: normalizedType },
      });
      setFavorites(data.favorites || []);
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove favorite. Please try again.');
    }
  };

  const isFavorite = (id, type = 'movie') => {
    const normalizedType = normalizeType(type);
    return favorites.some(
      (fav) => String(fav.movieId) === String(id) && fav.type === normalizedType
    );
  };

  const getFavorites = () => {
    return favorites;
  };

  const clearFavorites = async () => {
    if (!user) return;

    try {
      await Promise.all(
        favorites.map((favorite) =>
          api.delete(`/favorites/${favorite.movieId}`, {
            params: { type: favorite.type },
          })
        )
      );
      setFavorites([]);
    } catch (error) {
      console.error('Error clearing favorites:', error);
      alert('Failed to clear favorites. Please try again.');
    }
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavorites,
    clearFavorites,
    loading,
    user
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
