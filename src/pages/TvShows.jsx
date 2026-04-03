import {Link } from "react-router-dom";
import React from 'react'
import SearchBar from "../components/SearchBar"
import "./MovieTvShow.css";


import TvShowList from "../components/TvShows/TvShowList";

export default function TvShows() {
  return (
    <div className="page-container">

      

      <TvShowList />

    </div>
  );
}