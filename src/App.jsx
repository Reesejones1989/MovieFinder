import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav&Footer/Nav.jsx';
import Footer from './components/Nav&Footer/Footer.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import TvShows from './pages/TvShows.jsx';
import Movies from './pages/Movies.jsx';
import Anime from './pages/Anime.jsx';
import Sports from './pages/Sports.jsx';
import Login from './pages/Login.jsx';
import Favorites from './pages/Favorite.jsx';
import LiveTv from './pages/LiveTv.jsx';
import OneMovie from './pages/OneMovie.jsx';
import OneTvShow from './pages/OneTvShow.jsx';
import RedirectByIMDb from "./pages/RedirectByIMDb";
import GenrePage from './pages/GenrePage.jsx'

import React, { useEffect } from 'react';
import NewMovieFinder from './assets/NewMovieFinder.jpg';
import PrivateRoute from './components/PrivateRoute.jsx';
import { FavoritesProvider, useFavorites } from './components/FavoritesContext.jsx';
import { ToastProvider } from './components/Toast/ToastContext.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import { trackVisitOnce } from './utils/trackVisit.js';

import './components/firebaseConfig.jsx';

function App() {
  useEffect(() => {
    trackVisitOnce();
  }, []);

  return (
    <ToastProvider>
      <FavoritesProvider>
        <AppShell />
      </FavoritesProvider>
    </ToastProvider>
  );
}

// Auth state comes from FavoritesProvider (the app's one auth listener).
function AppShell() {
  const { user, authReady } = useFavorites();

  if (!authReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
      <Router>
        <div className="flex flex-col min-h-screen pt-20 pb-32 px-4 md:px-8 relative">

          <Nav />

          {/* Background Logo */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10 z-0 select-none">
            <img
              src={NewMovieFinder}
              alt="Movie Finder"
              className="w-[600px] max-w-full h-auto filter blur-[0.5px]"
            />
          </div>

          <main className="main-content">
            <Routes>

              {/* Main Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/tv-shows" element={<TvShows />} />
              <Route path="/genrepage" element={<GenrePage />} />
              <Route path="/anime" element={<Anime />} />
              <Route path="/sports" element={<Sports />} />
              <Route path="/livetv" element={<LiveTv />} />
              <Route path="/about" element={<About />} />

              {/* Media Pages */}
              <Route path="/movie/:imdbID" element={<OneMovie />} />
              <Route path="/tv/:imdbID" element={<OneTvShow />} />

              {/* Auth */}
              <Route
                path="/login"
                element={user ? <Navigate to="/favorites" replace /> : <Login />}
              />

              <Route
                path="/favorites"
                element={
                  <PrivateRoute>
                    <Favorites />
                  </PrivateRoute>
                }
              />

              {/* Admin */}
              <Route
                path="/dashboard"
                element={
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                }
              />

              {/* IMDb Smart Redirect (MUST BE BELOW ALL NAMED ROUTES) */}
              <Route path="/:imdbID" element={<RedirectByIMDb />} />

              {/* Aliases (clean + safe) */}
              <Route path="/tvshows" element={<Navigate to="/tv-shows" replace />} />
              <Route path="/tvshow" element={<Navigate to="/tv-shows" replace />} />
              <Route path="/live-tv" element={<Navigate to="/livetv" replace />} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
  );
}

export default App;