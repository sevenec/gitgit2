import React, { useRef, useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Pause, Play, RotateCcw, Volume2, VolumeX, Star } from 'lucide-react';
import FluttererSelector from './FluttererSelector';
import { FLUTTERERS } from '../data/flutterers';

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
  const [highScore, setHighScore] = useState(0);
  const [selectedFlutterer, setSelectedFlutterer] = useState(null);
  const [gameStats, setGameStats] = useState({
    highScore: 0,
    maxLevel: 1,
    enemiesDefeated: 0,
    totalSurvivalTime: 0,
    bossDefeats: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size for mobile
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      const rect = container.getBoundingClientRect();
      
      canvas.width = Math.min(400, rect.width - 40);
      canvas.height = Math.min(600, window.innerHeight - 200);
      
      // Initialize game engine and renderer
      const ctx = canvas.getContext('2d');
      
      // Wait for game classes to load and add debugging
      const initializeGame = () => {
        console.log('Attempting to initialize game...', { GameEngine: !!window.GameEngine, GameRenderer: !!window.GameRenderer });
        
        if (window.GameEngine && window.GameRenderer) {
          try {
            gameEngineRef.current = new window.GameEngine(canvas, ctx);
            gameRendererRef.current = new window.GameRenderer(canvas, ctx);
            console.log('Game initialized successfully');
            startGameLoop();
          } catch (error) {
            console.error('Error initializing game:', error);
          }
        } else {
          console.log('Game classes not yet loaded, retrying...');
          // Retry after a short delay
          setTimeout(initializeGame, 100);
        }
      };
      
      // Give a small delay to ensure scripts are loaded
      setTimeout(initializeGame, 500);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Load high score and game stats from localStorage
    const savedHighScore = localStorage.getItem('butterflyNebulaHighScore');
    const savedMaxLevel = localStorage.getItem('butterflyMaxLevel');
    const savedEnemiesDefeated = localStorage.getItem('butterflyEnemiesDefeated');
    const savedSurvivalTime = localStorage.getItem('butterflySurvivalTime');
    const savedBossDefeats = localStorage.getItem('butterflyBossDefeats');
    
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
    
    setGameStats({
      highScore: parseInt(savedHighScore || '0'),
      maxLevel: parseInt(savedMaxLevel || '1'),
      enemiesDefeated: parseInt(savedEnemiesDefeated || '0'),
      totalSurvivalTime: parseInt(savedSurvivalTime || '0'),
      bossDefeats: parseInt(savedBossDefeats || '0')
    });
    
    // Set default flutterer
    setSelectedFlutterer(FLUTTERERS[0]); // Basic Cosmic Flutter

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startGameLoop = () => {
    const gameLoop = (currentTime) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      if (gameEngineRef.current && gameRendererRef.current) {
        gameEngineRef.current.update(deltaTime);
        gameRendererRef.current.render(gameEngineRef.current);
        
        // Update UI state
        setGameState(gameEngineRef.current.gameState);
        setScore(gameEngineRef.current.score);
        setLevel(gameEngineRef.current.currentLevel);
        setLives(gameEngineRef.current.lives);
        
        // Update high score
        if (gameEngineRef.current.score > highScore) {
          const newHighScore = gameEngineRef.current.score;
          setHighScore(newHighScore);
          localStorage.setItem('butterflyNebulaHighScore', newHighScore.toString());
        }
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);
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
    setIsMuted(!isMuted);
    // In a full implementation, this would control game audio
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Game Header */}
        <Card className="mb-4 p-4 bg-black/30 backdrop-blur-sm border-purple-500/50">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-white">
              <span className="text-pink-300">Butterfly</span>{' '}
              <span className="text-cyan-300">Nebula</span>{' '}
              <span className="text-yellow-300">Brawl</span>
            </h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMute}
                className="bg-purple-600/20 border-purple-400 text-white hover:bg-purple-600/40"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </Button>
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
              Best: {highScore.toLocaleString()}
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
          
          {/* Game State Overlays */}
          {gameState === 'menu' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="text-center text-white p-6">
                <h2 className="text-3xl font-bold mb-4">
                  <span className="text-pink-300">Welcome to</span><br />
                  <span className="text-cyan-300">Butterfly Nebula Brawl</span>
                </h2>
                <p className="text-gray-300 mb-6">
                  Navigate your butterfly through the cosmic nebula.<br />
                  Avoid obstacles, collect power-ups, and survive!
                </p>
                <div className="space-y-2 text-sm text-gray-400 mb-6">
                  <p>🦋 Tap and drag to move your butterfly</p>
                  <p>⚡ Collect power-ups for special abilities</p>
                  <p>💥 Avoid asteroids and hostile insects</p>
                  <p>👑 Defeat the final boss on level 15</p>
                </div>
                <Button
                  onClick={() => gameEngineRef.current?.startGame()}
                  className="bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 text-white font-bold py-3 px-8 rounded-full"
                >
                  Start Game
                </Button>
              </div>
            </div>
          )}
          
          {gameState === 'paused' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-4">Game Paused</h3>
                <Button
                  onClick={togglePause}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full"
                >
                  Resume Game
                </Button>
              </div>
            </div>
          )}
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

        {/* Social Sharing */}
        {(gameState === 'gameOver' || gameState === 'gameComplete') && score > 0 && (
          <Card className="mt-4 p-4 bg-black/30 backdrop-blur-sm border-purple-500/50">
            <div className="text-center">
              <h3 className="text-white font-bold mb-2">Share Your Score!</h3>
              <Button
                onClick={shareScore}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-6 rounded-full"
              >
                Share Score: {score.toLocaleString()}
              </Button>
            </div>
          </Card>
        )}

        {/* Developer Credits */}
        <div className="mt-6 text-center text-gray-400 text-xs">
          <p>Butterfly Nebula Brawl v1.0</p>
          <p>Built with React & HTML5 Canvas</p>
        </div>
      </div>
    </div>
  );
};

export default Game;