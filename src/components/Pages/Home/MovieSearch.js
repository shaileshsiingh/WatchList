import React, { useState, useEffect } from 'react';
import './MovieSearch.css';

const MovieSearch = ({ addToWatchlist }) => {
  const [searchInput, setSearchInput] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const search = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=6247d0f5&t=${searchInput}`);
      const data = await response.json();
      if (response.ok && data.Response === 'True') {
        setMovieData(data);
        setErrorMessage('');
      } else {
        setErrorMessage("Unable to find what you're looking for. Please try another search.");
        setMovieData(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while searching. Please try again later.');
      setMovieData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div className="heading">
          <h1 className="title">Welcome to WatchLists</h1>
          <p>
            Browse your favorite movies and click on '+' to add them to your list,
            <br />
            and you can see the details of the movies in your list.
          </p>
        </div>
        <div className="search-container">
          <input
            type="search"
            placeholder="Search for a movie by title"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          <button onClick={search} className="search-button" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </header>

      <main className="main">
        {errorMessage && <div className="error">{errorMessage}</div>}
        {movieData && (
          <div className="movie-card">
            <img src={movieData.Poster} alt={movieData.Title} className="movie-poster" />
            <div className="movie-info">
              <h3 className="movie-title">{movieData.Title}</h3>
              <p className="movie-year">Year: {movieData.Year}</p>
              <p className="movie-runtime">Runtime: {movieData.Runtime}</p>
              <p className="movie-genre">Genre: {movieData.Genre}</p>
              <button className="add-button" onClick={() => addToWatchlist(movieData)}>+</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MovieSearch;
