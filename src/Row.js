import React, { useEffect, useState } from 'react'
import YouTube from 'react-youtube';
import axios from './axios'
import './Row.css';
import movieTrailer from 'movie-trailer';

const base_url="https://image.tmdb.org/t/p/original/";

function Row({title,fetchUrl,isLargeRow}) {

   const [movies,setMovies] = useState([]);
   
   const [trailerUrl,setTrailerUrl] = useState("");

   useEffect(()=>{
     async function fetchData(){
         const request = await axios.get(fetchUrl);
         setMovies(request.data.results);
         return request;
     }
     fetchData();
      
   },[fetchUrl]);


const opts = {

  height:"390",
  width:"100%",
  playerVars:{

    autoplay:1,
  },

}
    
   const handleClick = movie =>{
      if(trailerUrl){
        setTrailerUrl('')
      }
      else{
        movieTrailer(movie?.name || "").then(url=>{
         const urlParams =new URLSearchParams(new URL(url).search);
         setTrailerUrl(urlParams.get('v'));
        }).catch(err=>console.log(err.message));
      }
   }

    return (
       <div className="row">
       <h2>{title}</h2>

            <div className="row__posters" >
                {/* several row_posters */}
                {
                    movies.map(movie=>(
                       <img
                      id={movie.id} 
                      key={movie.id}
                      onClick={()=>handleClick(movie)}
                      src={`${base_url}${isLargeRow? movie.poster_path:movie.backdrop_path}`} alt={movie.name} className={`row__poster ${isLargeRow && 'row__posterLarge'}`} />
                       


                    ))
                }
            </div>

            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
       </div>
    )
}

export default Row
