import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Utensils, CheckCircle, Star, Gift, Leaf } from 'lucide-react';
import AnimatedHero from '../components/AnimatedHero';
import Counter from '../components/Counter';
import ProgressBar from '../components/ProgressBar';
import { useAppContext } from '../context/AppContext';
import './Home.css';

const Home = () => {
  const { user, login, points, lifetimePoints, logMeal, getRemainingLogs } = useAppContext();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [mealInput, setMealInput] = useState('');

  const remainingLogs = getRemainingLogs();

  const handleEarnPoints = () => {
    if (remainingLogs <= 0 || !mealInput.trim()) return;

    const success = logMeal(mealInput.trim(), 10); // 10 points per meal, passing exact string!

    if (success) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
      setIsLogging(false);
      setMealInput('');

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c4d7b2', '#e8e6e1', '#ffffff', '#8fae77']
      });
    }
  };
  return (
    <div className="home-page-wrapper">
      <AnimatedHero />
      <div className="page-container home-page">
        {/* Progress and Logging Area */}
        <div className="home-progress-section">
          <div className="home-progress-container">
            {points === 0 ? (
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#333', marginBottom: '8px', letterSpacing: '-1px' }}>
                No Points (yet)
              </h2>
            ) : (
              <Counter
                value={points}
                places={[100, 10, 1]}
                fontSize={56}
                padding={5}
                gap={6}
                textColor="#333"
                fontWeight={900}
                digitPlaceHolders
                gradientFrom="rgba(255, 255, 255, 0)"
              />
            )}
            <ProgressBar points={points} milestones={[200, 400, 600]} maxPoints={600} />
          </div>

          <div className="home-action-container">
            {isLogging ? (
              <div className="home-input-area">
                <input 
                  type="text" 
                  className="home-meal-input"
                  placeholder="what did we eat?" 
                  value={mealInput}
                  onChange={e => setMealInput(e.target.value)}
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleEarnPoints()}
                />
                <button 
                  className="home-yummy-button" 
                  onClick={handleEarnPoints}
                  disabled={!mealInput.trim()}
                >
                  Earn Yummy Points!
                </button>
                <button 
                  className="home-cancel-button" 
                  onClick={() => setIsLogging(false)}
                >
                  Cancel
                </button>
              </div>
            ) : !user ? (
              <button 
                className="home-log-button disabled"
                style={{ background: '#db506f', color: '#fff', opacity: 1, border: 'none' }}
                onClick={login}
              >
                Log in for 10 free points!
              </button>
            ) : (
              <button 
                className={`home-log-button ${isAnimating ? 'animating' : ''} ${remainingLogs === 0 ? 'disabled' : ''}`}
                onClick={() => setIsLogging(true)}
                disabled={remainingLogs === 0}
              >
                <Leaf size={18} />
                {remainingLogs > 0 ? 'Log Meal' : 'Thank you for eating today cutie!'}
              </button>
            )}
          </div>
        </div>

        <section className="how-it-works-section">
          <h2>How It Works</h2>
          <div className="how-it-works-grid">
            <div className="step-card">
              <div className="step-icon-wrapper pulse-1">
                <Utensils size={32} />
              </div>
              <h3>1. Eat Your Meals</h3>
              <p>Nourish your body! That's the most important step.</p>
            </div>

            <div className="step-card">
              <div className="step-icon-wrapper pulse-2">
                <CheckCircle size={32} />
              </div>
              <h3>2. Log Your Meals</h3>
              <p>Simply acknowledge you ate. No numbers, no stress.</p>
            </div>

            <div className="step-card">
              <div className="step-icon-wrapper pulse-3">
                <Star size={32} />
              </div>
              <h3>3. Earn Points</h3>
              <p>Every logged meal earns you 10 points on your journey.</p>
            </div>

            <div className="step-card special-card">
              <div className="step-icon-wrapper pulse-4">
                <Gift size={32} />
              </div>
              <h3>4. Redeem Points</h3>
              <p>Every 200 points is a Free Book sponsored by your cool Boyfriend! 💝</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
