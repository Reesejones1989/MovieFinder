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
import Test from './components/Test/Test.jsx';
import OneMovie from './pages/OneMovie.jsx';
import OneTvShow from './pages/OneTvShow.jsx';
import OverlaySearch from './components/OverlaySearch.jsx';
import RedirectByIMDb from "./pages/RedirectByIMDb";

import React, { useEffect, useState } from 'react';
import NewMovieFinder from './assets/NewMovieFinder.jpg';
import PrivateRoute from './components/PrivateRoute.jsx';
import { FavoritesProvider } from './components/FavoritesContext.jsx';

import './components/firebaseConfig.jsx';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <FavoritesProvider>
      <Router>
        <div className="flex flex-col min-h-screen pt-20 pb-32 px-4 md:px-8 relative">

          <Nav />
          <OverlaySearch />

          {/* Background Logo */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10 z-0 select-none">
            <img
              src={NewMovieFinder}
              alt="Movie Finder"
              className="w-[600px] max-w-full h-auto filter blur-[0.5px]"
            />
          </div>

          <main className="flex flex-col flex-grow items-center justify-center px-2">
            <Routes>

              {/* Main Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/tv-shows" element={<TvShows />} />
              <Route path="/anime" element={<Anime />} />
              <Route path="/sports" element={<Sports />} />
              <Route path="/livetv" element={<LiveTv />} />
              <Route path="/about" element={<About />} />

              {/* Media Pages */}
              <Route path="/movie/:imdbID" element={<OneMovie />} />
              <Route path="/tv/:imdbID" element={<OneTvShow />} />

              {/* IMDb Smart Redirect (MUST BE BELOW MAIN ROUTES) */}
              <Route path="/:imdbID" element={<RedirectByIMDb />} />

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

              {/* Misc */}
              <Route path="/test" element={<Test />} />

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
    </FavoritesProvider>
  );
}

export default App;