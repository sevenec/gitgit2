import React, { useState, useEffect } from 'react';
import { Trophy, Star, Crown, Zap } from 'lucide-react';

const AchievementPopup = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (achievement) {
      // Generate celebration particles
      const newParticles = [];
      for (let i = 0; i < 15; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 1000,
          duration: 1000 + Math.random() * 1000
        });
      }
      setParticles(newParticles);

      // Show popup
      setTimeout(() => setIsVisible(true), 100);

      // Auto-hide after 4 seconds
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 500);
      }, 4000);

      return () => clearTimeout(hideTimer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  const getRarityIcon = (rarity) => {
    switch (rarity) {
      case 'legendary': return <Crown className="w-6 h-6 text-yellow-400" />;
      case 'epic': return <Star className="w-6 h-6 text-purple-400" />;
      case 'rare': return <Zap className="w-6 h-6 text-blue-400" />;
      default: return <Trophy className="w-6 h-6 text-green-400" />;
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      default: return 'from-green-400 to-emerald-500';
    }
  };

  return (
    <div className={`achievement-popup ${isVisible ? 'show' : 'hide'}`}>
      {/* Celebration Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-80"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `particle-explosion ${particle.duration}ms ease-out ${particle.delay}ms forwards`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className={`flex-shrink-0 p-2 rounded-full bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}>
            {getRarityIcon(achievement.rarity)}
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-white font-bold text-lg">Achievement Unlocked!</h3>
              <div className={`px-2 py-1 rounded-full text-xs font-bold uppercase bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`}>
                {achievement.rarity}
              </div>
            </div>
            
            <p className="text-yellow-200 font-semibold text-base mb-1">
              {achievement.name}
            </p>
            
            <p className="text-gray-300 text-sm">
              {achievement.description}
            </p>

            {achievement.reward && (
              <div className="mt-2 p-2 bg-black/30 rounded-lg">
                <p className="text-green-300 text-sm font-medium">
                  🎁 Reward: {achievement.reward}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-12 bg-gradient-to-r ${getRarityColor(achievement.rarity)} opacity-20 blur-lg`} />

      {/* Additional CSS for particles */}
      <style jsx>{`
        @keyframes particle-explosion {
          0% {
            transform: scale(0) translateY(0);
            opacity: 1;
          }
          50% {
            transform: scale(1) translateY(-20px);
            opacity: 1;
          }
          100% {
            transform: scale(0) translateY(-40px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AchievementPopup;