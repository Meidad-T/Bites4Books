import React, { useState, useEffect } from 'react';
import './AnimatedHero.css';

const FOOD_IMAGES = ['/hero-food-1.png', '/hero-food-2.png', '/hero-food-3.png'];
const BOOK_IMAGES = ['/hero-cover-1.png', '/hero-cover-2.png', '/hero-cover-3.png'];

export default function AnimatedHero() {
  const [foodIndex, setFoodIndex] = useState(0);
  const [bookIndex, setBookIndex] = useState(0);

  useEffect(() => {
    // We want to loop forever, randomly swapping left or right, with random delay
    let timeoutId;

    const scheduleNextSwap = () => {
      // Random delay between 1000ms and 5000ms
      const delay = Math.floor(Math.random() * 4000) + 1000;
      
      timeoutId = setTimeout(() => {
        // Randomly choose to swap food (0) or book (1)
        const swapFood = Math.random() < 0.5;
        
        if (swapFood) {
          setFoodIndex(prev => {
            // Pick a new random index that is different from previous
            let next = Math.floor(Math.random() * FOOD_IMAGES.length);
            if (next === prev) next = (next + 1) % FOOD_IMAGES.length;
            return next;
          });
        } else {
          setBookIndex(prev => {
            // Pick a new random index that is different from previous
            let next = Math.floor(Math.random() * BOOK_IMAGES.length);
            if (next === prev) next = (next + 1) % BOOK_IMAGES.length;
            return next;
          });
        }
        
        // Schedule the next swap recursively
        scheduleNextSwap();
      }, delay);
    };

    scheduleNextSwap();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="animated-hero-container">
      {/* Background Split */}
      <div className="hero-bg hero-left-bg"></div>
      <div className="hero-bg hero-right-bg"></div>

      {/* Perfect Center Overlap for Images */}
      <div className="hero-center-axis">
        <div className="hero-image-wrapper">
          {/* Foods go behind or front based on overlap */}
          {FOOD_IMAGES.map((src, i) => (
             <img 
               key={`food-${i}`}
               src={src} 
               className={`hero-image ${i === foodIndex ? 'active' : ''}`}
               alt="Food Option" 
             />
          ))}
          {BOOK_IMAGES.map((src, i) => (
             <img 
               key={`book-${i}`}
               src={src} 
               className={`hero-image ${i === bookIndex ? 'active' : ''}`}
               alt="Book Option" 
             />
          ))}
        </div>
      </div>

      {/* Maimai Text Overlay */}
      <div className="maimai-overlay">
        <h2 className="maimai-heading">Hola MaiMai!</h2>
        <div className="maimai-prompt-container">
          <span className="maimai-prompt">Want to earn some free books?</span>
        </div>
        <p className="maimai-subtext">p.s you are beautiful hehehe</p>
      </div>
    </div>
  );
}
