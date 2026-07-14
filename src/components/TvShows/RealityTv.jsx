import "./TvShowList.css";
import React, { useEffect, useState } from "react";
import Cards from "../Cards.jsx";
import NetflixRealityShows from "./NetflixRealityShows";
import RealityTVShows from "../hardCodedLists/realityTvShows.jsx";


export default function RealityTv() {

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;


  const [trendingShows, setTrendingShows] = useState([]);
  const [popularShows, setPopularShows] = useState([]);


  const [showTrending, setShowTrending] = useState(true);
  const [showPopular, setShowPopular] = useState(true);


  const [loading, setLoading] = useState(true);



  const toggleTrending = () =>
    setShowTrending(!showTrending);


  const togglePopular = () =>
    setShowPopular(!showPopular);



  async function enrichShow(show) {

    const detailRes = await fetch(
      `https://api.themoviedb.org/3/tv/${show.id}?api_key=${apiKey}&append_to_response=external_ids`
    );


    const details = await detailRes.json();


    return {

      id: show.id,

      title: show.name,

      year:
        show.first_air_date?.split("-")[0] || "N/A",

      poster:
        show.poster_path
          ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${show.poster_path}`
          : "",

      imdb_id:
        details.external_ids?.imdb_id || null,

      overview:
        details.overview || "",

      type:"tv"

    };

  }



  useEffect(()=>{


    async function fetchRealityShows(){


      try {


        setLoading(true);



        /*
          Trending Reality TV
          --------------------
          Now loaded from hardcoded list
        */

        setTrendingShows(
          RealityTVShows
        );



        /*
          Popular Reality TV
          --------------------
          Still loaded from TMDB
        */


        const popularRes = await fetch(

          `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=10764&sort_by=popularity.desc&page=1`

        );


        const popularData =
          await popularRes.json();



        const popular =
          await Promise.all(

            popularData.results.map(enrichShow)

          );


        setPopularShows(popular);



      } catch(err){

        console.error(
          "Reality TV Error:",
          err
        );


      } finally {

        setLoading(false);

      }

    }



    fetchRealityShows();


  },[apiKey]);




  if(loading){

    return (

      <div className="loading-screen">

        <div className="loading-spinner"></div>

        <h2 className="loading-text">
          Loading Reality TV...
        </h2>

      </div>

    );

  }




  return (

    <div className="tv-show-list">


      <h2>
        Reality TV
      </h2>



      <h2
        className="collapsible-header"
        onClick={toggleTrending}
      >

        🔥 Trending Reality TV {showTrending ? "▲" : "▼"}

      </h2>



      {showTrending && (

        <div className="tv-show-container">

          {
            trendingShows.map((show)=>(

              <Cards

                key={show.id}

                item={show}

                type="tv"

              />

            ))
          }

        </div>

      )}




      <h2
        className="collapsible-header"
        onClick={togglePopular}
      >

        ⭐ Popular Reality TV {showPopular ? "▲" : "▼"}

      </h2>



      {showPopular && (

        <div className="tv-show-container">


          {
            popularShows.map((show)=>(

              <Cards

                key={show.id}

                item={show}

                type="tv"

              />

            ))
          }


        </div>

      )}



      <NetflixRealityShows />


    </div>

  );

}