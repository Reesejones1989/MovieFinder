import React from "react";
import SportsList from "../components/SportsList";
import "./LiveTvList.css";
import "./SportsList.css";

export default function LiveTv() {
  return (
    <div>

      {/* ⭐ SPORTS SECTION ⭐ */}
      <SportsList />

      <hr style={{ margin: "40px 0", opacity: 0.3 }} />

      {/* ⭐ LIVE TV SECTION ⭐ */}
      <div className="channels-list">
        <h1>Live TV Channels</h1>

        <div className="channels-container">
          <a href="https://tvpass.org/channel/espn" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/ESPN_wordmark.svg" alt="ESPN Logo" />
          </a>

          <a href="https://tvpass.org/channel/tsn1" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/90/TSN_Logo.svg" alt="TSN Logo" />
          </a>

          <a href="https://tvpass.org/channel/tsn2" target="_blank" rel="noopener noreferrer">
            <img src="https://www.start.ca/wp-content/uploads/2022/09/StartTV_ChannelLogos_TheSportsNetwork2.png" alt="TSN2 Logo" />
          </a>

          <a href="https://tvpass.org/channel/nba-tv-usa" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/d/d2/NBA_TV.svg/1024px-NBA_TV.svg.png" alt="NBATV Logo" />
          </a>

          <a href="https://tvpass.org/channel/nfl-redzone" target="_blank" rel="noopener noreferrer">
            <img src="https://consolidatednd.com/wp-content/uploads/2023/08/NFL-RedZone-1024x420.jpg" alt="NFLRZ Logo" />
          </a>

          <a href="https://tvpass.org/channel/nfl-network" target="_blank" rel="noopener noreferrer">
            <img src="https://imengine.public.prod.cdr.navigacloud.com/?uuid=1053A078-4BE7-424E-B770-D2F2829F3A1A&function=cover&type=preview&source=false&width=1050&height=550" alt="NFL Network Logo" />
          </a>

          <a href="https://tvpass.org/channel/bet-eastern-feed" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/be/BET_logo_2005-2012.svg" alt="BET Logo" />
          </a>

          <a href="https://tvpass.org/channel/hbo-eastern-feed" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/d/de/HBO_logo.svg" alt="HBO Logo" />
          </a>

          <a href="https://tvpass.org/channel/hbo-2-eastern-feed" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/HBO_2_logo_alt.png" alt="HBO 2 Logo" />
          </a>

          <a href="https://tvpass.org/channel/hbo-comedy-hd-east" target="_blank" rel="noopener noreferrer">
            <img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/560dfea6-13fc-45c5-abb5-0692213c6010/dfmt2k7-5302da70-7801-43b3-b406-89811549cc26.png" alt="HBO Comedy Logo" />
          </a>

          <a href="https://tvpass.org/channel/lifetime-movies-east" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn.worldvectorlogo.com/logos/lifetime-movies-network.svg" alt="Lifetime Movies Logo" />
          </a>

          <a href="https://tvpass.org/channel/mtv-usa-eastern-feed" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/68/MTV_2021_%28brand_version%29.svg" alt="MTV Logo" />
          </a>

          <a href="https://tvpass.org/channel/mtv-2-east" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/en/2/21/MTV2_logo_2013.svg" alt="MTV 2 Logo" />
          </a>

          <a href="https://tvpass.org/channel/amc-eastern-feed" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/34/AMC_logo_2019.svg" alt="AMC Logo" />
          </a>

          <a href="https://tvpass.org/channel/cartoon-network-usa-eastern-feed" target="_blank" rel="noopener noreferrer">
            <img src="https://1000logos.net/wp-content/uploads/2021/05/Cartoon-Network-logo-500x281.png" alt="Cartoon Network Logo" />
          </a>

          <a href="https://tvpass.org/channel/disney-eastern-feed" target="_blank" rel="noopener noreferrer">
            <img src="https://1000logos.net/wp-content/uploads/2020/09/Disney-Channel-Logo-500x281.png" alt="Disney Channel Logo" />
          </a>

          <a href="https://tvpass.org/channel/nickelodeon-usa-east-feed" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Nickelodeon_2023_logo_%28outline%29.svg/1200px-Nickelodeon_2023_logo_%28outline%29.svg.png" alt="Nickelodeon Logo" />
          </a>

          <a href="https://tvpass.org/channel/oxygen-eastern-feed" target="_blank" rel="noopener noreferrer">
            <img src="https://television-b26f.kxcdn.com/wp-content/uploads/2016/05/Oxygen_logo.svg_-1024x1024.png" alt="Oxygen Logo" />
          </a>

          <a href="https://tvpass.org/channel/showtime-eastern-feed" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/22/Showtime.svg" alt="Showtime Logo" />
          </a>

          <a href="https://tvpass.org/channel/showtime-2-eastern" target="_blank" rel="noopener noreferrer">
            <img src="https://static.wikia.nocookie.net/logopedia/images/d/d1/Showtime_2_logo.svg" alt="Showtime 2 Logo" />
          </a>

          <a href="https://tvpass.org/channel/starz-eastern" target="_blank" rel="noopener noreferrer">
            <img src="https://1000logos.net/wp-content/uploads/2023/02/Starz-logo-500x281.png" alt="Starz Logo" />
          </a>

          <a href="https://tvpass.org/channel/vh1-eastern-feed" target="_blank" rel="noopener noreferrer">
            <img src="https://1000logos.net/wp-content/uploads/2022/09/VH1-Logo-500x281.png" alt="VH1 Logo" />
          </a>

          <a href="https://tvpass.org/channel/cnn-us" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/CNN.svg" alt="CNN Logo" />
          </a>

          <a href="https://tvpass.org/channel/crime-investigation-network-usa-hd" target="_blank" rel="noopener noreferrer">
            <img src="https://www.crimeandinvestigationnetwork.com/assets/images/crimeandinvestigation/generic-thumb.jpg" alt="Crime Network Logo" />
          </a>

          <a href="https://tvpass.org/channel/comedy-central-us-eastern-feed" target="_blank" rel="noopener noreferrer">
            <img src="https://standfirst-designweek-production.imgix.net/uploads/2019/01/11140801/CC_Refresh__Hero_Logo.jpg" alt="Comedy Central" />
          </a>

          <a href="https://tvpass.org/channel/fox-sports-1" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/2015_Fox_Sports_1_logo.svg/1200px-2015_Fox_Sports_1_logo.svg.png" alt="FS1 Logo" />
          </a>

          <a href="https://tvpass.org/channel/hallmark-eastern-feed" target="_blank" rel="noopener noreferrer">
            <img src="https://embroideres.com/files/8515/7105/3387/hallmark_logo_machine_embroidery_design.jpg" alt="Hallmark Logo" />
          </a>

          <a href="https://tvpass.org/channel/tnt-eastern-feed" target="_blank" rel="noopener noreferrer">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoCm97ocaTMAqgHS_WCP1A0OvwF0RTJWoV1g&s" alt="TNT" />
          </a>

          <a href="https://tvpass.org/channel/tv-one" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/TV-One-logo-2016.png" alt="TV One" />
          </a>
        </div>
      </div>
    </div>
  );
}
