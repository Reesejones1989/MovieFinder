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

import React, { useEffect, useState } from 'react';
import NewMovieFinder from './assets/NewMovieFinder.jpg';
import PrivateRoute from './components/PrivateRoute.jsx';
import { FavoritesProvider } from './components/FavoritesContext.jsx';

import './components/firebaseConfig.jsx'; // Initialize Firebase once
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
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>; // Tailwind loading screen
  }

  return (
    <FavoritesProvider>
      <Router>
        <div className="flex flex-col min-h-screen pt-20 pb-32 px-4 md:px-8 relative">
            <br></br>
    <br></br>
    <br></br>
   

        {/* Navigation Bar */}
        <Nav />

        {/* Movie Finder Logo */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10 z-0 select-none">
          <img
            src={NewMovieFinder}
            alt="Movie Links Movie Finder"
            height={300}
            width={300}
            className="w-[600px] max-w-full h-auto filter blur-[0.5px]"
          />
        </div>

        {/* Main Page Content */}
        <main className="flex flex-col flex-grow items-center justify-center px-2">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Movies" element={<Movies />} />
            <Route path="/TV-Shows" element={<TvShows />} />
            <Route path="/Anime" element={<Anime />} />
            <Route path="/Sports" element={<Sports />} />
            <Route path="/LiveTv" element={<LiveTv />} />
            <Route path="/About" element={<About />} />


            {/* Firebase Login logic */}
            <Route path="/Login" element={user ? <Navigate to="/Favorites" replace /> : <Login />} />

            {/* Protected Route */}
            <Route path="/Favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />

            <Route path="/Test" element={<Test />} />

            {/* Redirects & Aliases */}
            <Route path="/Sports" element={<Navigate to="/Sports" replace />} />
            <Route path="/Anime" element={<Navigate to="/Anime" replace />} />
            <Route path="/Movies" element={<Navigate to="/Movies" replace />} />
            <Route path="/Tv-Shows" element={<Navigate to="/TV-Shows" replace />} />
            <Route path="/LiveTV" element={<Navigate to="/LiveTv" replace />} />
            <Route path="/Sport" element={<Navigate to="/Sports" replace />} />
            <Route path="/TvShow" element={<Navigate to="/TV-Shows" replace />} />
            <Route path="/TvShows" element={<Navigate to="/TV-Shows" replace />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
        </div>
      </Router>
    </FavoritesProvider>
  );
}

export default App;
