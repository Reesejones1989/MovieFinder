import React, { useEffect, useState } from "react";
import "./GenreTrending.css";
import Cards from "../components/Cards";
import ListStatus from "./ListStatus.jsx";


const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export const MOVIE_GENRES = [
  { id: 28, name: "Action" },
  //{ id: 12, name: "Adventure" },
 // { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
 // { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
 // { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
 // { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  //{ id: 10402, name: "Music" },
  //{ id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
 // { id: 10752, name: "War" },
 // { id: 37, name: "Western" },
];




export default function GenreTrending() {

  const [genreRows,setGenreRows] = useState({});
  const [loading,setLoading] = useState(true);
  const [failed,setFailed] = useState({});


  useEffect(()=>{

    loadGenres();

  },[]);



async function loadGenres(){

  setLoading(true);

  const rows={};
  const failedRows={};


  await Promise.all(

    MOVIE_GENRES.map(async(genre)=>{

      try {

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/genres/movie/${genre.id}`
        );


        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();


        rows[genre.name] = data || [];


      } catch(error){

        console.error(
          `Failed loading ${genre.name}`,
          error
        );


        rows[genre.name]=[];
        failedRows[genre.name]=true;

      }

    })

  );


  setGenreRows(rows);
  setFailed(failedRows);

  setLoading(false);



  }



  if(loading){

    return (

      <div className="genre-page">

        <h1>
          Loading Trending Genres...
        </h1>

      </div>

    );

  }



  return (

    <div className="genre-page">


      <div className="genre-header">

        <h1>
          🔥 Trending By Genre
        </h1>


        <p>
          Browse today's most popular movies organized by genre.
        </p>

      </div>



      {
        MOVIE_GENRES.map((genre)=>(


          <section
            key={genre.id}
            className="genre-section"
          >


            <div className="genre-title-row">

              <h2>
                {genre.name}
              </h2>


              <span>
                {
                  genreRows[genre.name]?.length || 0
                } Titles
              </span>


            </div>



            <div className="genre-scroll">


              {
                genreRows[genre.name]?.length ?


genreRows[genre.name].slice(0,5).map(movie=>(

                  <Cards

                    key={
                      `${genre.id}-${movie.id}`
                    }

                    item={movie}

                    type="movie"

                  />


                ))


                :

                <ListStatus
                  error={failed[genre.name] ? `Couldn't load ${genre.name} movies.` : null}
                  empty={!failed[genre.name]}
                  emptyText="No movies found."
                  onRetry={loadGenres}
                />


              }


            </div>


          </section>


        ))
      }


    </div>

  );

}