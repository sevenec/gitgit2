import React, { useRef, useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Pause, Play, RotateCcw, Volume2, VolumeX, Star, Coins } from 'lucide-react';
import FluttererSelector from './FluttererSelector';
import OpeningScreen from './OpeningScreen';
import TutorialScreen from './TutorialScreen';
import { FLUTTERERS } from '../data/flutterers';
import { useUser } from '../hooks/useUser';
import { useGame } from '../hooks/useGame';
import { useToast } from '../hooks/use-toast';
import { Toaster } from './ui/toaster';
import LoadingScreen from './LoadingScreen';

const Game = () => {
  const canvasRef = useRef(null);
  const gameEngineRef = useRef(null);
  const gameRendererRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(0);
  
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedFlutterer, setSelectedFlutterer] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [showOpeningScreen, setShowOpeningScreen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [audioManager, setAudioManager] = useState(null);
  const [highScore, setHighScore] = useState(0);
  const [gameEngineReady, setGameEngineReady] = useState(false);
  const [gameStats, setGameStats] = useState({
    highScore: 0,
    maxLevel: 1,
    enemiesDefeated: 0,
    totalSurvivalTime: 0,
    bossDefeats: 0
  });
  
  // Backend integration hooks
  const { user, loading: userLoading, submitScore, selectFlutterer, unlockFlutterer } = useUser();
  const { gameConfig, flutterers, trackEvent, shareScore: shareScoreAPI } = useGame();
  const { toast } = useToast();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Generate session ID
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      const rect = container.getBoundingClientRect();
      
      // Set larger canvas size
      canvas.width = Math.max(400, Math.min(600, rect.width - 40));
      canvas.height = Math.max(500, Math.min(700, window.innerHeight - 300));
      
      console.log('Canvas resized to:', canvas.width, 'x', canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Separate useEffect for game initialization when canvas is available
  useEffect(() => {
    if (gameState === 'playing' && canvasRef.current && !gameEngineReady) {
      console.log('Game state is playing, canvas available, initializing game engine...');
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const initializeGame = () => {
        console.log('Attempting to initialize game...');
        if (!canvasRef.current) {
          console.log('Canvas not available, retrying in 100ms...');
          setTimeout(initializeGame, 100);
          return;
        }
        
        console.log('Canvas found, attempting to create GameEngine...');
        
        // Check if GameEngine is available
        if (typeof window.GameEngine !== 'function') {
          console.error('GameEngine not loaded from script!');
          setTimeout(initializeGame, 100);
          return;
        }
        
        try {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          
          // Resize canvas first
          const container = canvas.parentElement;
          const rect = container.getBoundingClientRect();
          canvas.width = Math.max(400, Math.min(600, rect.width - 40));
          canvas.height = Math.max(500, Math.min(700, window.innerHeight - 300));
          
          // Create game engine instance with both canvas and context
          console.log('Creating GameEngine instance...');
          gameEngineRef.current = new window.GameEngine(canvas, ctx);
          
          // Create enhanced renderer and set it
          console.log('Creating GameRenderer instance...');
          const renderer = new window.GameRenderer(canvas, ctx);
          gameRendererRef.current = renderer; // Store renderer reference
          
          if (gameEngineRef.current.setRenderer) {
            gameEngineRef.current.setRenderer(renderer);
          }
          
          // Set selected flutterer if available, otherwise use default
          const fluttererToUse = selectedFlutterer || { 
            id: 'basic_cosmic', 
            name: 'Basic Cosmic Flutter',
            colors: { body: '#8B4513', wing1: '#FF6B9D', wing2: '#FF8FA3', accent: '#FFFFFF' }
          };
          
          if (gameEngineRef.current.setSelectedFlutterer) {
            gameEngineRef.current.setSelectedFlutterer(fluttererToUse);
          }
          
          console.log('Game initialized successfully');
          setGameEngineReady(true);
          startGameLoop();
        } catch (error) {
          console.error('Failed to initialize game:', error);
          setTimeout(initializeGame, 100);
        }
      };
      
      // Initialize game immediately since canvas is now available
      setTimeout(initializeGame, 200);
    }
  }, [gameState, gameEngineReady, selectedFlutterer]);

  // Initialize audio manager
  useEffect(() => {
    console.log('🎵 Initializing AudioManager...');
    
    const initializeAudio = async () => {
      try {
        // Import and create AudioManager instance
        const AudioManagerModule = await import('../audio/AudioManager');
        const audioManagerInstance = AudioManagerModule.default;
        
        if (audioManagerInstance) {
          console.log('✅ AudioManager imported successfully');
          setAudioManager(audioManagerInstance);
          
          // Make it globally available for testing
          window.audioManager = audioManagerInstance;
          
          console.log('🎵 AudioManager initialized and ready');
        } else {
          console.error('❌ Failed to import AudioManager');
        }
      } catch (error) {
        console.error('❌ AudioManager initialization failed:', error);
      }
    };
    
    initializeAudio();
  }, []);

  // Set default flutterer when user loads
  useEffect(() => {
    if (user && !selectedFlutterer) {
      const userFlutterer = FLUTTERERS.find(f => f.id === user.selected_flutterer) || FLUTTERERS[0];
      setSelectedFlutterer(userFlutterer);
    }
  }, [user, selectedFlutterer]);

  // Check if user has completed tutorial before
  useEffect(() => {
    const hasCompletedTutorial = localStorage.getItem('butterflyTutorialCompleted');
    if (!hasCompletedTutorial) {
      setShowTutorial(false); // Will show tutorial after opening screen
    }
  }, []);

  const startGameLoop = () => {
    console.log('🎮 Starting game loop...');
    
    const gameLoop = (currentTime) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      if (gameEngineRef.current && gameRendererRef.current) {
        // Update game engine
        gameEngineRef.current.update(deltaTime);
        
        // Render the game
        gameRendererRef.current.render(gameEngineRef.current);
        
        // Update UI state
        setGameState(gameEngineRef.current.gameState);
        setScore(gameEngineRef.current.score);
        setLevel(gameEngineRef.current.currentLevel);
        setLives(gameEngineRef.current.lives);
        
        // Update game stats from user data
        if (user?.game_stats) {
          setHighScore(user.game_stats.high_score);
          setGameStats({
            highScore: user.game_stats.high_score,
            maxLevel: user.game_stats.max_level,
            enemiesDefeated: user.game_stats.enemies_defeated,
            totalSurvivalTime: user.game_stats.total_survival_time,
            bossDefeats: user.game_stats.boss_defeats
          });
        }
        
        // Submit score when game ends
        if (gameEngineRef.current.gameState === 'gameOver' && gameEngineRef.current.score > 0) {
          handleGameEnd();
        }
      }

      // Continue the loop
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    // Initialize the loop with current time
    lastTimeRef.current = performance.now();
    
    // Start the game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);
    
    console.log('🎮 Game loop started successfully!');
  };

  const handleLoadingComplete = () => {
    setShowLoadingScreen(false);
    setShowOpeningScreen(true);
  };

  const handleStartGame = () => {
    setShowOpeningScreen(false);
    
    // Check if tutorial should be shown
    const hasCompletedTutorial = localStorage.getItem('butterflyTutorialCompleted');
    if (!hasCompletedTutorial) {
      setShowTutorial(true);
    } else {
      startActualGame();
    }
  };

  const handleTutorialComplete = () => {
    localStorage.setItem('butterflyTutorialCompleted', 'true');
    setShowTutorial(false);
    setGameState('playing'); // Set game state to playing to trigger initialization
    startActualGame();
  };

  const handleTutorialSkip = () => {
    localStorage.setItem('butterflyTutorialCompleted', 'true');
    setShowTutorial(false);
    setGameState('playing'); // Set game state to playing to trigger initialization
    startActualGame();
  };

  const startActualGame = () => {
    console.log('startActualGame called, gameEngineReady:', gameEngineReady);
    
    if (!gameEngineReady) {
      console.log('Game engine not ready yet, waiting...');
      // Wait for game engine to be ready
      const waitForEngine = () => {
        if (gameEngineRef.current) {
          console.log('Game engine now ready, starting game');
          startGame();
        } else {
          setTimeout(waitForEngine, 100);
        }
      };
      waitForEngine();
      return;
    }
    
    startGame();
  };
  
  const startGame = () => {
    if (gameEngineRef.current) {
      console.log('Starting game engine...');
      
      // Start the actual game
      gameEngineRef.current.startGame();
      setIsPaused(false);
      
      // Start level music immediately with better error handling
      if (audioManager) {
        console.log('🎵 Starting audio system...');
        try {
          // Unmute audio for game start
          setIsMuted(false);
          
          // Resume audio context on user interaction
          audioManager.resumeAudioContext();
          
          // Start level music (level 1 gets upbeat music)
          audioManager.playMusic(1);
          
          // Play game start confirmation sound
          audioManager.playSFX('game_start', { volume: 0.5 });
          
          console.log('🎵 Audio started successfully - Level 1 music playing');
        } catch (audioError) {
          console.error('Audio failed to start:', audioError);
        }
      } else {
        console.log('🔇 AudioManager not available');
      }
      
      console.log('🎮 Game started successfully! Canvas should now show gameplay.');
    } else {
      console.error('Game engine still not initialized when trying to start game');
    }
  };

  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  const handleOpenFluttererSelector = () => {
    // This will be handled by the FluttererSelector button in the game UI
    console.log('Opening flutterer selector from menu');
  };

  const handleGameEnd = async () => {
    if (!user?.user_id || !gameEngineRef.current) return;

    try {
      const scoreData = {
        score: gameEngineRef.current.score,
        level: gameEngineRef.current.currentLevel,
        survival_time: Math.floor(gameEngineRef.current.gameTime / 1000),
        enemies_defeated: gameEngineRef.current.enemiesDefeated || 0,
        flutterer_used: selectedFlutterer?.id || 'basic_cosmic',
        session_id: sessionId
      };

      const result = await submitScore(scoreData);
      
      if (result?.new_record) {
        toast({
          title: "🎉 NEW HIGH SCORE!",
          description: `Amazing! You scored ${result.coins_awarded} bonus coins!`,
          duration: 5000,
        });
      }

      // Track analytics
      if (trackEvent && sessionId) {
        await trackEvent('game_complete', {
          score: scoreData.score,
          level: scoreData.level,
          survival_time: scoreData.survival_time,
          flutterer_used: scoreData.flutterer_used
        }, user.user_id, sessionId);
      }

    } catch (error) {
      console.error('Failed to submit score:', error);
    }
  };

  const handleFluttererSelect = async (flutterer) => {
    setSelectedFlutterer(flutterer);
    
    if (gameEngineRef.current) {
      gameEngineRef.current.setSelectedFlutterer(flutterer);
    }
    
    // Update user's selected flutterer in backend
    if (user?.user_id && flutterer?.id) {
      try {
        await selectFlutterer(flutterer.id);
      } catch (error) {
        console.error('Failed to update selected flutterer:', error);
      }
    }
  };
  
  const handlePurchase = async (item) => {
    if (!user?.user_id) {
      toast({
        title: "Authentication Required",
        description: "Please wait for user registration to complete.",
        variant: "destructive",
      });
      return;
    }

    // Simulate purchase process
    toast({
      title: "Purchase Coming Soon!",
      description: `${item.name || item.id} will be available for purchase when the game launches on mobile app stores.`,
      duration: 4000,
    });
    
    // In production, this would handle real IAP
    console.log('Purchase requested for:', item);
  };

  const handleRewardedAd = async () => {
    if (!user?.user_id) return;

    try {
      toast({
        title: "🎬 Watching Ad...",
        description: "Ad system coming soon! You'll earn 25 coins for watching ads.",
        duration: 3000,
      });
      
      // In production, this would show real ads
      console.log('Rewarded ad requested');
    } catch (error) {
      console.error('Failed to process rewarded ad:', error);
    }
  };

  const handleShareScore = async () => {
    if (!user?.user_id || !score) return;

    try {
      const result = await shareScoreAPI(user.user_id, score, 'web');
      
      if (result?.success) {
        toast({
          title: "🎉 Score Shared!",
          description: `You earned ${result.coins_awarded} coins for sharing!`,
          duration: 3000,
        });
      }
      
      // Web sharing
      if (navigator.share) {
        await navigator.share({
          title: 'Butterfly Nebula Brawl',
          text: `I just scored ${score.toLocaleString()} points in Butterfly Nebula Brawl! Can you beat my score?`,
          url: window.location.href
        });
      } else {
        const text = `I just scored ${score.toLocaleString()} points in Butterfly Nebula Brawl! Can you beat my score? ${window.location.href}`;
        await navigator.clipboard.writeText(text);
        toast({
          title: "Score Copied!",
          description: "Share link copied to clipboard!",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Failed to share score:', error);
    }
  };

  const togglePause = () => {
    if (gameEngineRef.current) {
      if (gameEngineRef.current.gameState === 'playing') {
        gameEngineRef.current.gameState = 'paused';
        setIsPaused(true);
      } else if (gameEngineRef.current.gameState === 'paused') {
        gameEngineRef.current.gameState = 'playing';
        setIsPaused(false);
      }
    }
  };

  const restartGame = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.startGame();
      setIsPaused(false);
    }
  };

  const shareScore = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Butterfly Nebula Brawl',
        text: `I just scored ${score} points in Butterfly Nebula Brawl! Can you beat my score?`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers without native sharing
      const text = `I just scored ${score} points in Butterfly Nebula Brawl! Can you beat my score? ${window.location.href}`;
      navigator.clipboard.writeText(text).then(() => {
        alert('Score copied to clipboard!');
      });
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // Control audio manager
    if (audioManager) {
      if (newMutedState) {
        audioManager.mute();
      } else {
        audioManager.unmute();
      }
    }
    
    console.log('Audio', newMutedState ? 'muted' : 'unmuted');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4">
      {/* Loading Screen */}
      {showLoadingScreen && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}

      {/* Opening Screen */}
      {showOpeningScreen && !showLoadingScreen && (
        <OpeningScreen
          onStartGame={handleStartGame}
          onShowTutorial={handleShowTutorial}
          onOpenFluttererSelector={handleOpenFluttererSelector}
          onOpenSettings={() => console.log('Settings')}
          audioManager={audioManager}
        />
      )}

      {/* Tutorial Screen */}
      {showTutorial && !showOpeningScreen && !showLoadingScreen && (
        <TutorialScreen
          onComplete={handleTutorialComplete}
          onSkip={handleTutorialSkip}
        />
      )}

      {/* Game Screen */}
      {!showOpeningScreen && !showTutorial && !showLoadingScreen && (
        <div className="w-full max-w-md">
          {/* Game Header */}
          <Card className="mb-4 p-4 bg-black/30 backdrop-blur-sm border-purple-500/50">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  <span className="text-pink-300">Butterfly</span>{' '}
                  <span className="text-cyan-300">Nebula</span>{' '}
                  <span className="text-yellow-300">Brawl</span>
                </h1>
                {user && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-300">Welcome, {user.username}</span>
                    <Badge variant="outline" className="bg-yellow-600/30 text-yellow-200 border-yellow-400">
                      <Coins size={12} className="mr-1" />
                      {user.cosmic_coins || 0}
                    </Badge>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleMute}
                  className="bg-purple-600/20 border-purple-400 text-white hover:bg-purple-600/40"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </Button>
                {!userLoading && (
                  <FluttererSelector
                    selectedFlutterer={selectedFlutterer}
                    onSelectFlutterer={handleFluttererSelect}
                    gameStats={gameStats}
                    onPurchase={handlePurchase}
                  />
                )}
                {gameState === 'playing' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePause}
                    className="bg-purple-600/20 border-purple-400 text-white hover:bg-purple-600/40"
                  >
                    {isPaused ? <Play size={16} /> : <Pause size={16} />}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={restartGame}
                  className="bg-purple-600/20 border-purple-400 text-white hover:bg-purple-600/40"
                >
                  <RotateCcw size={16} />
                </Button>
              </div>
            </div>
            
            {/* Game Stats */}
            <div className="flex justify-between items-center text-sm">
              <div className="flex gap-4">
                <Badge variant="secondary" className="bg-blue-600/30 text-blue-200">
                  Score: {score.toLocaleString()}
                </Badge>
                <Badge variant="secondary" className="bg-green-600/30 text-green-200">
                  Level: {level}
                </Badge>
                <Badge variant="secondary" className="bg-red-600/30 text-red-200">
                  Lives: {lives}
                </Badge>
              </div>
              <Badge variant="outline" className="bg-yellow-600/30 text-yellow-200 border-yellow-400">
                Best: {user?.game_stats?.high_score?.toLocaleString() || 0}
              </Badge>
            </div>
          </Card>

          {/* Game Canvas */}
          <Card className="relative overflow-hidden bg-black border-purple-500/50">
            <canvas
              ref={canvasRef}
              className="block mx-auto"
              style={{ touchAction: 'none' }}
            />
          </Card>

          {/* Game Controls Info */}
          <Card className="mt-4 p-4 bg-black/30 backdrop-blur-sm border-purple-500/50">
            <div className="text-center text-white">
              <h3 className="font-bold mb-2">Power-Ups Guide</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">⚡</span>
                  <span>Speed Boost</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400">🛡</span>
                  <span>Shield Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-400">💥</span>
                  <span>Blaster Mode</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-pink-400">❤</span>
                  <span>Health Restore</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Social Sharing & Rewards */}
          {(gameState === 'gameOver' || gameState === 'gameComplete') && score > 0 && (
            <Card className="mt-4 p-4 bg-black/30 backdrop-blur-sm border-purple-500/50">
              <div className="text-center space-y-3">
                <h3 className="text-white font-bold mb-2">🎉 Great Game!</h3>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button
                    onClick={handleShareScore}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-6 rounded-full"
                  >
                    Share Score: {score.toLocaleString()}
                  </Button>
                  <Button
                    onClick={handleRewardedAd}
                    variant="outline"
                    className="bg-green-600/20 border-green-400 text-green-200 hover:bg-green-600/40"
                  >
                    🎬 Watch Ad for Coins
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Developer Credits */}
          <div className="mt-6 text-center text-gray-400 text-xs">
            <p>Butterfly Nebula Brawl v1.0</p>
            <p>Built with React & HTML5 Canvas</p>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default Game;