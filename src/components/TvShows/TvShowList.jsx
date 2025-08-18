import NetflixShows from "./NetflixShows";
import React from 'react'
import initialTvShows from "../hardCodedLists/initialTvShows";
import "./TvShowList.css";
import { useState, useEffect } from "react";
import { useFavorites } from '../FavoritesContext.jsx';



export default function TvShowList() {
  const [tvShows, setTvShows] = useState(initialTvShows);
  const [trendingShows, setTrendingShows] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [postersFetched, setPostersFetched] = useState(false);
  const [showTrendingTv, setShowTrending] = useState(true);
  const [showPopularTv, setShowPopular] = useState(true);

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const { addToFavorites, isFavorite } = useFavorites();

  useEffect(() => {
    fetchTrending();
    fetchNetflixList();
  }, []);

  const fetchTrending = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`
      );
      const data = await res.json();

      const enrichedShows = await Promise.all(
        data.results.map(async (show) => {
          const detailRes = await fetch(
            `https://api.themoviedb.org/3/tv/${show.id}?api_key=${apiKey}&append_to_response=external_ids`
          );
          const detailData = await detailRes.json();

          return {
            id: show.id,
            title: show.name,
            year: show.first_air_date ? parseInt(show.first_air_date.split("-")[0]) : "N/A",
            poster: show.poster_path
              ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${show.poster_path}`
              : "",
            imdb_id: detailData.external_ids?.imdb_id || null,
          };
        })
      );

      setTrendingShows(enrichedShows);
    } catch (err) {
      console.error("Failed to fetch trending TV shows:", err);
    }
  };

  useEffect(() => {
    if (!postersFetched) {
      const fetchPosters = async () => {
        const updatedShows = await Promise.all(
          tvShows.map(async (show) => {
            try {
              const res = await fetch(
                `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(show.title)}`
              );
              const data = await res.json();

              if (data.results && data.results.length > 0) {
                const match = data.results[0];

                const detailRes = await fetch(
                  `https://api.themoviedb.org/3/tv/${match.id}?api_key=${apiKey}&append_to_response=external_ids`
                );
                const detailData = await detailRes.json();

                return {
                  ...show,
                  poster: match.poster_path
                    ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${match.poster_path}`
                    : show.poster,
                  imdb_id: detailData.external_ids?.imdb_id || null,
                };
              }
            } catch (error) {
              console.error(`Error fetching data for ${show.title}:`, error);
            }
            return show;
          })
        );

        setTvShows(updatedShows);
        setPostersFetched(true);
      };

      fetchPosters();
    }
  }, [postersFetched, apiKey, tvShows]);

  
  const toggleTrendingTv = () => setShowTrending(prev => !prev);
  const togglePopularTv = () => setShowPopular(prev => !prev);


  const fetchNetflixList = async () => {
  };

  const formatTitleForLevidia = (title) =>
    title
      .replace(/:/g, "")
      .replace(/\s+/g, "-")
      .replace(/&/g, "")
      .replace(/'/g, "")
      .toLowerCase();

  const toggleFlip = (id) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getWatchLinks = (show) => {
    const links = [];

    if (show.imdb_id) {
      links.push({
        url: `https://vidsrc.xyz/embed/tv/${show.imdb_id}`,
        label: "▶️ Watch on Vidsrc",
      });
    }

    links.push({
      url: `https://www.levidia.ch/tv-show.php?watch=${formatTitleForLevidia(show.title)}`,
      label: "▶️ Watch on Levidia",
    });

    return links;
  };

  const handleAddToFavorites = async (show) => {
    const showWithType = {
      ...show,
      type: 'tv'
    };
    
    const success = await addToFavorites(showWithType);
    if (success) {
      alert(`${show.title} added to favorites!`);
    } else {
      alert(`${show.title} is already in your favorites!`);
    }
  };

  const renderShowCards = (shows) => (
    <div className="tv-show-container">
      {shows.map((show) => {
        const watchLinks = getWatchLinks(show);
        return (
          <div
            key={show.id}
            className={`tv-show-card ${flipped[show.id] ? "flipped" : ""}`}
            onClick={() => toggleFlip(show.id)}
          >
            <div className="tv-show-card-inner">
              {/* Front */}
              <div className="tv-show-card-front">
                <img
                  src={show.poster || "https://via.placeholder.com/250x300"}
                  alt={show.title}
                />
                <h3>{show.title}</h3>
                <p>({show.year})</p>
              </div>

              {/* Back */}
              <div className="tv-show-card-back">
                <img
                  src={show.poster || "https://via.placeholder.com/250x300"}
                  alt={show.title}
                />
                <button 
                  className={`favorite-btn ${isFavorite(show.id, 'tv') ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToFavorites(show);
                  }}
                >
                  {isFavorite(show.id, 'tv') ? '❤️ In Favorites' : '⭐ Add to Favorites'}
                </button>
                {watchLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="levidia-link"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="tv-show-list">
      <div className="collapsible-section">
        <h2 onClick={toggleTrendingTv} className="collapsible-header">
          🔥 Trending TV Shows {showTrendingTv ? "▲" : "▼"}
        </h2>
        {showTrendingTv && renderShowCards(trendingShows)}
      </div>
  
      <div className="collapsible-section">
        <h2 onClick={togglePopularTv} className="collapsible-header">
          ⭐ Requested TV Shows {showPopularTv ? "▲" : "▼"}
        </h2>
        {showPopularTv && renderShowCards(tvShows)}
      </div>
  
      <NetflixShows />
    </div>
  );
  
}
