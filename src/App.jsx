import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Home as HomeIcon, Compass, Heart } from 'lucide-react';
import Home from './pages/Home';
import Explore from './pages/Explore';
import BooksHub from './pages/BooksHub';
import Wishlist from './pages/Wishlist';
import TopNav from './components/TopNav';
import './App.css';

const Navigation = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
        <HomeIcon size={24} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/explore" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
        <Compass size={24} />
        <span>Explore</span>
      </NavLink>
      <NavLink to="/wishlist" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
        <Heart size={24} />
        <span>Wishlist</span>
      </NavLink>
    </nav>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <TopNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<BooksHub />} />
          <Route path="/library" element={<Explore />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
        <Navigation />
      </div>
    </BrowserRouter>
  );
}

export default App;
