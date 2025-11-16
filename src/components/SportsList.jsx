import "./SportsList.css";
import React from "react";

export default function SportsList() {
  return (
    <div className="sports-list">
      <br />

      <h2>Sports Leagues</h2>

      {/* ⭐ FEATURED TOP 4 LINKS ⭐ */}
      <div className="featured-sports">

        <a
          className="featured-card"
          href="https://thetvapp.to/nfl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>All NFL Games</span>
          <img
            src="https://1000logos.net/wp-content/uploads/2017/05/NFL-logo.jpg"
            alt="NFL ALL"
          />
        </a>

        <a
          className="featured-card"
          href="https://thetvapp.to/nba"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>All NBA Games</span>
          <img
            src="https://blog.logomyway.com/wp-content/uploads/2017/01/nba-logo-design.jpg"
            alt="NBA ALL"
          />
        </a>

        <a
          className="featured-card"
          href="https://thetvapp.to/ncaaf"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>All CFB Games</span>
          <img
            src="https://ih1.redbubble.net/image.1895314886.6937/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.webp"
            alt="CFB ALL"
          />
        </a>

        <a
          className="featured-card"
          href="https://thetvapp.to/ncaab"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>All CBB Games</span>
          <img
            src="https://images.seeklogo.com/logo-png/22/1/ncaa-basketball-logo-png_seeklogo-221771.png"
            alt="CBB ALL"
          />
        </a>
      </div>

      {/* ⭐ MAIN GRID LOGOS ⭐ */}
      <div className="sports-container">

        <a
          href="https://www.streameast.ch/se-nfl-streams/"
          target="_blank"
          rel="noopener noreferrer"
        >
          StreamEast
          <img
            src="https://content.sportslogos.net/logos/7/1007/full/dwuw5lojnwsj12vfe0hfa6z47.gif"
            alt="NFL Logo"
          />
        </a>

        <a
          href="https://www.streameast.ch/se-nba-streams/"
          target="_blank"
          rel="noopener noreferrer"
        >
          StreamEast
          <img
            src="https://content.sportslogos.net/logos/6/982/full/_national_basketball_association_logo_primary_20182722.png"
            alt="NBA Logo"
          />
        </a>

        <a
          href="https://www.streameast.ch/se-mlb-streams/"
          target="_blank"
          rel="noopener noreferrer"
        >
          StreamEast
          <img
            src="https://content.sportslogos.net/logos/4/490/full/4227__major_league_baseball-primary-2019.png"
            alt="MLB Logo"
          />
        </a>

        <a
          href="https://www.streameast.ch/se-cfb-streams/"
          target="_blank"
          rel="noopener noreferrer"
        >
          StreamEast
          <img
            src="https://content.sportslogos.net/logos/85/6894/thumbs/689412712024.gif"
            alt="CFB Logo"
          />
        </a>

        <a
          href="https://www.streameast.ch/se-ncaab-streams/"
          target="_blank"
          rel="noopener noreferrer"
        >
          StreamEast
          <img
            src="https://content.sportslogos.net/logos/85/2536/thumbs/253661192025.gif"
            alt="College Basketball Logo"
          />
        </a>

        <a
          href="https://www.streameast.ch/se-boxing-streams/"
          target="_blank"
          rel="noopener noreferrer"
        >
          StreamEast
          <img
            src="https://c8.alamy.com/comp/2K9YANB/mike-tyson-boxing-boxer-champion-vector-t-shirt-design-red-boxing-gloves-download-it-now-2K9YANB.jpg"
            alt="Boxing Logo"
          />
        </a>

        <a
          href="https://www.streameast.ch/se-ufc-streams/"
          target="_blank"
          rel="noopener noreferrer"
        >
          StreamEast
          <img
            src="https://1000logos.net/wp-content/uploads/2017/06/Logo-UFC.png"
            alt="UFC Logo"
          />
        </a>

        <a
          href="https://the.streameast.app/ppv"
          target="_blank"
          rel="noopener noreferrer"
        >
          StreamEast
          <img
            src="https://www.ppvliveevents.com/static/sitefiles/images/logo.png"
            alt="PPV Logo"
          />
        </a>

      </div>
    </div>
  );
}
