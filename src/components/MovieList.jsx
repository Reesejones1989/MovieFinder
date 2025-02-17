import { useState, useEffect } from "react";

const initialMovies = [
  { id: 1, title: "One Of Them Days", year: 2025, poster: "" },
  { id: 2, title: "Inside Out 2", year: 2024, poster: "" },
  { id: 3, title: "Deadpool & Wolverine", year: 2024, poster: "" },
  { id: 4, title: "Wicked", year: 2024, poster: "" },
  { id: 5, title: "Moana 2", year: 2024, poster: "" },
  { id: 6, title: "Despicable Me 4", year: 2024, poster: "" },
  { id: 7, title: "Beetlejuice Beetlejuice", year: 2024, poster: "" },
  { id: 8, title: "The Gorge", year: 2025, poster: "" }
];

export default function MovieList() {
  const [movies, setMovies] = useState(initialMovies);
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchPosters = async () => {
      const updatedMovies = await Promise.all(
        movies.map(async (movie) => {
          if (movie.poster) return movie; // Skip if poster already exists

          try {
            const response = await fetch(
              `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movie.title)}`
            );
            const data = await response.json();

            if (data.results && data.results.length > 0 && data.results[0].poster_path) {
              return {
                ...movie,
                poster: `https://image.tmdb.org/t/p/w600_and_h900_bestv2${data.results[0].poster_path}`,
              };
            }
          } catch (error) {
            console.error(`Error fetching poster for ${movie.title}:`, error);
          }
          return movie;
        })
      );

      setMovies(updatedMovies);
    };

    if (movies.some(movie => !movie.poster)) {
      fetchPosters();
    }
  }, [movies]); // ✅ Include `movies` in the dependency array

  const formatTitleForLevidia = (title) => title.replace(/\s+/g, "-");

  return (
    <div className="movie-list">
      <h2>Popular Movies</h2>
      <ul>
        {movies.map((movie) => (
          <div key={movie.id} className="movie">
            <a
              href={`https://www.levidia.ch/movie.php?watch=${formatTitleForLevidia(movie.title)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={movie.poster || "https://via.placeholder.com/250x300"} 
                height="300"
                width="250"
                alt={movie.title}
              />
              <div>
                <h3>{movie.title}</h3>
                <p>({movie.year})</p>
              </div>
            </a>
          </div>
        ))}
      </ul>
    </div>
  );
}
