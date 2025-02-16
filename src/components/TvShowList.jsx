const tvShows = [
    {
      id: 1,
      title: "Breaking Bad",
      year: 2008,
      poster: "https://image.tmdb.org/t/p/w200/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    },
    {
      id: 2,
      title: "Game of Thrones",
      year: 2011,
      poster: "https://image.tmdb.org/t/p/w200/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
    },
    {
      id: 3,
      title: "Stranger Things",
      year: 2016,
      poster: "https://image.tmdb.org/t/p/w200/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    },
    {
      id: 4,
      title: "The Office",
      year: 2005,
      poster: "https://image.tmdb.org/t/p/w200/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg",
    },
    {
      id: 5,
      title: "Friends",
      year: 1994,
      poster: "https://image.tmdb.org/t/p/w200/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
    },
    {
      id: 6,
      title: "The Mandalorian",
      year: 2019,
      poster: "https://image.tmdb.org/t/p/w200/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
    },
  ];
  
  export default function TvShowList() {
    const formatTitleForLevidia = (title) => {
      return title.split(" ").join("-"); // Convert spaces to dashes for URL format
    };
  
    return (
      <div className="tv-show-list">
        <h2>Popular TV Shows</h2>
        <ul>
          {tvShows.map((show) => (
            <div key={show.id} className="tv-show">
              <a
                href={`https://www.levidia.ch/tv-show.php?watch=${formatTitleForLevidia(show.title)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={show.poster} height="300" width="250" alt={show.title} />
                <div>
                  <h3>{show.title}</h3>
                  <p>({show.year})</p>
                </div>
              </a>
            </div>
          ))}
        </ul>
      </div>
    );
  }
  