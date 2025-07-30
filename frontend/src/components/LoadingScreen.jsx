import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('Initializing Cosmic Engine...');
  const [showButterfly, setShowButterfly] = useState(false);

  const loadingStages = [
    'Initializing Cosmic Engine...',
    'Loading Butterfly Flutterers...',
    'Generating Nebula Backgrounds...',
    'Tuning Premium Audio Tracks...',
    'Preparing Boss Battle Arena...',
    'Calibrating Touch Controls...',
    'Ready for Adventure!'
  ];

  useEffect(() => {
    const loadingInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (Math.random() * 5 + 2);
        const stageIndex = Math.floor((newProgress / 100) * loadingStages.length);
        
        if (stageIndex < loadingStages.length) {
          setLoadingStage(loadingStages[stageIndex]);
        }
        
        if (newProgress >= 50) {
          setShowButterfly(true);
        }
        
        if (newProgress >= 100) {
          clearInterval(loadingInterval);
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(loadingInterval);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 via-pink-900 to-orange-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <div className="w-1 h-1 bg-white rounded-full opacity-40" />
          </div>
        ))}
        
        {/* Cosmic waves */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-radial from-purple-500/30 to-transparent rounded-full animate-pulse" style={{animationDuration: '4s'}} />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-radial from-cyan-500/30 to-transparent rounded-full animate-pulse" style={{animationDuration: '3s', animationDelay: '1s'}} />
        </div>
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center max-w-md px-6">
        {/* Game Logo */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-cyan-300 to-yellow-300 mb-2 animate-pulse">
            BUTTERFLY
          </h1>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300">
            NEBULA BRAWL
          </h2>
        </div>

        {/* Animated Butterfly */}
        {showButterfly && (
          <div className="mb-8 animate-bounce">
            <div className="w-20 h-20 mx-auto relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative animate-pulse">
                  {/* Butterfly wings */}
                  <div className="absolute -top-4 -left-6 w-5 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-80 animate-pulse" />
                  <div className="absolute -top-4 -right-6 w-5 h-8 bg-gradient-to-bl from-pink-400 to-purple-500 rounded-full opacity-80 animate-pulse" />
                  <div className="absolute -bottom-1 -left-4 w-4 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-70 animate-pulse" />
                  <div className="absolute -bottom-1 -right-4 w-4 h-6 bg-gradient-to-bl from-cyan-400 to-blue-500 rounded-full opacity-70 animate-pulse" />
                  {/* Body */}
                  <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full mx-auto" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>0%</span>
            <span className="text-cyan-300 font-bold">{Math.round(progress)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Loading Stage Text */}
        <div className="text-center">
          <p className="text-white font-semibold mb-2 animate-pulse">
            {loadingStage}
          </p>
          <div className="flex justify-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* Loading Tips */}
        <div className="mt-8 text-sm text-gray-300 space-y-2">
          <p>🎮 Tap and drag to control your butterfly</p>
          <p>⚡ Collect power-ups for special abilities</p>
          <p>👑 Defeat the Mother Insect boss on level 15</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;