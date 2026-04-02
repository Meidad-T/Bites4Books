import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import BookCard from '../components/BookCard';
import BookModal from '../components/BookModal';
import './Explore.css';

const CATEGORIES = [
  { id: 'horror', label: 'Horror' },
  { id: 'mystery', label: 'Mystery' },
  { id: 'humor', label: 'Comedy' },
  { id: 'science_fiction', label: 'Sci-Fi' },
  { id: 'historical', label: 'Historical' }
];

const Explore = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('horror');
  const [selectedBook, setSelectedBook] = useState(null);
  const [offset, setOffset] = useState(0);

  const fetchBooks = async (subject, query = '', isAppending = false, currentOffset = 0) => {
    if (!isAppending) setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_BOOKS_API_KEY;
      let url = `https://api.bigbookapi.com/search-books?api-key=${apiKey}&number=50&offset=${currentOffset}`;
      
      if (query.trim()) {
        url += `&query=${encodeURIComponent(query.trim())}`;
      } else {
        url += `&genres=${subject}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      
      // Big Books API returns 'books' as an array of arrays.
      const rawBooksList = data.books ? data.books.map(arr => arr[0]).filter(book => book.image) : [];

      // Map details
      const newFormattedBooks = rawBooksList.map(book => ({
        key: book.id.toString(),
        title: book.title,
        author_name: book.authors ? book.authors.map(a => a.name) : [],
        cover_url: book.image
      }));

      // Filter limits for duplicates (e.g. max 4 Draculas)
      setBooks(prev => {
        const combined = isAppending ? [...prev, ...newFormattedBooks] : newFormattedBooks;
        
        const filtered = [];
        const variantCounts = {};
        
        for (const book of combined) {
          const authorStr = book.author_name ? book.author_name.join(',') : 'Unknown';
          const identifier = `${book.title.trim().toLowerCase()}|${authorStr.trim().toLowerCase()}`;
          
          variantCounts[identifier] = (variantCounts[identifier] || 0) + 1;
          
          if (variantCounts[identifier] <= 4) {
            filtered.push(book);
          }
        }
        
        return filtered;
      });

    } catch (error) {
      console.error("Failed to fetch books", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchTrigger = () => {
    setOffset(0);
    fetchBooks(selectedCategory, searchQuery, false, 0);
  };

  const handleLoadMore = () => {
    const nextOffset = offset + 50;
    setOffset(nextOffset);
    fetchBooks(selectedCategory, searchQuery, true, nextOffset);
  };

  useEffect(() => {
    setOffset(0);
    fetchBooks(selectedCategory, searchQuery, false, 0);
  }, [selectedCategory]);

  return (
    <div className="page-container explore-page">
      <header>
        <h1>Explore</h1>
        <p>Discover new stories to reward yourself.</p>
      </header>

      <div className="search-bar">
        <Search size={20} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search for books by title or author... (Press Enter to match)" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearchTrigger();
            }
          }}
        />
      </div>

      <div className="categories-scroll">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`category-chip ${selectedCategory === cat.id && !searchQuery ? 'active' : ''}`}
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory(cat.id);
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading && offset === 0 ? (
        <div className="loading-state">
          <Loader2 className="spinner" size={32} />
          <p>Finding wonderful books...</p>
        </div>
      ) : (
        <>
          <div className="books-grid">
            {books.map(book => (
              <BookCard 
                key={book.key} 
                book={book} 
                onClick={() => setSelectedBook(book)}
              />
            ))}
          </div>
          {books.length > 0 && (
            <div className="load-more-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
              <button className="action-button" onClick={handleLoadMore} style={{ display: 'flex', gap: '8px' }}>
                {loading ? <Loader2 className="spinner" size={18} /> : null}
                Load More
              </button>
            </div>
          )}
        </>
      )}

      {selectedBook && (
        <BookModal 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
};

export default Explore;
