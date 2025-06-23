import React, { useState } from "react";

export default function ApiTest() {
  const [username, setUsername] = useState("testuser");
  const [password, setPassword] = useState("testpass123");
  const [token, setToken] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState("");

  // Signup
  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      setMessage(`Signup: ${res.status} - ${data.message || data.error}`);
    } catch (err) {
      setMessage(`Signup error: ${err.message}`);
    }
  };

  // Login
  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setMessage(`Logged in successfully! Token stored.`);
      } else {
        setMessage(`Login failed: ${data.error}`);
      }
    } catch (err) {
      setMessage(`Login error: ${err.message}`);
    }
  };

  // Get Favorites
  const handleGetFavorites = async () => {
    if (!token) {
      setMessage("Please login first to get favorites.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setFavorites(data.favorites || []);
        setMessage("Favorites fetched!");
      } else {
        setMessage(`Error fetching favorites: ${data.message}`);
      }
    } catch (err) {
      setMessage(`Fetch favorites error: ${err.message}`);
    }
  };

  // Add Favorite
  const handleAddFavorite = async () => {
    if (!token) {
      setMessage("Please login first to add favorites.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieId: "movie123",
          title: "Test Movie",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Added to favorites!");
        setFavorites(data.favorites);
      } else {
        setMessage(`Add favorite error: ${data.message}`);
      }
    } catch (err) {
      setMessage(`Add favorite error: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif", maxWidth: 400 }}>
      <h2>API Test Component</h2>
      <div>
        <label>
          Username:{" "}
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%" }}
          />
        </label>
      </div>
      <div>
        <label>
          Password:{" "}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%" }}
          />
        </label>
      </div>
      <div style={{ marginTop: 10 }}>
        <button onClick={handleSignup}>Signup</button>{" "}
        <button onClick={handleLogin}>Login</button>
      </div>

      <hr />

      <div>
        <button onClick={handleGetFavorites}>Get Favorites</button>{" "}
        <button onClick={handleAddFavorite}>Add Favorite (Test Movie)</button>
      </div>

      <hr />

      <div>
        <strong>Status:</strong>
        <p>{message}</p>
      </div>

      <div>
        <strong>Favorites List:</strong>
        <ul>
          {favorites.length === 0 && <li>No favorites yet.</li>}
          {favorites.map((fav) => (
            <li key={fav.movieId}>
              {fav.title} (ID: {fav.movieId})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
