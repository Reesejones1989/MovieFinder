import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./FavoriteList.css";

export default function FavoriteList() {
  const [favorites, setFavorites] = useState([]);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setUserToken(token);
      } else {
        setUserToken(null);
        setFavorites([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userToken) return;

    fetch("http://localhost:5000/api/favorites", {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setFavorites(data))
      .catch((err) => console.error("Error fetching favorites:", err));
  }, [userToken]);

  const handleRemoveFavorite = async (movieId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/favorites/${movieId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to remove favorite");

      const updated = await response.json();
      setFavorites(updated.favorites);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <div className="favorite-container">
      <h2>Your Favorites</h2>
      <div className="card-grid">
        {favorites.map((movie) => (
          <div className="flip-card" key={movie.movieId}>
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h3>{movie.title}</h3>
                <button onClick={() => handleRemoveFavorite(movie.movieId)}>Remove</button>
              </div>
              <div className="flip-card-back">
                <p><strong>VidSrc:</strong> <a href={movie.vidSrc} target="_blank" rel="noopener noreferrer">{movie.vidSrc}</a></p>
                <p><strong>Levidia:</strong> <a href={movie.levidia} target="_blank" rel="noopener noreferrer">{movie.levidia}</a></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
