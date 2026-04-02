import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import './TopNav.css';

const TopNav = () => {
  const { user, login, logout } = useAppContext();

  return (
    <nav className="top-nav">
      <div className="top-nav-logo">
        <NavLink to="/">
          <span className="logo-bites">Bites2</span>
          <span className="logo-books">Books</span>
        </NavLink>
      </div>
      <div className="top-nav-links">
        <NavLink to="/" className="top-nav-item">Home</NavLink>
        <NavLink to="/explore" className="top-nav-item">Books</NavLink>
        <NavLink to="/wishlist" className="top-nav-item">Wishlist</NavLink>
        <button 
          className="top-nav-item" 
          onClick={user ? logout : login}
          style={{ cursor: 'pointer', background: 'transparent', border: 'none', padding: 0 }}
        >
          {user ? `Logout (${user.displayName?.split(' ')[0] || 'User'})` : 'Login'}
        </button>
        <NavLink to="/faq" className="top-nav-item">FAQ</NavLink>
      </div>
    </nav>
  );
};

export default TopNav;
