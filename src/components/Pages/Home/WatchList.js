// WatchList.js
import React, { useEffect, useState } from 'react';
import './WatchList.css';
import { useSelector } from 'react-redux';

const WatchList = () => {
  const [myList, setMyList] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const userEmail = useSelector(state => state.auth.userEmail); // Get user's email

  useEffect(() => {
    if (userEmail) {
      fetchWatchlist(userEmail);
    }
  }, [userEmail]);

  const fetchWatchlist = (email) => {
    const storedArray = localStorage.getItem(`myWatchlist_${email}`);
    const parsedList = JSON.parse(storedArray) || [];
    setMyList(parsedList);
    setFilteredMovies(parsedList);
  };

  const removeFromWatchlist = (movieId) => {
    const updatedList = myList.filter((movie) => movie.imdbID !== movieId);
    localStorage.setItem(`myWatchlist_${userEmail}`, JSON.stringify(updatedList));
    setMyList(updatedList);
    setFilteredMovies(updatedList);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchInput(searchTerm);
    const filtered = myList.filter((movie) =>
      movie.Title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMovies(filtered);
  };

 

  return (
    <div className="watchlist-container">
      <div className="watchlist-heading">
        <h2 className="watchlist-title">My Watchlist</h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchInput}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="watchlist-content">
        {filteredMovies.length > 0 ? (
          <div className="movie-list">
            {filteredMovies.map((movie) => (
              <div key={movie.imdbID} className="movie-card">
                {movie.Poster !== 'N/A' ? (
                  <img className="movie-image" src={movie.Poster} alt={movie.Title} />
                ) : (
                  <span className="no-poster">No Poster Available</span>
                )}
                <div className="movie-info">
                  <h3 className="movie-title">{movie.Title}</h3>
                  <p className="movie-rating">
                    <span className="star">&#9733;</span>
                    {movie.imdbRating}
                  </p>
                  <p className="movie-details">
                    <span>{movie.Runtime}</span>
                    <span>{movie.Genre}</span>
                  </p>
                  <p className="movie-plot">{movie.Plot}</p>
                  <button className="remove-button" onClick={() => removeFromWatchlist(movie.imdbID)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-watchlist">
            <p>Your watchlist is looking a little empty...</p>
            <a href="/" className="add-movies-link">
              Let's add some movies!
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchList;
