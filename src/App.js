// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import MovieSearch from './components/Pages/Home/MovieSearch';
import WatchList from './components/Pages/Home/WatchList';
import { authAction } from './components/storeRedux/authReducer';
import './App.css';
import SignUp from './components/Pages/Signup/Signup';
import { useDispatch, useSelector } from 'react-redux';

function App() {
  const [myList, setMyList] = useState([]);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const userEmail = useSelector(state => state.auth.userEmail); // Get user's email
  const dispatch = useDispatch();

  const addToWatchlist = (movie) => {
    const updatedList = [...myList, movie];
    localStorage.setItem(`myWatchlist_${userEmail}`, JSON.stringify(updatedList));
    setMyList(updatedList);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyList(userEmail);
    } else {
      setMyList([]);
    }
  }, [isAuthenticated, userEmail]);

  const fetchMyList = (email) => {
    const storedArray = localStorage.getItem(`myWatchlist_${email}`);
    const parsedList = JSON.parse(storedArray) || [];
    setMyList(parsedList);
  };

  const handleLogout = () => {
    dispatch(authAction.logout());
    return <Navigate to="/signup" />;
  };

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && (
          <div className="sidebar">
            <h2 className="sidebar-title">WatchList</h2>
            <ul className="sidebar-menu">
              <li className="sidebar-item">
                <Link to="/">Home</Link>
              </li>
              <li className="sidebar-item">
                <Link to="/watchlist">My List</Link>
                <ul className="my-list">
                  {myList.map((movie, index) => (
                    <li key={index}>{movie.Title}</li>
                  ))}
                </ul>
              </li>
            </ul>
            <div className="user-info">
              <p>Hello, {userEmail || 'Guest'}</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        )}
        <div className="main-content">
          <Routes>
            {isAuthenticated ? (
              <>
                <Route path="/" element={<MovieSearch addToWatchlist={addToWatchlist} />} />
                <Route path="/watchlist" element={<WatchList />} />
              </>
            ) : (
              <Route path="/" element={<SignUp />} />
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
