import { Link } from 'react-router-dom';
import './Nav.css';

export default function Nav() {
  return (
    <div className='Nav'>
      <img src='https://r2.erweima.ai/i/JlHYKridTXa_U4NgCQ63Ww.png' height="100" width="100" />
      

      {/* Wrap the nav links in a div */}
      <div className="nav-links">
        <Link id='Home' to="/">
          <div>Home </div> 
        </Link>
        <Link id='Movies' to="/Movies">
          <div>Movies </div>
        </Link>
        <Link id='TvShows' to="/TV-Shows">
          <div>Tv Shows </div>
        </Link>
        <Link id='Anime' to="/Anime">
          <div>Anime </div>
        </Link>
        <Link id='Sports' to="/Sports">
          <div>Sports </div>
        </Link>
        <Link id='About' to="/About">
          <div>About</div>
        </Link>
      </div>
    </div>
  );
}
