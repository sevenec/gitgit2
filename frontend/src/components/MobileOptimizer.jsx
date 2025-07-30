import React, { useEffect } from 'react';

// Mobile optimization utilities
export const MobileOptimizer = {
  // Ensure 60 FPS performance
  optimizePerformance: () => {
    // Disable text selection on game elements
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    
    // Prevent zoom and scroll behaviors
    document.body.style.touchAction = 'pan-x pan-y';
    document.body.style.overscrollBehavior = 'contain';
    
    // Optimize for mobile rendering
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
    }
    
    // Enable hardware acceleration
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.transform = 'translateZ(0)';
      canvas.style.backfaceVisibility = 'hidden';
      canvas.style.webkitBackfaceVisibility = 'hidden';
    }
  },
  
  // Battery optimization
  optimizeBattery: () => {
    // Reduce background processing when app loses focus
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Pause non-essential animations
        if (window.gameEngineRef?.current) {
          window.gameEngineRef.current.gameState = 'paused';
        }
        // Reduce audio processing
        if (window.AudioManager) {
          window.AudioManager.setMasterVolume(0.1);
        }
      } else {
        // Resume when app gains focus
        if (window.AudioManager) {
          window.AudioManager.setMasterVolume(0.7);
        }
      }
    });
    
    // Optimize canvas rendering
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Use efficient rendering settings
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'medium';
      }
    }
  },
  
  // Touch control optimization
  optimizeTouchControls: () => {
    // Prevent default touch behaviors
    document.addEventListener('touchstart', (e) => {
      if (e.target.closest('canvas, button')) {
        e.preventDefault();
      }
    }, { passive: false });
    
    document.addEventListener('touchmove', (e) => {
      if (e.target.closest('canvas')) {
        e.preventDefault();
      }
    }, { passive: false });
    
    document.addEventListener('touchend', (e) => {
      if (e.target.closest('canvas')) {
        e.preventDefault();
      }
    }, { passive: false });
    
    // Optimize touch response
    document.addEventListener('touchstart', () => {
      // Resume audio context on first touch (browser requirement)
      if (window.AudioManager) {
        window.AudioManager.resumeAudioContext();
      }
    }, { once: true });
  },
  
  // Device-specific optimizations
  detectAndOptimize: () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const memory = navigator.deviceMemory || 4; // Default to 4GB if unknown
    
    // Optimize based on device capabilities
    if (memory < 2) {
      // Low memory device optimizations
      console.log('🔧 Applying low-memory optimizations');
      
      // Reduce particle effects
      if (window.gameEngineRef?.current) {
        window.gameEngineRef.current.maxParticles = 20;
      }
      
      // Lower audio quality
      if (window.AudioManager) {
        window.AudioManager.setAudioQuality('low');
      }
    } else if (memory >= 4) {
      // High memory device - enable premium effects
      console.log('🚀 Enabling premium visual effects');
      
      if (window.gameEngineRef?.current) {
        window.gameEngineRef.current.maxParticles = 100;
        window.gameEngineRef.current.enablePremiumEffects = true;
      }
    }
    
    // iOS-specific optimizations
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      document.body.style.webkitTouchCallout = 'none';
      document.body.style.webkitUserSelect = 'none';
    }
    
    // Android-specific optimizations  
    if (userAgent.includes('android')) {
      // Enable hardware acceleration for Android
      document.body.style.transform = 'translateZ(0)';
    }
  }
};

// React component for mobile optimization
const MobileOptimizerComponent = () => {
  useEffect(() => {
    // Apply all optimizations on mount
    MobileOptimizer.optimizePerformance();
    MobileOptimizer.optimizeBattery();
    MobileOptimizer.optimizeTouchControls();
    MobileOptimizer.detectAndOptimize();
    
    console.log('📱 Mobile optimizations applied successfully');
    
    // Performance monitoring
    const performanceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'measure') {
          console.log(`⚡ Performance: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
        }
      });
    });
    
    if (typeof PerformanceObserver !== 'undefined') {
      performanceObserver.observe({ entryTypes: ['measure'] });
    }
    
    return () => {
      if (typeof PerformanceObserver !== 'undefined') {
        performanceObserver.disconnect();
      }
    };
  }, []);
  
  return null; // This component only applies optimizations
};

export default MobileOptimizerComponent;