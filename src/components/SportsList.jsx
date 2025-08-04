import "./SportsList.css"; // Import the CSS file
import React from 'react'


export default function SportsList() {
  return (
    <div className="sports-list">
<br></br>
      <h2>Sports Leagues </h2>
      <div className="sports-container">
        <a href="https://the.streameast.app/nflstreams5" target="_blank" rel="noopener noreferrer">
          <img src="https://content.sportslogos.net/logos/7/1007/full/dwuw5lojnwsj12vfe0hfa6z47.gif" alt="NFL Logo" />
        </a>

        <a href="https://the.streameast.app/nba/streams4" target="_blank" rel="noopener noreferrer">
          <img src="https://content.sportslogos.net/logos/6/982/full/_national_basketball_association_logo_primary_20182722.png" alt="NBA Logo" />
        </a>

        <a href="https://the.streameast.app/mlb/streams" target="_blank" rel="noopener noreferrer">
          <img src="https://content.sportslogos.net/logos/4/490/full/4227__major_league_baseball-primary-2019.png" alt="MLB Logo" />
        </a>

        <a href="https://the.streameast.app/cfb/streams2" target="_blank" rel="noopener noreferrer">
          <img src="https://content.sportslogos.net/logos/85/6894/thumbs/689412712024.gif" alt="CFB Logo" />
        </a>

        <a href="https://the.streameast.app/ncaab/streams" target="_blank" rel="noopener noreferrer">
          <img src="https://content.sportslogos.net/logos/85/2536/thumbs/253661192025.gif" alt="College Basketball Logo" />
        </a>

        <a href="https://the.streameast.app/boxingstreams13" target="_blank" rel="noopener noreferrer">
          <img src="https://c8.alamy.com/comp/2K9YANB/mike-tyson-boxing-boxer-champion-vector-t-shirt-design-red-boxing-gloves-download-it-now-2K9YANB.jpg" alt="Boxing Logo" />
        </a>

        <a href="https://the.streameast.app/mmastreams10" target="_blank" rel="noopener noreferrer">
          <img src="https://1000logos.net/wp-content/uploads/2017/06/Logo-UFC.png" alt="UFC Logo" />
        </a>

        <a href="https://the.streameast.app/ppv" target="_blank" rel="noopener noreferrer">
          <img src="https://www.ppvliveevents.com/static/sitefiles/images/logo.png" alt="PPV Logo" />
        </a>

      </div>
    </div>
  );
}
