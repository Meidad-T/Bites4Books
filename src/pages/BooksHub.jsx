import React from 'react';
import { NavLink } from 'react-router-dom';
import { LibraryBig, Store } from 'lucide-react';
import './BooksHub.css';

const BooksHub = () => {
  return (
    <div className="page-container hub-page">
      <header className="hub-header">
        <h1>Discover Books</h1>
        <p>Before jumping in, where would you like to explore today?</p>
      </header>

      <div className="hub-grid">
        <NavLink to="/library" className="hub-card local-library-card">
          <div className="hub-card-icon">
            <LibraryBig size={48} />
          </div>
          <h2>Bites Library</h2>
          <p>Search over 1000s of books digitally, directly in the app. Use this to lookup stats or add books to your internal Bites2Books wishlist!</p>
          <span className="hub-cta">Enter Library &rarr;</span>
        </NavLink>

        <a 
          href="https://www.barnesandnoble.com/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hub-card external-store-card"
        >
          <div className="hub-card-icon">
            <Store size={48} />
          </div>
          <h2>Barnes & Noble</h2>
          <p>Ready to spend those hard-earned points actually reading? Branch out to the Barnes & Noble store to order real physical copies!</p>
          <span className="hub-cta">Shop Now &rarr;</span>
        </a>
      </div>
    </div>
  );
};

export default BooksHub;
