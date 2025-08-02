import { useState, useEffect } from 'react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NewMovieFinder from '../../assets/NewMovieFinder.jpg';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import './Nav.css';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(prev => !prev);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="Nav">
      {/* Left side: Logo */}
      <div className="nav-left">
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <img
            src={NewMovieFinder}
            alt="Movie Finder Logo"
            className="nav-logo"
          />
        </Link>
      </div>

      {/* Right side: Links */}
      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {[
          { to: "/", label: "Home" },
          { to: "/Movies", label: "Movies" },
          { to: "/TV-Shows", label: "TV Shows" },
          { to: "/Anime", label: "Anime" },
          { to: "/Sports", label: "Sports" },
          { to: "/LiveTv", label: "Live TV" },
          { to: "/About", label: "About" },
        ].map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}

        {user && (
          <Link
            to="/Favorites"
            onClick={() => setMenuOpen(false)}
          >
            Favorites
          </Link>
        )}

        {user ? (
          <button onClick={handleLogout} className="logout-button">
            Log Out
          </button>
        ) : (
          <Link
            to="/Login"
            onClick={() => setMenuOpen(false)}
          >
            Login / Sign Up
          </Link>
        )}
      </div>

      {/* Hamburger for Mobile */}
      <div
        className={`hamburger ${menuOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <div className="bar bar1"></div>
        <div className="bar bar2"></div>
        <div className="bar bar3"></div>
      </div>
    </nav>
  );
}
