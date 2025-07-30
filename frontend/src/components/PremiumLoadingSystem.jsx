import React, { useState, useEffect } from 'react';

const PremiumLoadingSystem = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing Premium Game Systems...');
  
  const statusMessages = [
    'Initializing Premium Game Systems...',
    'Loading High-Quality Assets...',
    'Connecting Premium Audio Engine...',
    'Optimizing Performance Settings...',
    'Finalizing Game Experience...',
    'Ready to Launch!'
  ];

  useEffect(() => {
    console.log('🚀 Premium Loading System Started');
    
    let currentProgress = 0;
    let statusIndex = 0;
    
    const progressInterval = setInterval(() => {
      currentProgress += 15 + Math.random() * 10;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        setStatus('Ready to Launch!');
        
        setTimeout(() => {
          console.log('✅ Premium Loading Complete');
          clearInterval(progressInterval);
          onComplete();
        }, 800);
      } else {
        setProgress(currentProgress);
        
        // Update status message based on progress
        const newStatusIndex = Math.floor((currentProgress / 100) * (statusMessages.length - 1));
        if (newStatusIndex !== statusIndex && newStatusIndex < statusMessages.length) {
          statusIndex = newStatusIndex;
          setStatus(statusMessages[statusIndex]);
        }
      }
    }, 400);

    // Failsafe completion after 5 seconds
    const failsafeTimer = setTimeout(() => {
      console.log('🔧 Premium failsafe activated');
      clearInterval(progressInterval);
      setProgress(100);
      onComplete();
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(failsafeTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Premium Title */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
            Butterfly Nebula Brawl
          </h1>
          <p className="text-xl text-purple-300 font-light">Premium Edition</p>
        </div>
        
        {/* Premium Progress Bar */}
        <div className="w-96 mx-auto space-y-4">
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Status & Progress Text */}
          <div className="space-y-2">
            <p className="text-lg text-purple-200">{status}</p>
            <p className="text-sm text-purple-400">{Math.floor(progress)}% Complete</p>
          </div>
        </div>
        
        {/* Premium Loading Animation */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.3}s`,
                animationDuration: '1.5s'
              }}
            />
          ))}
        </div>
        
        {/* Premium Features List */}
        <div className="text-sm text-purple-300 space-y-1">
          <p>✨ Enhanced Visual Effects</p>
          <p>🎼 High-Quality Audio System</p>
          <p>🎮 Premium Gaming Experience</p>
          <p>⚡ Optimized Performance</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumLoadingSystem;