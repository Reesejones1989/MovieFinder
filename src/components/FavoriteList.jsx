import React, { useState, useEffect } from "react";

export default function FavoriteList() {
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/favorites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched favorites:", data);
        setFavorites(data); // now data is just the favorites array
      })
      .catch((error) => console.error("Error fetching favorites:", error));
  }, [token]);

  const handleRemoveFavorite = async (movieId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/favorites/${movieId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove favorite");
      }

      const updated = await response.json();
      setFavorites(updated.favorites); // server returns updated list
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <div>
      <h2>Your Favorite Movies</h2>
      <ul>
        {favorites.map((movie) => (
          <li key={movie.movieId}>
            {movie.title}
            <button onClick={() => handleRemoveFavorite(movie.movieId)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
