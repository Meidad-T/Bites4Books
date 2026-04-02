import React, { useState, useEffect } from 'react';
import { X, Loader2, Star, BookOpen, Calendar } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './BookModal.css';

const BookModal = ({ book, onClose }) => {
  const { isBookInWishlist, addBooksToWishlist, removeBookFromWishlist } = useAppContext();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const inWishlist = isBookInWishlist(book?.key);

  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (inWishlist) {
      removeBookFromWishlist(book.key);
    } else {
      addBooksToWishlist(book);
    }
  };

  useEffect(() => {
    if (!book) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const apiKey = import.meta.env.VITE_BOOKS_API_KEY;
        // Big Books API endpoint for specific book ID: /${id}
        const res = await fetch(`https://api.bigbookapi.com/${book.key}?api-key=${apiKey}`);
        if (!res.ok) throw new Error('Failed to fetch details');
        const data = await res.json();
        setDetails(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [book]);

  if (!book) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-body">
          <div className="modal-cover">
            <img src={book.cover_url} alt={book.title} />
          </div>

          <div className="modal-details">
            <h2>{book.title}</h2>
            <p className="modal-author">
              {book.author_name ? book.author_name.join(', ') : 'Unknown Author'}
            </p>

            <button 
              className={`modal-wishlist-button ${inWishlist ? 'active' : ''}`}
              onClick={toggleWishlist}
            >
              {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist 💝'}
            </button>

            {loading ? (
              <div className="modal-loading">
                <Loader2 size={24} className="spinner" />
                <p>Loading book magic...</p>
              </div>
            ) : details ? (
              <div className="modal-expanded-info">
                <div className="modal-stats">
                  {details.rating?.average && (
                    <div className="stat">
                      <Star size={16} /> 
                      <span>{Math.round(details.rating.average * 100) / 10}/10 Rating</span>
                    </div>
                  )}
                  {details.number_of_pages && (
                    <div className="stat">
                      <BookOpen size={16} />
                      <span>{details.number_of_pages} Pages</span>
                    </div>
                  )}
                  {details.publish_date && (
                    <div className="stat">
                      <Calendar size={16} />
                      <span>Published {details.publish_date}</span>
                    </div>
                  )}
                </div>
                
                <div className="modal-description">
                  <h3>Synopsis</h3>
                  <p>{details.description || 'No detailed description available for this book.'}</p>
                </div>
              </div>
            ) : (
              <div className="modal-error">
                <p>Could not fetch extended details. Enjoy the cover!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;
