import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import './App.css';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import TvShows from './pages/TvShows.jsx';
import Movies from './pages/Movies.jsx';
import Anime from './pages/Anime.jsx'
import Sports from './pages/Sports.jsx'

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navigation Bar */}
        <Nav />

        {/* Movie Finder Logo */}
        <div className="logo-container">
          <img 
            src="https://r2.erweima.ai/i/JlHYKridTXa_U4NgCQ63Ww.png" 
            alt="Movie Links Movie Finder" height="300" width="300"
            className="movie-logo" 
          />
        </div>

        {/* Page Content */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Movies" element={<Movies />} />
          <Route path="/TV-Shows" element={<TvShows />} />
          <Route path="/Anime" element={<Anime />} />
          <Route path="/Sports" element={<Sports />} />
          <Route path="/About" element={<About />} />
          
          <Route path="Sports" element={<Navigate to="/Sports" replace />} />
          <Route path="Anime" element={<Navigate to="/Anime" replace />} />
          <Route path="Movies" element={<Navigate to="/Movies" replace />} />
          <Route path="Tv-Shows" element={<Navigate to="/TV-Shows" replace />} />



          <Route path="Sport" element={<Navigate to="/Sports" replace />} />
          <Route path="TvShow" element={<Navigate to="/TV-Shows" replace />} />
          <Route path="TvShows" element={<Navigate to="/TV-Shows" replace />} />
          <Route path="Movie" element={<Navigate to="/Movies" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />




        </Routes>
      </div>
    </Router>
  );
}

export default App;
