import React from 'react'
import SearchBar from "../components/SearchBar"
import Footer from "../components/Nav&Footer/Footer"
import OverlaySearch from '../components/OverlaySearch'

export default function Home(){
    return(
        <div>  
            <SearchBar />
            <OverlaySearch />

            <br/>
        </div> 
        
    )
}