import React, { useState, useEffect } from 'react';

const LevelTransition = ({ level, isVisible, onComplete, levelConfig }) => {
  const [titleAnimate, setTitleAnimate] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isVisible) {
      // Generate level-themed particles
      const newParticles = [];
      const particleColor = levelConfig?.accentColor || '#FFFFFF';
      
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 1 + Math.random() * 3,
          delay: Math.random() * 2000,
          duration: 2000 + Math.random() * 1000,
          color: particleColor
        });
      }
      setParticles(newParticles);

      // Animate title
      const titleTimer = setTimeout(() => {
        setTitleAnimate(true);
      }, 200);

      // Complete transition
      const completeTimer = setTimeout(() => {
        setTitleAnimate(false);
        setTimeout(onComplete, 400);
      }, 2500);

      return () => {
        clearTimeout(titleTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isVisible, level, onComplete, levelConfig]);

  if (!isVisible) return null;

  const getLevelTheme = (level) => {
    if (level <= 5) return { title: 'Exploration Phase', subtitle: 'Discover the Cosmic Nebula', color: 'from-blue-400 to-cyan-500' };
    if (level <= 10) return { title: 'Adventure Phase', subtitle: 'Navigate Deep Space', color: 'from-purple-400 to-pink-500' };
    if (level <= 14) return { title: 'Battle Phase', subtitle: 'Epic Cosmic Warfare', color: 'from-red-400 to-orange-500' };
    return { title: 'Final Boss', subtitle: 'Face the Mother Insect', color: 'from-yellow-400 to-red-600' };
  };

  const theme = getLevelTheme(level);

  return (
    <div className={`level-transition-overlay ${isVisible ? 'active' : ''}`}>
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full opacity-70"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              animation: `level-particle ${particle.duration}ms ease-out ${particle.delay}ms infinite`
            }}
          />
        ))}
      </div>

      {/* Level Content */}
      <div className="relative z-10 text-center">
        {/* Phase Title */}
        <div className="mb-4">
          <h2 className={`text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r ${theme.color} mb-2`}>
            {theme.title}
          </h2>
          <p className="text-gray-300 text-lg">
            {theme.subtitle}
          </p>
        </div>

        {/* Level Number */}
        <div className={`level-title ${titleAnimate ? 'animate' : ''}`}>
          <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.color}`}>
            LEVEL {level}
          </span>
        </div>

        {/* Level Description */}
        <div className="mt-6 max-w-md mx-auto">
          <p className="text-white text-lg font-medium mb-2">
            {levelConfig?.theme ? `${levelConfig.theme.charAt(0).toUpperCase() + levelConfig.theme.slice(1)} Zone` : 'Cosmic Zone'}
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <span>🎯 New Obstacles</span>
            <span>🎨 Unique Visuals</span>
            <span>🎵 Epic Music</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8">
          <div className="w-64 mx-auto bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${theme.color} transition-all duration-1000 ease-out`}
              style={{ width: `${(level / 15) * 100}%` }}
            />
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Progress: {level}/15 Levels
          </p>
        </div>
      </div>

      {/* Glow Effects */}
      <div className={`absolute inset-0 bg-gradient-radial ${theme.color} opacity-10 blur-3xl`} />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes level-particle {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(-10px) scale(1);
          }
          90% {
            opacity: 1;
            transform: translateY(-80px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) scale(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LevelTransition;