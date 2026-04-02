import React from 'react';
import { Heart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './BookCard.css';

const BookCard = ({ book, onClick }) => {
  const { isBookInWishlist, addBooksToWishlist, removeBookFromWishlist } = useAppContext();
  
  const isWishlisted = isBookInWishlist(book);
  
  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      // Remove requires the literal string format now
      const author = book.author_name ? (Array.isArray(book.author_name) ? book.author_name.join(' & ') : book.author_name) : 'Unknown';
      removeBookFromWishlist(`${book.title}, ${author}`);
    } else {
      addBooksToWishlist(book);
    }
  };

  // Construct cover URL. Fallback if not available.
  const coverUrl = book.cover_url || (book.cover_i 
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : 'https://via.placeholder.com/150x200?text=No+Cover');

  return (
    <div className="book-card" onClick={onClick}>
      <div className="book-cover-container">
        <img 
          src={coverUrl} 
          alt={book.title} 
          className="book-cover" 
          loading="lazy" 
          onError={(e) => {
            e.target.closest('.book-card').style.display = 'none';
          }}
        />
        <button 
          className={`wishlist-button ${isWishlisted ? 'active' : ''}`}
          onClick={toggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="book-info">
        <h3 className="book-title" title={book.title}>{book.title}</h3>
        <p className="book-author">
          {book.author_name ? book.author_name.slice(0, 2).join(', ') : 'Unknown Author'}
        </p>
      </div>
    </div>
  );
};

export default BookCard;
