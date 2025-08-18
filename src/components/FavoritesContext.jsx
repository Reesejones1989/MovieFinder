import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig.jsx';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen for favorites changes when user changes
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    const favoritesRef = collection(db, 'favorites');
    const userFavoritesQuery = query(favoritesRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(userFavoritesQuery, (snapshot) => {
      const favoritesData = [];
      snapshot.forEach((doc) => {
        favoritesData.push({ id: doc.id, ...doc.data() });
      });
      setFavorites(favoritesData);
    }, (error) => {
      console.error('Error fetching favorites:', error);
    });

    return () => unsubscribe();
  }, [user]);

  const addToFavorites = async (item) => {
    if (!user) {
      alert('Please log in to add favorites!');
      return false;
    }

    try {
      const newFavorite = {
        userId: user.uid,
        movieId: item.id,
        title: item.title || item.name,
        year: item.year || item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || 'N/A',
        poster: item.poster || item.poster_path ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${item.poster_path}` : '',
        imdb_id: item.imdb_id,
        type: item.type || 'movie', // 'movie' or 'tv'
        overview: item.overview || '',
        addedAt: serverTimestamp()
      };

      // Check if already exists
      const exists = favorites.find(fav => 
        fav.movieId === item.id && fav.type === newFavorite.type
      );
      
      if (exists) {
        return false; // Already exists
      }

      // Add to Firestore
      const docRef = doc(collection(db, 'favorites'));
      await setDoc(docRef, newFavorite);
      
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      alert('Failed to add favorite. Please try again.');
      return false;
    }
  };

  const removeFromFavorites = async (id, type = 'movie') => {
    if (!user) return;

    try {
      const favoriteToRemove = favorites.find(fav => 
        fav.movieId === id && fav.type === type
      );
      
      if (favoriteToRemove) {
        await deleteDoc(doc(db, 'favorites', favoriteToRemove.id));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove favorite. Please try again.');
    }
  };

  const isFavorite = (id, type = 'movie') => {
    return favorites.some(fav => fav.movieId === id && fav.type === type);
  };

  const getFavorites = () => {
    return favorites;
  };

  const clearFavorites = async () => {
    if (!user) return;

    try {
      const batch = [];
      favorites.forEach(favorite => {
        batch.push(deleteDoc(doc(db, 'favorites', favorite.id)));
      });
      await Promise.all(batch);
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