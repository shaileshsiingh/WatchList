import React, { useState, useEffect } from 'react';
import './MovieSearch.css';

const MovieSearch = ({ addToWatchlist }) => {
  const [searchInput, setSearchInput] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [popularMovies, setPopularMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch popular movies when the component mounts
    fetchPopularMovies();
  }, []);

  const fetchPopularMovies = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=6247d0f5&s=batman`);
      const data = await response.json();
      if (response.ok && data.Response === 'True') {
        setPopularMovies(data.Search);
        setErrorMessage('');
      } else {
        setErrorMessage("Unable to load popular movies. Please try again later.");
      }
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      setErrorMessage('An error occurred while fetching popular movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

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
      console.error('Error searching for movie:', error);
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
            Browse your favorite movies and click on '+' to add them to your list.
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
        
        {!searchInput && (
          <>
            <h2>Popular Movies</h2>
            <div className="movie-list">
              {isLoading ? (
                <p>Loading popular movies...</p>
              ) : (
                popularMovies.map((movie) => (
                  <div key={movie.imdbID} className="movie-card">
                    <img src={movie.Poster} alt={movie.Title} className="movie-poster" />
                    <div className="movie-info">
                      <h3 className="movie-title">{movie.Title}</h3>
                      <div className="movie-details">
                        <div className="movie-detail">
                          <span>Year:</span>
                          <span>{movie.Year}</span>
                        </div>
                        <div className="movie-detail">
                          <span>Genre:</span>
                          <span>{movie.Type}</span>
                        </div>
                      </div>
                      <button className="add-button" onClick={() => addToWatchlist(movie)}>+</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {movieData && (
          <div className="movie-card">
            <img src={movieData.Poster} alt={movieData.Title} className="movie-poster" />
            <div className="movie-info">
              <h3 className="movie-title">{movieData.Title}</h3>
              <div className="movie-details">
                <div className="movie-detail">
                  <span>Year:</span>
                  <span>{movieData.Year}</span>
                </div>
                <div className="movie-detail">
                  <span>Runtime:</span>
                  <span>{movieData.Runtime}</span>
                </div>
                <div className="movie-detail">
                  <span>Genre:</span>
                  <span>{movieData.Genre}</span>
                </div>
              </div>
              <button className="add-button" onClick={() => addToWatchlist(movieData)}>+</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MovieSearch;
