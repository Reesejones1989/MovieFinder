import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import './App.css';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import TvShows from './pages/TvShows.jsx';
import Movies from './pages/Movies.jsx';

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
          <Route path="/About" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
