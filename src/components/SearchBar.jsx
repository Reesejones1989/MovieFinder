import React, { useState, useEffect } from "react";
import "./SearchBar.css";
import { useFavorites } from "./FavoritesContext.jsx";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isTVShow, setIsTVShow] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [activeVidSrc, setActiveVidSrc] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  const { addToFavorites, isFavorite } = useFavorites();
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      const type = isTVShow ? "tv" : "movie";
      const url = `https://api.themoviedb.org/3/search/${type}?query=${searchTerm}&api_key=${apiKey}`;

      const res = await fetch(url);
      const data = await res.json();
      if (!data.results) return;

      const detailed = await Promise.all(
        data.results.slice(0, 5).map(async (item) => {
          let imdb_id = null;

          if (isTVShow) {
            const extRes = await fetch(
              `https://api.themoviedb.org/3/tv/${item.id}/external_ids?api_key=${apiKey}`
            );
            const extData = await extRes.json();
            imdb_id = extData.imdb_id;
          } else {
            const detailRes = await fetch(
              `https://api.themoviedb.org/3/movie/${item.id}?api_key=${apiKey}`
            );
            const detailData = await detailRes.json();
            imdb_id = detailData.imdb_id;
          }

          return { ...item, imdb_id };
        })
      );

      setSuggestions(detailed);
    };

    const delay = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(delay);
  }, [searchTerm, isTVShow, apiKey]);

  // Step 1: Click VidSrc → fetch seasons
  const handleVidSrcClick = async (item) => {
    if (!item.imdb_id) return;

    if (!isTVShow) {
      window.open(
        `https://vidsrc.xyz/embed/movie/${item.imdb_id}`,
        "_blank"
      );
      return;
    }

    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${item.id}?api_key=${apiKey}`
    );
    const data = await res.json();

    setActiveVidSrc(item.id);
    setSeasons(data.seasons.filter((s) => s.season_number > 0));
    setSelectedSeason(null);
    setEpisodes([]);
    setSelectedEpisode(null);
  };

  // Step 2: When season changes → populate episodes
  const handleSeasonChange = (seasonNumber) => {
    const season = seasons.find((s) => s.season_number === Number(seasonNumber));
    if (!season) return;
    const eps = Array.from({ length: season.episode_count }, (_, i) => i + 1);
    setEpisodes(eps);
    setSelectedSeason(seasonNumber);
    setSelectedEpisode(null);
  };

  // Step 3: Play button → open VidSrc
  const handlePlay = (item) => {
    if (!selectedSeason || !selectedEpisode) return;
    window.open(
      `https://vidsrc-embed.ru/embed/tv?imdb=${item.imdb_id}&season=${selectedSeason}&episode=${selectedEpisode}`,
      "_blank"
    );
  };

  return (
    <div className="search-wrapper">
      <div className="search-bar">
        <button onClick={() => setIsTVShow(!isTVShow)}>
          {isTVShow ? "Switch to Movies" : "Switch to TV Shows"}
        </button>

        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={isTVShow ? "Search TV Shows..." : "Search Movies..."}
        />
      </div>

      {suggestions.map((item) => {
        const vidsrcActive = activeVidSrc === item.id;

        // Levidia link
        const formattedTitle = (item.title || item.name)
          .replace(/\s+/g, "-")
          .replace(/:/g, "")
          .replace("Spider-Man", "Spiderman");

        const levidiaUrl = isTVShow
          ? `https://www.levidia.ch/tv-show.php?watch=${formattedTitle}`
          : `https://www.levidia.ch/movie.php?watch=${formattedTitle}`;

        return (
          <div key={item.id} className="suggestion-item">
            <img
              src={
                item.poster_path
                  ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                  : "https://via.placeholder.com/50x75"
              }
              alt={item.title || item.name}
            />

            <div className="suggestion-details">
              <span>{item.title || item.name}</span>

              <div className="link-buttons">
                <a href={levidiaUrl} target="_blank" rel="noopener noreferrer">
                  <button>Levidia</button>
                </a>

                {item.imdb_id && (
                  <button onClick={() => handleVidSrcClick(item)}>VidSrc</button>
                )}
              </div>

              {vidsrcActive && isTVShow && (
                <div className="episode-selector">
                  {/* Season Dropdown */}
                  <select
                    value={selectedSeason || ""}
                    onChange={(e) => handleSeasonChange(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Season
                    </option>
                    {seasons.map((s) => (
                      <option key={s.id} value={s.season_number}>
                        Season {s.season_number}
                      </option>
                    ))}
                  </select>

                  {/* Episode Dropdown */}
                  {episodes.length > 0 && (
                    <select
                      value={selectedEpisode || ""}
                      onChange={(e) => setSelectedEpisode(e.target.value)}
                    >
                      <option value="" disabled>
                        Select Episode
                      </option>
                      {episodes.map((ep) => (
                        <option key={ep} value={ep}>
                          Episode {ep}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Play Button */}
                  {selectedSeason && selectedEpisode && (
                    <button onClick={() => handlePlay(item)}>▶️ Play</button>
                  )}
                </div>
              )}

              {/* Favorites */}
              <button
                onClick={() =>
                  addToFavorites({ ...item, type: isTVShow ? "tv" : "movie" })
                }
                className={
                  isFavorite(item.id, isTVShow ? "tv" : "movie")
                    ? "favorite-btn active"
                    : "favorite-btn"
                }
              >
                {isFavorite(item.id, isTVShow ? "tv" : "movie")
                  ? "❤️ In Favorites"
                  : "⭐ Add to Favorites"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
