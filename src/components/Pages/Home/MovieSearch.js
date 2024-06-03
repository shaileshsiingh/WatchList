import React, { useState } from 'react';
import './MovieSearch.css';

const MovieSearch = ({ addToWatchlist }) => {
  const [searchInput, setSearchInput] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const search = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=6247d0f5&s=${searchInput}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.Search) {
        setMovieList(data.Search);
        setErrorMessage('');
      } else {
        setErrorMessage("Unable to find what you're looking for. Please try another search.");
        setMovieList([]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="main-content">
        <header className="header">
          <div className="heading">
            <h1 className="title">Welcome to WatchLists</h1>
            <p>
              Browse your favorite movies and click on '+' to add it to your List,
              <br />
              and you can see the details of the movies in your List.
            </p>
          </div>
          <div className="search-container">
            <input
              type="search"
              placeholder="Search for a movie"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="search-input"
            />
            <button onClick={search} className="search-button">
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </header>

        <main>
          {errorMessage && <div className="error">{errorMessage}</div>}
          <div className="movie-list">
            {movieList.map((movie) => (
              <div key={movie.imdbID} className="movie-card">
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="movie-poster"
                  onClick={() => addToWatchlist(movie)}
                />
                <div className="movie-info">
                  <h3 className="movie-title">{movie.Title}</h3>
                  <p className="movie-year">Year: {movie.Year}</p>
                  <div className="add-button" onClick={() => addToWatchlist(movie)}>+</div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MovieSearch;
