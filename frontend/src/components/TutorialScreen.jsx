import React, { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight, Target, Zap, Shield, Heart, Star, Crown } from 'lucide-react';

const TutorialScreen = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [butterflyPosition, setButterflyPosition] = useState({ x: 50, y: 50 });
  const [isInteracting, setIsInteracting] = useState(false);
  const demoAreaRef = useRef(null);

  // Interactive demo handlers
  const handleDemoInteraction = (e) => {
    if (!demoAreaRef.current) return;
    
    const rect = demoAreaRef.current.getBoundingClientRect();
    const x = ((e.clientX || e.touches?.[0]?.clientX || 0) - rect.left) / rect.width * 100;
    const y = ((e.clientY || e.touches?.[0]?.clientY || 0) - rect.top) / rect.height * 100;
    
    setButterflyPosition({
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y))
    });
    setIsInteracting(true);
  };

  const handleDemoStart = (e) => {
    e.preventDefault();
    setIsInteracting(true);
    handleDemoInteraction(e);
  };

  const handleDemoEnd = () => {
    setIsInteracting(false);
  };

  const handleDemoMove = (e) => {
    if (isInteracting) {
      e.preventDefault();
      handleDemoInteraction(e);
    }
  };

  const tutorialSteps = [
    {
      title: "Welcome to the Nebula!",
      icon: Star,
      content: "Guide your magical butterfly through the vast cosmic nebula filled with wonders and dangers.",
      visual: "butterfly_intro",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Movement Controls",
      icon: Target,
      content: "Tap and drag anywhere on the screen to move your butterfly. Your butterfly will smoothly follow your finger or mouse.",
      visual: "movement_demo",
      color: "from-cyan-500 to-blue-500",
      interactive: true
    },
    {
      title: "Avoid Obstacles",
      icon: Shield,
      content: "Navigate through cosmic hazards that change with each level: crystalline shards, energy spirals, solar flares, and more! Each level brings unique obstacles.",
      visual: "obstacles_demo",
      color: "from-red-500 to-orange-500"
    },
    {
      title: "Collect Power-ups",
      icon: Zap,
      content: "Grab glowing power-ups for amazing abilities: Speed boosts, protective shields, energy blasters, and health restoration!",
      visual: "powerups_demo",
      color: "from-green-500 to-yellow-500"
    },
    {
      title: "Blaster Controls",
      icon: Target,
      content: "When you have the Blaster power-up, tap/click anywhere on the screen to shoot projectiles and destroy obstacles!",
      visual: "blaster_demo",
      color: "from-yellow-500 to-orange-500"
    },
    {
      title: "Level Progression",
      icon: Heart,
      content: "Survive 45-60 seconds per level to advance. Each level gets more challenging with faster obstacles and new backgrounds!",
      visual: "levels_demo",
      color: "from-indigo-500 to-purple-500"
    },
    {
      title: "Epic Boss Battle",
      icon: Crown,
      content: "Face the mighty Mother Insect on level 15! She has three phases of attacks - projectiles, swarms, and devastating rage beams!",
      visual: "boss_demo",
      color: "from-purple-600 to-pink-600"
    }
  ];

  const currentStepData = tutorialSteps[currentStep];
  const StepIcon = currentStepData.icon;

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderVisual = (visualType) => {
    switch (visualType) {
      case 'butterfly_intro':
        return (
          <div className="flex justify-center items-center h-40">
            <div className="relative animate-float">
              {/* Animated butterfly */}
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Wings */}
                    <div className="absolute -top-4 -left-6 w-5 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-80 animate-pulse" />
                    <div className="absolute -top-4 -right-6 w-5 h-8 bg-gradient-to-bl from-pink-400 to-purple-500 rounded-full opacity-80 animate-pulse" />
                    <div className="absolute -bottom-1 -left-4 w-4 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-70 animate-pulse" />
                    <div className="absolute -bottom-1 -right-4 w-4 h-6 bg-gradient-to-bl from-cyan-400 to-blue-500 rounded-full opacity-70 animate-pulse" />
                    {/* Body */}
                    <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full mx-auto" />
                  </div>
                </div>
              </div>
              {/* Sparkle trail */}
              <div className="absolute -top-2 -left-2 w-2 h-2 bg-yellow-300 rounded-full animate-ping" />
              <div className="absolute -bottom-2 -right-2 w-1 h-1 bg-cyan-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}} />
            </div>
          </div>
        );
      
      case 'movement_demo':
        return (
          <div 
            ref={demoAreaRef}
            className="h-40 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg relative overflow-hidden cursor-pointer select-none"
            onMouseDown={handleDemoStart}
            onMouseMove={handleDemoMove}
            onMouseUp={handleDemoEnd}
            onMouseLeave={handleDemoEnd}
            onTouchStart={handleDemoStart}
            onTouchMove={handleDemoMove}
            onTouchEnd={handleDemoEnd}
            style={{ touchAction: 'none' }}
          >
            {/* Interactive butterfly */}
            <div 
              className="absolute w-8 h-8 transition-all duration-200 ease-out z-10"
              style={{
                left: `${butterflyPosition.x}%`,
                top: `${butterflyPosition.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              🦋
            </div>
            
            {/* Instructions */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-white/80">
                {!isInteracting && (
                  <>
                    <div className="mb-2">👆</div>
                    <p className="text-sm">Click/tap and drag to move the butterfly!</p>
                  </>
                )}
                {isInteracting && (
                  <p className="text-sm text-green-300">Great! Keep moving around!</p>
                )}
              </div>
            </div>
            
            {/* Animated trail effect */}
            <div 
              className="absolute w-2 h-2 bg-pink-400/60 rounded-full transition-all duration-500"
              style={{
                left: `${butterflyPosition.x}%`,
                top: `${butterflyPosition.y}%`,
                transform: 'translate(-50%, -50%) scale(2)',
                opacity: isInteracting ? 0.8 : 0.3
              }}
            />
          </div>
        );
      
      case 'obstacles_demo':
        return (
          <div className="h-40 bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-lg relative overflow-hidden flex items-center justify-center space-x-8">
            {/* Red insect */}
            <div className="relative">
              <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse" />
              <div className="absolute top-1 left-1 w-2 h-2 bg-red-700 rounded-full" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-700 rounded-full" />
              <p className="text-xs text-red-300 mt-2 text-center">Red Insect</p>
            </div>
            
            {/* Brown asteroid */}
            <div className="relative">
              <div className="w-10 h-10 bg-amber-700 rounded-full animate-spin" style={{animationDuration: '3s'}}>
                <div className="absolute inset-1 bg-amber-600 rounded-full" />
                <div className="absolute top-2 left-2 w-2 h-2 bg-amber-800 rounded-full" />
              </div>
              <p className="text-xs text-amber-300 mt-2 text-center">Asteroid</p>
            </div>
          </div>
        );
      
      case 'powerups_demo':
        return (
          <div className="h-40 rounded-lg relative overflow-hidden">
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Speed boost */}
              <div className="flex flex-col items-center justify-center bg-green-900/20 rounded-lg">
                <div className="w-6 h-6 bg-green-400 rounded-full animate-pulse mb-2 relative">
                  <Zap size={12} className="absolute inset-0 m-auto text-white" />
                </div>
                <p className="text-xs text-green-300">Speed</p>
              </div>
              
              {/* Shield */}
              <div className="flex flex-col items-center justify-center bg-cyan-900/20 rounded-lg">
                <div className="w-6 h-6 bg-cyan-400 rounded-full animate-pulse mb-2 relative">
                  <Shield size={12} className="absolute inset-0 m-auto text-white" />
                </div>
                <p className="text-xs text-cyan-300">Shield</p>
              </div>
              
              {/* Blaster */}
              <div className="flex flex-col items-center justify-center bg-orange-900/20 rounded-lg">
                <div className="w-6 h-6 bg-orange-400 rounded-full animate-pulse mb-2 relative">
                  <Star size={12} className="absolute inset-0 m-auto text-white" />
                </div>
                <p className="text-xs text-orange-300">Blaster</p>
              </div>
              
              {/* Health */}
              <div className="flex flex-col items-center justify-center bg-pink-900/20 rounded-lg">
                <div className="w-6 h-6 bg-pink-400 rounded-full animate-pulse mb-2 relative">
                  <Heart size={12} className="absolute inset-0 m-auto text-white" />
                </div>
                <p className="text-xs text-pink-300">Health</p>
              </div>
            </div>
          </div>
        );
      
      case 'levels_demo':
        return (
          <div className="h-40 rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 gap-2 h-full">
              <div className="bg-gradient-to-b from-blue-800 to-purple-800 rounded flex items-center justify-center">
                <span className="text-white font-bold">1-5</span>
              </div>
              <div className="bg-gradient-to-b from-purple-800 to-pink-800 rounded flex items-center justify-center">
                <span className="text-white font-bold">6-10</span>
              </div>
              <div className="bg-gradient-to-b from-gray-900 to-black rounded flex items-center justify-center">
                <span className="text-white font-bold">11-15</span>
              </div>
            </div>
          </div>
        );
      
      case 'boss_demo':
        return (
          <div className="h-40 bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg relative overflow-hidden flex items-center justify-center">
            {/* Boss silhouette */}
            <div className="relative">
              <div className="w-20 h-16 bg-purple-600 rounded-full animate-pulse">
                {/* Boss eyes */}
                <div className="absolute top-2 left-3 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <div className="absolute top-2 right-3 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                {/* Tentacles */}
                <div className="absolute -top-1 -left-2 w-8 h-1 bg-purple-500 rounded-full rotate-45" />
                <div className="absolute -top-1 -right-2 w-8 h-1 bg-purple-500 rounded-full -rotate-45" />
                <div className="absolute -bottom-1 -left-2 w-8 h-1 bg-purple-500 rounded-full -rotate-45" />
                <div className="absolute -bottom-1 -right-2 w-8 h-1 bg-purple-500 rounded-full rotate-45" />
              </div>
              <p className="text-xs text-purple-300 mt-2 text-center">Mother Insect</p>
            </div>
            
            {/* Attack effects */}
            <div className="absolute top-4 left-4 w-2 h-2 bg-red-400 rounded-full animate-ping" />
            <div className="absolute bottom-4 right-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}} />
          </div>
        );
      
      case 'blaster_demo':
        return (
          <div className="h-40 bg-gradient-to-br from-yellow-900 to-orange-900 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="mb-2">🎯</div>
                <p className="text-sm">With Blaster power-up: Tap/Click to shoot!</p>
                <div className="mt-4 flex items-center justify-center space-x-4">
                  {/* Butterfly with blaster */}
                  <div className="relative">
                    <div className="text-2xl">🦋</div>
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                  </div>
                  {/* Projectile animation */}
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse" />
                    <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}} />
                    <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}} />
                  </div>
                  {/* Target obstacle */}
                  <div className="relative">
                    <div className="w-6 h-6 bg-red-500 rounded-full opacity-70" />
                    <div className="absolute inset-0 w-6 h-6 bg-yellow-400 rounded-full animate-ping opacity-30" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div className="h-40 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">Visual Demo</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-black/40 backdrop-blur-lg border-purple-500/50 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${currentStepData.color} mb-4`}>
            <StepIcon size={28} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{currentStepData.title}</h2>
          <p className="text-gray-300 text-lg leading-relaxed">{currentStepData.content}</p>
        </div>

        {/* Visual Demo */}
        <div className="mb-8">
          {renderVisual(currentStepData.visual)}
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-purple-400 scale-125' 
                    : index < currentStep 
                      ? 'bg-green-400' 
                      : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outline"
            className="bg-gray-600/20 border-gray-400 text-gray-200 hover:bg-gray-600/40 disabled:opacity-50"
          >
            <ArrowLeft size={18} className="mr-2" />
            Previous
          </Button>

          <div className="flex space-x-3">
            <Button
              onClick={onSkip}
              variant="outline"
              className="bg-yellow-600/20 border-yellow-400 text-yellow-200 hover:bg-yellow-600/40"
            >
              Skip Tutorial
            </Button>
            
            <Button
              onClick={nextStep}
              className={`bg-gradient-to-r ${currentStepData.color} hover:opacity-90 text-white font-bold`}
            >
              {currentStep === tutorialSteps.length - 1 ? (
                <>Ready to Play! <Star size={18} className="ml-2" /></>
              ) : (
                <>Next <ArrowRight size={18} className="ml-2" /></>
              )}
            </Button>
          </div>
        </div>

        {/* Step Counter */}
        <div className="text-center mt-6">
          <span className="text-gray-400 text-sm">
            Step {currentStep + 1} of {tutorialSteps.length}
          </span>
        </div>
      </Card>
    </div>
  );
};

export default TutorialScreen;