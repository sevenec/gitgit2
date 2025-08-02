import React, { useState, useEffect } from "react";
import "./App.css";
import PremiumLoadingScreen from "./components/PremiumLoadingScreen";

// Simplified Mobile Game Component
const SimpleMobileGame = () => {
  const [gameState, setGameState] = useState('opening');

  useEffect(() => {
    // Initialize basic game without complex dependencies
    console.log('🎮 SimpleMobileGame initialized');
    
    // Try to initialize audio manager
    if (window.AudioManager) {
      try {
        const audioManager = new window.AudioManager();
        window.audioManager = audioManager;
        console.log('🎵 AudioManager initialized');
      } catch (error) {
        console.error('❌ AudioManager failed:', error);
      }
    }
  }, []);

  const handleStartGame = () => {
    console.log('🎮 Starting game...');
    
    // Initialize and test audio on user interaction
    if (window.audioManager) {
      try {
        window.audioManager.resumeAudioContext();
        console.log('🎵 Audio context resumed');
        
        // Test intro music
        window.audioManager.playIntroMusic();
        console.log('🎵 Intro music started');
      } catch (error) {
        console.error('❌ Audio initialization failed:', error);
      }
    } else if (window.AudioManager) {
      try {
        console.log('🎵 Creating new AudioManager...');
        const audioManager = new window.AudioManager();
        window.audioManager = audioManager;
        audioManager.resumeAudioContext();
        audioManager.playIntroMusic();
        console.log('🎵 AudioManager created and intro music started');
      } catch (error) {
        console.error('❌ AudioManager creation failed:', error);
      }
    } else {
      console.warn('⚠️ No AudioManager available');
    }
    
    setGameState('playing');
    
    // Small delay to ensure state change
    setTimeout(initializeSimpleGame, 200);
  };

  const initializeSimpleGame = () => {
    console.log('🎮 Attempting to initialize REAL game engine...');
    
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
      console.error('❌ Canvas not found!');
      return;
    }
    
    // Wait for game scripts to load with retry mechanism
    const tryInitializeGame = (attempt = 1) => {
      console.log(`🔄 Game initialization attempt ${attempt}/5`);
      
      if (typeof window.GameEngine !== 'function' || typeof window.GameRenderer !== 'function') {
        if (attempt < 5) {
          console.log(`⏳ Game scripts not ready, retrying in ${attempt}s...`);
          setTimeout(() => tryInitializeGame(attempt + 1), attempt * 1000);
          return;
        } else {
          console.error('❌ Game scripts failed to load after 5 attempts');
          showErrorOnCanvas(canvas, 'Game scripts not loaded');
          return;
        }
      }
      
      // Scripts are loaded, initialize game
      const ctx = canvas.getContext('2d');
      
      // Set canvas size for mobile
      canvas.width = Math.min(400, window.innerWidth - 20);
      canvas.height = Math.min(600, window.innerHeight - 200);
      
      try {
        console.log('✅ Creating GameEngine instance...');
        const gameEngine = new window.GameEngine(canvas, ctx);
        
        console.log('✅ Creating GameRenderer instance...');
        const gameRenderer = new window.GameRenderer(canvas, ctx);
        
        // Set renderer
        if (gameEngine.setRenderer) {
          gameEngine.setRenderer(gameRenderer);
        }
        
        // Set default flutterer
        const defaultFlutterer = { 
          id: 'basic_cosmic', 
          name: 'Basic Cosmic Flutter',
          colors: { body: '#8B4513', wing1: '#FF6B9D', wing2: '#FF8FA3', accent: '#FFFFFF' }
        };
        
        if (gameEngine.setSelectedFlutterer) {
          gameEngine.setSelectedFlutterer(defaultFlutterer);
        }
        
        // Start the game!
        console.log('🚀 Starting game...');
        gameEngine.startGame();
        
        // Start game loop
        let lastTime = performance.now();
        const gameLoop = (currentTime) => {
          const deltaTime = currentTime - lastTime;
          lastTime = currentTime;

          try {
            if (gameEngine && gameRenderer) {
              gameEngine.update(deltaTime);
              gameRenderer.render(gameEngine);
            }
          } catch (loopError) {
            console.error('❌ Game loop error:', loopError);
          }

          requestAnimationFrame(gameLoop);
        };
        
        // Start level 1 music
        setTimeout(() => {
          if (window.audioManager) {
            try {
              window.audioManager.playLevelMusic(1);
              console.log('🎵 Level 1 music started');
            } catch (audioError) {
              console.error('❌ Audio failed:', audioError);
            }
          }
        }, 500);
        
        requestAnimationFrame(gameLoop);
        console.log('✅ REAL GAME ENGINE STARTED SUCCESSFULLY!');
        
      } catch (error) {
        console.error('❌ Game engine initialization failed:', error);
        showErrorOnCanvas(canvas, `Game Error: ${error.message}`);
      }
    };
    
    tryInitializeGame();
  };
  
  const showErrorOnCanvas = (canvas, message) => {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1a0033';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ff4444';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('❌ ' + message, canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText('Check console for details', canvas.width / 2, canvas.height / 2 + 20);
  };

  if (gameState === 'opening') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4">
        {/* Simplified Opening Screen */}
        <div className="text-center mb-8">
          <div className="mb-6">
            {/* Simple Butterfly */}
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-400 to-purple-500 rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            BUTTERFLY NEBULA BRAWL
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Simplified Mobile Version
          </p>
        </div>

        {/* Simple Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleStartGame}
            className="w-64 py-4 text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
          >
            🎮 START GAME
          </button>
          
          <button
            onClick={() => {
              console.log('🎵 Testing audio...');
              if (window.audioManager) {
                try {
                  window.audioManager.resumeAudioContext();
                  window.audioManager.playSound('sparkles', { volume: 0.7 });
                  console.log('✅ Test audio played');
                } catch (error) {
                  console.error('❌ Test audio failed:', error);
                }
              } else if (window.AudioManager) {
                try {
                  console.log('🎵 Creating AudioManager for test...');
                  const audioManager = new window.AudioManager();
                  window.audioManager = audioManager;
                  audioManager.resumeAudioContext();
                  audioManager.playSound('sparkles', { volume: 0.7 });
                  console.log('✅ Test audio played after AudioManager creation');
                } catch (error) {
                  console.error('❌ AudioManager creation failed:', error);
                }
              } else {
                console.warn('⚠️ No audio system available');
                alert('No audio system detected');
              }
            }}
            className="w-64 py-3 text-lg bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300"
          >
            🎵 Test Audio
          </button>
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Mobile-Optimized Version v1.0</p>
          <p>Core functionality active</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Simple Game Area */}
      <div className="w-full max-w-md mb-4">
        <div className="bg-purple-900 p-4 rounded-lg text-center mb-4">
          <h2 className="text-white font-bold">BUTTERFLY NEBULA BRAWL</h2>
          <p className="text-gray-300 text-sm">Simplified Mobile Game</p>
        </div>
        
        <canvas 
          id="gameCanvas"
          className="border border-purple-500 rounded bg-black w-full"
          style={{ touchAction: 'none' }}
        />
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setGameState('opening')}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          >
            ← Back to Menu
          </button>
        </div>
      </div>

      <div className="text-center text-gray-400 text-xs">
        <p>🔧 Core game engine active</p>
        <p>🎵 Audio system ready</p>
        <p>📱 Mobile-optimized interface</p>
      </div>
    </div>
  );
};

function MobileApp() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    console.log('✅ Loading completed - showing simplified mobile game');
    setIsLoading(false);
  };

  return (
    <div className="App">
      {isLoading && (
        <PremiumLoadingScreen 
          onLoadingComplete={handleLoadingComplete}
          duration={3000}
        />
      )}
      
      {!isLoading && <SimpleMobileGame />}
    </div>
  );
}

export default MobileApp;