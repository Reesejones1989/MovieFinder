import { useState } from 'react';
import React from 'react'
import { Link } from 'react-router-dom';
import NewMovieFinder from '../../assets/NewMovieFinder.jpg';
import './Nav.css';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

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
        <Link to="/">Home</Link>
        <Link to="/Movies">Movies</Link>
        <Link to="/TV-Shows">TV Shows</Link>
        <Link to="/Anime">Anime</Link>
        <Link to="/Sports">Sports</Link>
        <Link to="/LiveTv">Live TV</Link>
        <Link to="/Favorites">Favorites</Link>
        <Link to="/About">About</Link>
        <Link to="/Login">Login/SignUp</Link>
      </div>

      <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <span className="bar bar1"></span>
        <span className="bar bar2"></span>
        <span className="bar bar3"></span>
      </div>
    </nav>
  );
}
