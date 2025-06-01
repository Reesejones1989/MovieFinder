import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <nav className="Nav">
      <div className="nav-left">
      <Link to="/" onClick={() => setMenuOpen(false)}>
        <img
          src="https://r2.erweima.ai/i/JlHYKridTXa_U4NgCQ63Ww.png"
          alt="logo"
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
        <Link to="/LiveTv" onClick={() => setMenuOpen(false)}>LiveTv</Link>

        <Link to="/About" onClick={() => setMenuOpen(false)}>About</Link>
        <Link to="/Favorites" onClick={() => setMenuOpen(false)}>Favorites</Link>
        <Link to="/Login" onClick={() => setMenuOpen(false)}>Login/SignUp</Link>
      </div>

      <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <span className="bar bar1"></span>
        <span className="bar bar2"></span>
        <span className="bar bar3"></span>
      </div>
    </nav>
  );
}
