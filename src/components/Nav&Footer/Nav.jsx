import { useState, useEffect } from 'react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NewMovieFinder from '../../assets/NewMovieFinder.jpg';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import './Nav.css';
import '../LogoutButton.css'; // Make sure this is imported if not in global CSS

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="Nav">
      <div className="nav-left">
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <img
            src={NewMovieFinder}
            alt="Movie Finder Logo"
            className="nav-logo"
          />
        </Link>
      </div>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/Movies" onClick={() => setMenuOpen(false)}>Movies</Link>
        <Link to="/TV-Shows" onClick={() => setMenuOpen(false)}>TV Shows</Link>
        <Link to="/Anime" onClick={() => setMenuOpen(false)}>Anime</Link>
        <Link to="/Sports" onClick={() => setMenuOpen(false)}>Sports</Link>
        <Link to="/LiveTv" onClick={() => setMenuOpen(false)}>Live TV</Link>
        <Link to="/About" onClick={() => setMenuOpen(false)}>About</Link>

        {user && (
          <Link to="/Favorites" onClick={() => setMenuOpen(false)}>
            Favorites
          </Link>
        )}

        {user ? (
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        ) : (
          <Link to="/Login" onClick={() => setMenuOpen(false)}>
            Login / Sign Up
          </Link>
        )}
      </div>

      <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <span className="bar bar1"></span>
        <span className="bar bar2"></span>
        <span className="bar bar3"></span>
      </div>
    </nav>
  );
}
