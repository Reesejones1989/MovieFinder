import "./SportsList.css";
import React from "react";

export default function SportsList() {
  return (
    <div className="sports-list">
      <br />

      <h2>Sports Leagues</h2>

      {/* ⭐ MAIN GRID LOGOS ⭐ */}
      <div className="sports-container">

        <a
          href="https://www.streameasto.cx/se-nfl-streams/"
          target="_blank"
          rel="noopener noreferrer"
        >
          StreamEast
          <img loading="lazy" decoding="async"
            src="https://1000logos.net/wp-content/uploads/2017/05/NFL-logo.jpg"
            alt="NFL Logo"
          />
        </a>

        <a
          href="https://www.streameasto.cx/se-nba-streams/"
          target="_blank"
          rel="noopener noreferrer"
        >
          StreamEast
          <img loading="lazy" decoding="async"
            src="https://blog.logomyway.com/wp-content/uploads/2017/01/nba-logo-design.jpg"
            alt="NBA Logo"
          />
        </a>

        <a
          href="https://www.streameasto.cx/mlb/"
          target="_blank"
          rel="noopener noreferrer"
        >
          StreamEast
          <img loading="lazy" decoding="async"
            src="https://content.sportslogos.net/logos/4/490/full/4227__major_league_baseball-primary-2019.png"
            alt="MLB Logo"
          />
        </a>

        <a
          href="https://www.streameasto.cx/cfb/"
          target="_blank"
          rel="noopener noreferrer"
        >
          StreamEast
          <img loading="lazy" decoding="async"
            src="https://ih1.redbubble.net/image.1895314886.6937/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.webp"
            alt="CFB Logo"
          />
        </a>

        <a
          href="https://www.streameasto.cx/ncaab/"
          target="_blank"
          rel="noopener noreferrer"
        >
          StreamEast
          <img loading="lazy" decoding="async"
            src="https://images.seeklogo.com/logo-png/22/1/ncaa-basketball-logo-png_seeklogo-221771.png"
            alt="College Basketball Logo"
          />
        </a>

        <a
          href="https://www.streameasto.cx/boxing/"
          target="_blank"
          rel="noopener noreferrer"
        >
          StreamEast
          <img loading="lazy" decoding="async"
            src="https://c8.alamy.com/comp/2K9YANB/mike-tyson-boxing-boxer-champion-vector-t-shirt-design-red-boxing-gloves-download-it-now-2K9YANB.jpg"
            alt="Boxing Logo"
          />
        </a>

        <a
          href="https://www.streameasto.cx/ufc/"
          target="_blank"
          rel="noopener noreferrer"
        >
          StreamEast
          <img loading="lazy" decoding="async"
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
          <img loading="lazy" decoding="async"
            src="https://www.ppvliveevents.com/static/sitefiles/images/logo.png"
            alt="PPV Logo"
          />
        </a>

      </div>
    </div>
  );
}
