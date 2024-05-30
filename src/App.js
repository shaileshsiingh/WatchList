import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch user-specific data (e.g., myList) when authenticated
      fetchMyList(userEmail);
    } else {
      // Clear myList when not authenticated
      setMyList([]);
    }
  }, [isAuthenticated, userEmail]);

  const fetchMyList = (email) => {
    // Retrieve user-specific data (e.g., myList) from localStorage
    const storedArray = localStorage.getItem(`myList_${email}`);
    const parsedList = JSON.parse(storedArray) || [];
    setMyList(parsedList);
  };

  const handleLogout = () => {
    dispatch(authAction.logout());
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
                <Route path="/" element={<MovieSearch />} />
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
