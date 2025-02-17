import { useState, useEffect } from "react";

const initialAnimes = [
  { id: 1, title: "Solo Leveling", year: 2025, poster: "" },  
  { id: 2, title: "Dragon Ball Daima", year: 2025, poster: "" },
  { id: 3, title: "Invincible", year: 2024, poster: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/hNdCIFmVCZRg1NgU2lveqnZRPZj.jpg" },
  { id: 4, title: "My Hero Academia", year: 2024, poster: "" },
  { id: 5, title: "Demon Slayer", year: 2024, poster: "" },
  { id: 6, title: "One Piece-2", year: 2024, poster: "" },
  { id: 7, title: "JuJutsu Kaisen", year: 2024, poster: "" },
  { id: 8, title: "Naruto Shippuden", year: 2024, poster: "" },
  { id: 9, title: "Attack On Titan", year: 2025, poster: "" },
  { id: 10, title: "Boruto", year: 2025, poster: "" }

];

export default function AnimeList() {
  const [animes, setanime] = useState(initialAnimes);
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchPosters = async () => {
      const updatedAnimes = await Promise.all(
        animes.map(async (anime) => {
          if (anime.poster) return anime; // Skip if poster already exists

          try {
            const response = await fetch(
              `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(anime.title)}`
            );
            const data = await response.json();
            console.log (`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent("Invincible")}`)

            if (data.results && data.results.length > 0 && data.results[0].poster_path) {
              return {
                ...anime,
                poster: `https://image.tmdb.org/t/p/w600_and_h900_bestv2${data.results[0].poster_path}`,
              };
            }
          } catch (error) {
            console.error(`Error fetching poster for ${anime.title}:`, error);
          }
          return anime;
        })
      );

      setanime(updatedAnimes);
    };

    if (animes.some(anime => !anime.poster)) {
      fetchPosters();
    }
  }, [animes]); // ✅ Include `movies` in the dependency array

  const formatTitleForLevidia = (title) => title.replace(/:/g, "").replace(/\s+/g, "-");

  return (
    <div className="anime-list">
      <h2> Anime</h2>
      <ul>
        {animes.map((anime) => (
          <div key={anime.id} className="anime">
            <a
              href={`https://fastflix.to/tvshows/${formatTitleForLevidia(anime.title)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={anime.poster || "https://via.placeholder.com/250x300"} 
                height="300"
                width="250"
                alt={anime.title}
              />
              <div>
                <h3>{anime.title}</h3>
                <p>({anime.year})</p>
              </div>
            </a>
          </div>
        ))}
      </ul>
    </div>
  );
}
