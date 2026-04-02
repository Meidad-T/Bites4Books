import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ points, milestones = [25, 50, 100], maxPoints = 100 }) => {
  // Cap percentage at 100%
  const percentage = Math.min((points / maxPoints) * 100, 100);

  return (
    <div className="progress-container">
      <div className="progress-bar-bg">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%` }}
        />
        
        {/* Render Milestone Markers */}
        {milestones.map((milestone) => {
          const isReached = points >= milestone;
          const leftPosition = (milestone / maxPoints) * 100;
          const isFreeBook = milestone % 200 === 0;
          const labelText = isFreeBook ? "Free Book!" : milestone;
          
          return (
            <div 
              key={milestone}
              className={`milestone-marker ${isReached ? 'reached' : ''}`}
              style={{ left: `${leftPosition}%` }}
              title={`${labelText}`}
            >
              {isFreeBook && <div className="milestone-label-bottom">Free<br/>Book!</div>}
              <span className="milestone-label">{milestone}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
