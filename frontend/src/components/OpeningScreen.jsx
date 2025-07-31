import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, Play, Settings, Trophy, Calendar, Volume2, VolumeX, ArrowRight, Zap, Shield, Heart, Target } from 'lucide-react';

const OpeningScreen = ({ onStartGame, onShowTutorial, onOpenFluttererSelector, onOpenSettings, audioManager, user, gameStats }) => {
  const [showParticles, setShowParticles] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showDailyChallenges, setShowDailyChallenges] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const gameTips = [
    { icon: Target, text: "Tap and drag to guide your butterfly through the cosmic nebula", color: "text-cyan-300" },
    { icon: Zap, text: "Collect glowing power-ups for speed boosts, shields, and blasters", color: "text-yellow-300" },
    { icon: Shield, text: "Avoid red insects and brown asteroids - they'll damage your butterfly", color: "text-red-300" },
    { icon: Heart, text: "Survive 45-60 seconds per level to advance through 15 cosmic zones", color: "text-pink-300" },
    { icon: Star, text: "Face the epic Mother Insect boss on level 15 for ultimate victory!", color: "text-purple-300" }
  ];

  useEffect(() => {
    // Cycle through tips every 3 seconds
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % gameTips.length);
    }, 3000);

    // 🎵 START INTRO MUSIC when app opens (with proper null checks)
    if (audioManager) {
      console.log('🎵 Starting intro music on app open - OpeningScreen');
      audioManager.playIntroMusic();
    } else {
      console.warn('⚠️ AudioManager not ready yet - will retry intro music');
      // Retry after AudioManager is ready
      const retryIntroMusic = () => {
        if (window.audioManager) {
          console.log('🎵 Starting intro music on retry - OpeningScreen');
          window.audioManager.playIntroMusic();
        } else {
          setTimeout(retryIntroMusic, 500); // Retry every 500ms
        }
      };
      setTimeout(retryIntroMusic, 1000); // Wait 1 second then start retrying
    }

    return () => {
      clearInterval(tipInterval);
    };
  }, [audioManager]);

  const handleStartAdventure = () => {
    if (audioManager) {
      audioManager.playSound('button_click');
      audioManager.resumeAudioContext(); // Ensure audio context is active
      
      // Intro music is already playing from app open
      console.log('🎵 START ADVENTURE clicked - intro music already playing');
    }
    onStartGame();
  };

  const toggleMute = () => {
    if (audioManager) {
      const newMuteState = audioManager.toggleMute();
      setIsMuted(newMuteState);
      console.log(`🔊 Audio ${newMuteState ? 'muted' : 'unmuted'} from opening screen`);
    }
  };

  const handleDailyChallenges = () => {
    if (audioManager) {
      audioManager.playSound('sparkles', { volume: 0.5 });
    }
    setShowDailyChallenges(true);
    console.log('📅 Daily Challenges opened');
  };

  const handleLeaderboard = () => {
    if (audioManager) {
      audioManager.playSound('sparkles', { volume: 0.5 });
    }
    setShowLeaderboard(true);
    console.log('🏆 Leaderboard opened');
  };

  const handleFlutterers = () => {
    if (audioManager) {
      audioManager.playSound('sparkles', { volume: 0.5 });
    }
    if (onOpenFluttererSelector) {
      onOpenFluttererSelector();
    } else {
      console.log('🦋 Flutterer selector not available');
    }
  };

  const currentTipData = gameTips[currentTip];
  const TipIcon = currentTipData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 via-pink-900 to-orange-900 relative overflow-hidden">
      {/* Music Status Indicator */}
      <div className="fixed top-4 right-4 text-white/80 text-sm flex items-center gap-2 z-50">
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        <span>🎵 Click anywhere to start music</span>
      </div>
      
      {/* Simplified Background */}
      <div className="absolute inset-0">
        {/* Simple Stars */}
        {showParticles && (
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              >
                <div className="w-1 h-1 bg-white rounded-full opacity-60" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        
        {/* Game Logo & Title */}
        <div className="text-center mb-8 animate-fade-in">
          {/* Animated Butterfly Logo */}
          <div className="mb-6 relative">
            <div className="animate-float">
              <div className="w-24 h-24 mx-auto relative">
                {/* Butterfly wings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Upper wings */}
                    <div className="absolute -top-6 -left-8 w-6 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-80 animate-pulse" style={{animationDuration: '2s'}} />
                    <div className="absolute -top-6 -right-8 w-6 h-10 bg-gradient-to-bl from-pink-400 to-purple-500 rounded-full opacity-80 animate-pulse" style={{animationDuration: '2s', animationDelay: '0.1s'}} />
                    {/* Lower wings */}
                    <div className="absolute -bottom-2 -left-6 w-5 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-70 animate-pulse" style={{animationDuration: '2s', animationDelay: '0.2s'}} />
                    <div className="absolute -bottom-2 -right-6 w-5 h-8 bg-gradient-to-bl from-cyan-400 to-blue-500 rounded-full opacity-70 animate-pulse" style={{animationDuration: '2s', animationDelay: '0.3s'}} />
                    {/* Body */}
                    <div className="w-1 h-12 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full mx-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Game Title */}
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-cyan-300 to-yellow-300 mb-4 animate-glow">
            BUTTERFLY
          </h1>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 mb-2">
            NEBULA BRAWL
          </h2>
          <p className="text-xl text-gray-300 font-medium">
            Epic Cosmic Adventure
          </p>
        </div>

        {/* Dynamic Game Tips */}
        <Card className="mb-8 p-6 bg-black/40 backdrop-blur-lg border-purple-500/50 max-w-lg">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 ${currentTipData.color}`}>
              <TipIcon size={24} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${currentTipData.color} animate-fade-in`}>
                {currentTipData.text}
              </p>
            </div>
          </div>
          
          {/* Tip Progress Dots */}
          <div className="flex justify-center space-x-2 mt-4">
            {gameTips.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentTip ? 'bg-cyan-400 scale-125' : 'bg-gray-500'
                }`}
              />
            ))}
          </div>
        </Card>

        {/* Main Action Buttons */}
        <div className="space-y-4 w-full max-w-md">
          <Button
            onClick={handleStartAdventure}
            className="premium-button premium-pulse-glow w-full py-4 text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            <Play className="mr-3" size={24} /> 
            START ADVENTURE
          </Button>

          {/* Secondary Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onShowTutorial}
              variant="outline"
              className="premium-button py-3 bg-blue-600/20 border-blue-400 text-blue-200 hover:bg-blue-600/40 rounded-full"
            >
              <ArrowRight className="mr-2" size={18} />
              Tutorial
            </Button>
            
            <Button
              onClick={handleFlutterers}
              variant="outline"
              className="py-3 bg-purple-600/20 border-purple-400 text-purple-200 hover:bg-purple-600/40 rounded-full"
            >
              <Star className="mr-2" size={18} />
              Flutterers
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={handleDailyChallenges}
              variant="outline"
              size="sm"
              className="py-2 bg-green-600/20 border-green-400 text-green-200 hover:bg-green-600/40 rounded-full"
            >
              <Calendar size={16} className="mr-1" />
              Daily
            </Button>
            
            <Button
              onClick={handleLeaderboard}
              variant="outline"
              size="sm"
              className="py-2 bg-yellow-600/20 border-yellow-400 text-yellow-200 hover:bg-yellow-600/40 rounded-full"
            >
              <Trophy size={16} className="mr-1" />
              Ranks
            </Button>
            
            <Button
              onClick={toggleMute}
              variant="outline"
              size="sm"
              className="py-2 bg-gray-600/20 border-gray-400 text-gray-200 hover:bg-gray-600/40 rounded-full"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </Button>
          </div>
        </div>

        {/* Version & Credits */}
        <div className="mt-8 text-center text-gray-400 text-sm space-y-1">
          <p>Butterfly Nebula Brawl v1.0</p>
          <p>Epic space adventure • Collect • Battle • Survive</p>
        </div>
      </div>

      {/* Daily Challenges Modal */}
      {showDailyChallenges && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <Card className="bg-gradient-to-br from-green-900/90 to-emerald-800/90 border-green-400 p-6 max-w-md mx-4 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-green-200 mb-4 flex items-center">
              <Calendar className="mr-2" size={24} />
              Daily Challenges
            </h2>
            <div className="space-y-3 text-green-100">
              <div className="flex items-center justify-between p-3 bg-green-800/30 rounded-lg">
                <span>Complete Level 3</span>
                <Badge className="bg-green-600">50 Coins</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-800/30 rounded-lg">
                <span>Collect 10 Power-ups</span>
                <Badge className="bg-green-600">30 Coins</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-800/30 rounded-lg">
                <span>Survive 5 Minutes</span>
                <Badge className="bg-green-600">100 Coins</Badge>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-green-200 text-sm mb-3">Play more to unlock daily challenges!</p>
              <Button
                onClick={() => setShowDailyChallenges(false)}
                className="bg-green-600 hover:bg-green-700"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <Card className="bg-gradient-to-br from-yellow-900/90 to-amber-800/90 border-yellow-400 p-6 max-w-md mx-4 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-yellow-200 mb-4 flex items-center">
              <Trophy className="mr-2" size={24} />
              Cosmic Ranks
            </h2>
            <div className="space-y-2 text-yellow-100">
              <div className="flex items-center justify-between p-3 bg-yellow-800/30 rounded-lg">
                <div className="flex items-center">
                  <span className="text-yellow-400 font-bold mr-2">1.</span>
                  <span>CosmicPilot</span>
                </div>
                <span className="text-yellow-200">245,750</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-800/30 rounded-lg">
                <div className="flex items-center">
                  <span className="text-gray-300 font-bold mr-2">2.</span>
                  <span>StarNavigator</span>
                </div>
                <span className="text-yellow-200">198,230</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-800/30 rounded-lg">
                <div className="flex items-center">
                  <span className="text-amber-600 font-bold mr-2">3.</span>
                  <span>NebulaExplorer</span>
                </div>
                <span className="text-yellow-200">156,890</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-800/20 rounded-lg border border-yellow-500">
                <div className="flex items-center">
                  <span className="text-yellow-300 font-bold mr-2">--</span>
                  <span>You</span>
                </div>
                <span className="text-yellow-200">{gameStats?.highScore || 0}</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-yellow-200 text-sm mb-3">Play more to climb the cosmic ranks!</p>
              <Button
                onClick={() => setShowLeaderboard(false)}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 20px rgba(147, 51, 234, 0.5); }
          50% { text-shadow: 0 0 30px rgba(147, 51, 234, 0.8), 0 0 40px rgba(219, 39, 119, 0.3); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 4px 20px rgba(147, 51, 234, 0.3); }
          50% { box-shadow: 0 4px 30px rgba(147, 51, 234, 0.6), 0 0 20px rgba(219, 39, 119, 0.3); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default OpeningScreen;