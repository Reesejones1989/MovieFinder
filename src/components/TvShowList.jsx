import "./TvShowList.css"
import { useState, useEffect } from "react";

const initialTvShows = [
  { id: 1, title: "Breaking Bad", year: 2008, poster: "" },
  { id: 2, title: "Game of Thrones", year: 2011, poster: "" },
  { id: 3, title: "Stranger Things", year: 2016, poster: "" },
  { id: 4, title: "The Office", year: 2005, poster: "" },
  { id: 5, title: "Martin", year: 1992, poster: "" },
  { id: 6, title: "The Mandalorian", year: 2019, poster: "" },
  { id: 7, title: "The White Lotus", year: 2021, poster: "" },
  { id: 8, title: "Fresh Prince of Bel Air", year: 1992, poster: "" },
  { id: 9, title: "BelAir", year: 2022, poster: "" },
  { id: 10, title: "YellowJackets", year: 2022, poster: "" },
  { id: 11, title: "Severance", year: 2022, poster: "" },
  { id: 12, title: "Paradise", year: 2025, poster: "" },


];

export default function TvShowList() {
  const [tvShows, setTvShows] = useState(initialTvShows);
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchPosters = async () => {
      const updatedTvShows = await Promise.all(
        tvShows.map(async (show) => {
          if (show.poster) return show;

          try {
            const response = await fetch(
              `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(show.title)}`
            );
            const data = await response.json();

            if (data.results && data.results.length > 0 && data.results[0].poster_path) {
              return {
                ...show,
                poster: `https://image.tmdb.org/t/p/w600_and_h900_bestv2${data.results[0].poster_path}`,
              };
            }
          } catch (error) {
            console.error(`Error fetching poster for ${show.title}:`, error);
          }
          return show;
        })
      );

      setTvShows(updatedTvShows);
    };

    if (tvShows.some(show => !show.poster)) {
      fetchPosters();
    }
  }, [tvShows]);

  return (
    <div className="tv-show-list">
      <h2>Popular TV Shows</h2>
      {/* ✅ Add this wrapper */}
      <div className="tv-show-container">
        {tvShows.map((show) => (
          <div key={show.id} className="tv-show">
            <a href={`https://www.levidia.ch/tv-show.php?watch=${show.title.replace(/\s+/g, "-")}`} target="_blank" rel="noopener noreferrer">
              <img src={show.poster || "https://via.placeholder.com/250x300"} height="300" width="250" alt={show.title} />
              <div>
                <h3>{show.title}</h3>
                <p>({show.year})</p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}