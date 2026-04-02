import React from 'react';
import { BookOpen } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import BookCard from '../components/BookCard';
import { NavLink } from 'react-router-dom';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist } = useAppContext();

  return (
    <div className="page-container wishlist-page">
      <header>
        <h1>Wishlist</h1>
        <p>Books waiting to be unlocked with your points.</p>
      </header>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-wrap">
            <BookOpen size={48} className="empty-icon" />
          </div>
          <h2>Your shelf is empty!</h2>
          <p>Head over to the Explore page to find new stories.</p>
          <NavLink to="/explore" className="action-button empty-action">
            Explore Books
          </NavLink>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
          {wishlist.map((bookString, index) => (
            <div key={index} style={{
              background: '#fff',
              padding: '16px 24px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '1.1rem', color: '#db506f', fontWeight: '500' }}>{bookString}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
