import { useState } from 'react'
import Nav from './components/Nav.jsx'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import TvShows from './pages/TvShows.jsx';
import Movies from './pages/Movies.jsx';



function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div>
        <Nav />
        <h1><img src="https://r2.erweima.ai/i/JlHYKridTXa_U4NgCQ63Ww.png" alt="Movie Links Movie Finder" width="200" height="200" />
        </h1>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Movies" element={<Movies />} />
        <Route path="/TV-Shows" element={<TvShows />} />
        <Route path="/About" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App
