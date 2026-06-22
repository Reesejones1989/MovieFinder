import { useState, useEffect } from 'react';
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import NewMovieFinder from '../../assets/NewMovieFinder.jpg';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import './Nav.css';

const NAV_LINKS = [
  { to: "/",        label: "Home"    },
  { to: "/movies",  label: "Movies"  },
  { to: "/tv-shows",label: "TV Shows"},
  { to: "/anime",   label: "Anime"   },
  { to: "/livetv",  label: "Live TV" },
  { to: "/about",   label: "Donate"  },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setMenuOpen(false);

  const handleLogout = async () => {
    await signOut(auth);
    close();
    navigate("/");
  };

  return (
    <>
      <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
        {/* Logo */}
        <NavLink to="/" className="nav__logo-link" onClick={close}>
          <img src={NewMovieFinder} alt="Movie Finder" className="nav__logo" />
        </NavLink>

        {/* Desktop links */}
        <ul className="nav__links">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `nav__link${isActive ? ' nav__link--active' : ''}`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
          {user && (
            <li>
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  `nav__link${isActive ? ' nav__link--active' : ''}`
                }
              >
                Favorites
              </NavLink>
            </li>
          )}
        </ul>

        {/* Auth — desktop */}
        <div className="nav__auth">
          {user ? (
            <button className="nav__btn nav__btn--outline" onClick={handleLogout}>
              Log Out
            </button>
          ) : (
            <NavLink to="/login" className="nav__btn nav__btn--solid" onClick={close}>
              Sign In
            </NavLink>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`nav__hamburger${menuOpen ? ' nav__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className="nav__bar" />
          <span className="nav__bar" />
          <span className="nav__bar" />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav__drawer${menuOpen ? ' nav__drawer--open' : ''}`}>
        <ul className="nav__drawer-links">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `nav__drawer-link${isActive ? ' nav__drawer-link--active' : ''}`
                }
                onClick={close}
              >
                {label}
              </NavLink>
            </li>
          ))}
          {user && (
            <li>
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  `nav__drawer-link${isActive ? ' nav__drawer-link--active' : ''}`
                }
                onClick={close}
              >
                Favorites
              </NavLink>
            </li>
          )}
        </ul>

        <div className="nav__drawer-auth">
          {user ? (
            <button className="nav__btn nav__btn--outline" onClick={handleLogout}>
              Log Out
            </button>
          ) : (
            <NavLink to="/login" className="nav__btn nav__btn--solid" onClick={close}>
              Sign In
            </NavLink>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && <div className="nav__backdrop" onClick={close} />}
    </>
  );
}
