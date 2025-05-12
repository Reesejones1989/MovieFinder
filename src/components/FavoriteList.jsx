import { useState, useEffect } from "react";

export default function FavoriteList() {
    const [favorites, setFavorites] = useState([]);
    const token = localStorage.getItem("token"); // Define token here
    

    useEffect(() => {
        if (!token) return;
      
        fetch("http://localhost:5000/api/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Fetched favorites:", data); // Debugging step
            setFavorites(data[0]?.favorites || []); // Assuming the data contains an array of favorites
          })
          .catch((error) => console.error("Error fetching favorites:", error));
      }, [token]);
      
      
      const handleRemoveFavorite = async (id) => {
        try {
          const response = await fetch(`http://localhost:5000/api/favorites/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (!response.ok) {
            throw new Error("Failed to remove favorite");
          }
      
          const updatedFavorites = await response.json();
          setFavorites(updatedFavorites);
        } catch (error) {
          console.error("Error removing favorite:", error);
        }
      };
      
      
      return (
        <div>
          <h2>Your Favorite Movies</h2>
          <ul>
            {favorites.map(movie => (
              <li key={movie._id}>
                {movie.title}
                <button onClick={() => handleRemoveFavorite(movie._id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      );
}
