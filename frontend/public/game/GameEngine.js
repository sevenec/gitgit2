window.GameEngine = class GameEngine {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.gameState = 'menu'; // menu, playing, paused, gameOver, levelComplete, bossIntro
    this.currentLevel = 1;
    this.maxLevel = 15;
    this.score = 0;
    this.lives = 3;
    this.gameTime = 0;
    this.levelTime = 0;
    this.levelDuration = 45000; // 45 seconds per level
    
    // Game objects
    this.player = null;
    this.obstacles = [];
    this.powerUps = [];
    this.particles = [];
    this.projectiles = [];
    this.background = null;
    
    // Game mechanics
    this.gameSpeed = 2;
    this.obstacleSpawnRate = 0.02;
    this.powerUpSpawnRate = 0.005;
    
    // Touch controls - will be replaced by MobileInputHandler
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.isTouching = false;
    
    // Boss fight
    this.boss = null;
    this.isBossLevel = false;
    this.bossPhase = 1;
    this.bossIntroTimer = 0;
    
    // Character system
    this.selectedFlutterer = null;
    this.gameStats = {
      highScore: parseInt(localStorage.getItem('butterflyHighScore') || '0'),
      maxLevel: parseInt(localStorage.getItem('butterflyMaxLevel') || '1'),
      enemiesDefeated: parseInt(localStorage.getItem('butterflyEnemiesDefeated') || '0'),
      totalSurvivalTime: parseInt(localStorage.getItem('butterflySurvivalTime') || '0'),
      bossDefeats: parseInt(localStorage.getItem('butterflyBossDefeats') || '0')
    };
    
    // Enhanced effects systems
    this.backgroundEffects = [];
    this.specialEffects = [];
    
    // Visual & Mobile Enhancement Systems
    this.particleSystem = null;
    this.screenEffects = null;
    this.mobileInput = null;
    this.performanceOptimized = false;
    
    // Performance monitoring
    this.frameCount = 0;
    this.fps = 60;
    this.lastFpsCheck = performance.now();
    
    this.initializeEnhancedSystems();
    this.setupEventListeners();
    this.initializeDefaultFlutterer();
  }
  
  // Initialize enhanced visual and mobile systems
  async initializeEnhancedSystems() {
    try {
      // Import and initialize enhanced systems dynamically
      if (typeof window !== 'undefined') {
        // Initialize systems using window global for GameEngine compatibility
        this.initializeParticleSystem();
        this.initializeScreenEffects();
        this.initializeMobileInput();
        this.optimizeForDevice();
        
        console.log('🎮 Enhanced visual and mobile systems initialized');
      }
    } catch (error) {
      console.warn('Could not initialize enhanced systems, using basic fallbacks:', error);
      this.useBasicSystems();
    }
  }
  
  initializeParticleSystem() {
    // Simple particle system for GameEngine
    this.particleSystem = {
      particles: [],
      maxParticles: 300,
      
      createExplosion: (x, y, color = '#ff6b6b', count = 12) => {
        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count;
          const speed = 2 + Math.random() * 3;
          this.particleSystem.particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 2 + Math.random() * 3,
            color, life: 1.0, decay: 0.02,
            type: 'explosion'
          });
        }
      },
      
      createSparkles: (x, y, color = '#ffd700', count = 15) => {
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1 + Math.random() * 2;
          this.particleSystem.particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 1 + Math.random() * 2,
            color, life: 1.0, decay: 0.015,
            type: 'sparkle'
          });
        }
      },
      
      createButterflyTrail: (x, y, color = '#ff69b4') => {
        if (Math.random() < 0.4) {
          this.particleSystem.particles.push({
            x: x + (Math.random() - 0.5) * 8,
            y: y + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 0.5,
            vy: 0.5,
            size: 1 + Math.random(),
            color, life: 1.0, decay: 0.01,
            type: 'trail'
          });
        }
      },
      
      update: () => {
        for (let i = this.particleSystem.particles.length - 1; i >= 0; i--) {
          const p = this.particleSystem.particles[i];
          p.x += p.vx; p.y += p.vy; p.life -= p.decay;
          
          if (p.type === 'trail') { p.vy += 0.05; p.vx *= 0.98; }
          else if (p.type === 'explosion') { p.vy += 0.05; p.vx *= 0.95; }
          
          if (p.life <= 0) this.particleSystem.particles.splice(i, 1);
        }
        
        if (this.particleSystem.particles.length > this.particleSystem.maxParticles) {
          this.particleSystem.particles.splice(0, this.particleSystem.particles.length - this.particleSystem.maxParticles);
        }
      },
      
      render: (ctx) => {
        ctx.save();
        for (const p of this.particleSystem.particles) {
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    };
  }
  
  initializeScreenEffects() {
    this.screenEffects = {
      shakeIntensity: 0, shakeDuration: 0, shakeX: 0, shakeY: 0,
      flashAlpha: 0, flashColor: '#ffffff', flashDecay: 0,
      tintAlpha: 0, tintColor: '#ff0000', tintDecay: 0,
      
      shake: (intensity = 5, duration = 300) => {
        this.screenEffects.shakeIntensity = Math.min(intensity, 8);
        this.screenEffects.shakeDuration = duration;
      },
      
      flash: (color = '#ffffff', intensity = 0.3, duration = 150) => {
        this.screenEffects.flashColor = color;
        this.screenEffects.flashAlpha = Math.min(intensity, 1);
        this.screenEffects.flashDecay = this.screenEffects.flashAlpha / (duration / 16.67);
      },
      
      hitEffect: () => {
        this.screenEffects.shake(3, 200);
        this.screenEffects.flash('#ff4444', 0.2, 100);
      },
      
      powerUpEffect: () => {
        this.screenEffects.shake(2, 150);
        this.screenEffects.flash('#ffd700', 0.3, 200);
      },
      
      update: (deltaTime = 16.67) => {
        if (this.screenEffects.shakeDuration > 0) {
          this.screenEffects.shakeDuration -= deltaTime;
          const progress = Math.max(0, this.screenEffects.shakeDuration / 300);
          const intensity = this.screenEffects.shakeIntensity * progress;
          this.screenEffects.shakeX = (Math.random() - 0.5) * intensity * 2;
          this.screenEffects.shakeY = (Math.random() - 0.5) * intensity * 2;
          
          if (this.screenEffects.shakeDuration <= 0) {
            this.screenEffects.shakeIntensity = 0;
            this.screenEffects.shakeX = 0; this.screenEffects.shakeY = 0;
          }
        }
        
        if (this.screenEffects.flashAlpha > 0) {
          this.screenEffects.flashAlpha = Math.max(0, this.screenEffects.flashAlpha - this.screenEffects.flashDecay);
        }
      },
      
      applyShake: (ctx) => {
        if (this.screenEffects.shakeIntensity > 0) {
          ctx.translate(this.screenEffects.shakeX, this.screenEffects.shakeY);
        }
      },
      
      renderEffects: (ctx, canvas) => {
        if (this.screenEffects.flashAlpha > 0) {
          ctx.save();
          ctx.globalAlpha = this.screenEffects.flashAlpha;
          ctx.fillStyle = this.screenEffects.flashColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.restore();
        }
      }
    };
  }
  
  initializeMobileInput() {
    this.mobileInput = {
      isTouch: 'ontouchstart' in window,
      touches: new Map(),
      smoothedInput: { x: 0, y: 0 },
      inputHistory: [],
      touchIndicator: { x: 0, y: 0, visible: false, size: 0, alpha: 0 },
      
      getInput: () => {
        if (this.mobileInput.touches.size === 0) return null;
        return { x: this.mobileInput.smoothedInput.x, y: this.mobileInput.smoothedInput.y };
      },
      
      isActive: () => this.mobileInput.touches.size > 0,
      
      updateSmoothedInput: (rawX, rawY) => {
        this.mobileInput.inputHistory.push({ x: rawX, y: rawY });
        if (this.mobileInput.inputHistory.length > 5) this.mobileInput.inputHistory.shift();
        
        let avgX = 0, avgY = 0;
        for (const input of this.mobileInput.inputHistory) {
          avgX += input.x; avgY += input.y;
        }
        this.mobileInput.smoothedInput.x = avgX / this.mobileInput.inputHistory.length;
        this.mobileInput.smoothedInput.y = avgY / this.mobileInput.inputHistory.length;
      },
      
      renderTouchIndicator: (ctx) => {
        if (!this.mobileInput.touchIndicator.visible || this.mobileInput.touchIndicator.alpha <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.mobileInput.touchIndicator.alpha * 0.3;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.mobileInput.touchIndicator.x, this.mobileInput.touchIndicator.y, 30, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    };
  }
  
  optimizeForDevice() {
    // Detect device capabilities and optimize accordingly
    const userAgent = navigator.userAgent;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
    const isLowEnd = /Android.*Chrome.*[1-4]\d\.|iPhone|iPad.*OS [1-9]_/.test(userAgent);
    
    if (isMobile || isLowEnd) {
      this.performanceOptimized = true;
      this.particleSystem.maxParticles = 150; // Reduce particles on mobile
      console.log('🔧 Mobile performance optimizations applied');
    }
  }
  
  useBasicSystems() {
    // Fallback to basic systems if enhanced ones fail
    this.particleSystem = { 
      createExplosion: () => {}, createSparkles: () => {}, createButterflyTrail: () => {},
      update: () => {}, render: () => {} 
    };
    this.screenEffects = { 
      shake: () => {}, flash: () => {}, hitEffect: () => {}, powerUpEffect: () => {},
      update: () => {}, applyShake: () => {}, renderEffects: () => {} 
    };
    this.mobileInput = { 
      getInput: () => null, isActive: () => false, renderTouchIndicator: () => {} 
    };
  }
  
  
  initializeDefaultFlutterer() {
    // Set default flutterer (Basic Cosmic Flutter)
    this.selectedFlutterer = {
      id: 'basic_cosmic',
      name: 'Basic Cosmic Flutter',
      skills: { speed: 1.0, health: 100, special: null },
      colors: {
        body: '#8B4513',
        wing1: '#FF6B9D', 
        wing2: '#FF8FA3',
        accent: '#FFFFFF'
      }
    };
  }
  
  setSelectedFlutterer(flutterer) {
    this.selectedFlutterer = flutterer;
    if (this.player) {
      // Update player stats based on flutterer
      this.player.maxHealth = flutterer.skills.health;
      this.player.health = Math.min(this.player.health, this.player.maxHealth);
      this.player.baseSpeed = 8 * flutterer.skills.speed;
    }
  }
  
  setupEventListeners() {
    // Enhanced touch events for mobile with smoothing
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const x = (touch.clientX - rect.left) * (this.canvas.width / rect.width);
      const y = (touch.clientY - rect.top) * (this.canvas.height / rect.height);
      
      // Update enhanced mobile input
      this.mobileInput.touches.set(touch.identifier, { x, y });
      this.mobileInput.touchIndicator = { x, y, visible: true, size: 0, alpha: 1 };
      this.mobileInput.updateSmoothedInput(x, y);
      
      // Legacy support
      this.touchStartX = x;
      this.touchStartY = y;
      this.isTouching = true;
      
      if (this.gameState === 'menu' || this.gameState === 'gameOver') {
        this.startGame();
      }
    });
    
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (this.isTouching && this.player && this.gameState === 'playing') {
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = (touch.clientX - rect.left) * (this.canvas.width / rect.width);
        const y = (touch.clientY - rect.top) * (this.canvas.height / rect.height);
        
        // Update enhanced mobile input with smoothing
        this.mobileInput.touches.set(touch.identifier, { x, y });
        this.mobileInput.touchIndicator = { x, y, visible: true, size: 30, alpha: 0.8 };
        this.mobileInput.updateSmoothedInput(x, y);
        
        // Use smoothed input for player movement
        const smoothedInput = this.mobileInput.getInput();
        if (smoothedInput) {
          this.player.targetX = smoothedInput.x;
          this.player.targetY = smoothedInput.y;
          
          // Create butterfly trail effect
          this.particleSystem.createButterflyTrail(
            this.player.x, this.player.y, 
            this.selectedFlutterer.colors.wing1
          );
        }
      }
    });
    
    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      
      // Clear enhanced mobile input
      for (const touch of e.changedTouches) {
        this.mobileInput.touches.delete(touch.identifier);
      }
      if (this.mobileInput.touches.size === 0) {
        this.mobileInput.touchIndicator.visible = false;
        this.mobileInput.touchIndicator.alpha = 0;
      }
      
      this.isTouching = false;
    });
    
    // Enhanced mouse events for desktop testing
    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
      
      // Update enhanced input
      this.mobileInput.touches.set('mouse', { x, y });
      this.mobileInput.touchIndicator = { x, y, visible: true, size: 0, alpha: 1 };
      this.mobileInput.updateSmoothedInput(x, y);
      
      // Legacy support
      this.touchStartX = x;
      this.touchStartY = y;
      this.isTouching = true;
      
      if (this.gameState === 'menu' || this.gameState === 'gameOver') {
        this.startGame();
      }
    });
    
    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isTouching && this.player && this.gameState === 'playing') {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        
        // Update enhanced input
        this.mobileInput.touches.set('mouse', { x, y });
        this.mobileInput.touchIndicator = { x, y, visible: true, size: 30, alpha: 0.8 };
        this.mobileInput.updateSmoothedInput(x, y);
        
        // Use smoothed input
        const smoothedInput = this.mobileInput.getInput();
        if (smoothedInput) {
          this.player.targetX = smoothedInput.x;
          this.player.targetY = smoothedInput.y;
          
          // Create butterfly trail effect
          this.particleSystem.createButterflyTrail(
            this.player.x, this.player.y, 
            this.selectedFlutterer.colors.wing1
          );
        }
      }
    });
    
    this.canvas.addEventListener('mouseup', () => {
      this.mobileInput.touches.delete('mouse');
      this.mobileInput.touchIndicator.visible = false;
      this.mobileInput.touchIndicator.alpha = 0;
      this.isTouching = false;
    });
    
    // Prevent context menu
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  
  startGame() {
    this.gameState = 'playing';
    this.currentLevel = 1;
    this.score = 0;
    this.lives = 3;
    this.gameTime = 0;
    this.levelTime = 0;
    this.initializeLevel();
  }
  
  initializeLevel() {
    this.obstacles = [];
    this.powerUps = [];
    this.particles = [];
    this.projectiles = [];
    this.specialEffects = [];
    this.backgroundEffects = [];
    this.levelTime = 0;
    this.isBossLevel = this.currentLevel === this.maxLevel;
    
    // Initialize player with flutterer stats
    const fluttererHealth = this.selectedFlutterer?.skills?.health || 100;
    const fluttererSpeed = this.selectedFlutterer?.skills?.speed || 1.0;
    
    this.player = {
      x: this.canvas.width / 2,
      y: this.canvas.height - 100,
      targetX: this.canvas.width / 2,
      targetY: this.canvas.height - 100,
      width: 40,
      height: 40,
      baseSpeed: 8 * fluttererSpeed,
      speed: 8 * fluttererSpeed,
      health: fluttererHealth,
      maxHealth: fluttererHealth,
      hasShield: false,
      shieldTime: 0,
      blasterMode: false,
      blasterTime: 0,
      blasterLevel: 0, // 0 = no blaster, 1 = single shot, 2 = dual shot, 3 = laser beam
      blasterCooldown: 0,
      lastShotTime: 0,
      speedBoost: false,
      speedBoostTime: 0,
      specialCooldown: 0,
      trailParticles: []
    };
    
    // Initialize boss for final level
    if (this.isBossLevel) {
      this.gameState = 'bossIntro';
      this.bossIntroTimer = 3000; // 3 second intro
      this.boss = {
        x: this.canvas.width / 2,
        y: 100,
        width: 120,
        height: 120,
        health: 500,
        maxHealth: 500,
        shootTimer: 0,
        moveDirection: 1,
        speed: 2,
        phase: 1,
        attackPattern: 0,
        specialAttackTimer: 0,
        invulnerable: false,
        tentacles: this.createBossTentacles()
      };
    }
    
    // Adjust game speed and spawn rates based on level
    const levelConfig = this.getLevelConfig(this.currentLevel);
    this.gameSpeed = levelConfig.difficulty.gameSpeed;
    this.obstacleSpawnRate = levelConfig.difficulty.obstacleSpawnRate;
    this.powerUpSpawnRate = levelConfig.difficulty.powerUpSpawnRate;
    this.levelDuration = levelConfig.duration || 45000;
    
    // Initialize background effects based on level theme
    this.initializeLevelEffects(levelConfig);
    
    // Play level-specific music
    if (window.AudioManager) {
      window.AudioManager.playMusic(this.currentLevel);
      window.AudioManager.playSound('level_start');
    }
  }
  
  getLevelConfig(level) {
    // Enhanced level configurations with improved initial speeds
    const configs = {
      1: { 
        difficulty: { gameSpeed: 3.2, obstacleSpawnRate: 0.028, powerUpSpawnRate: 0.012 }, // Increased speed for better engagement
        theme: 'starry',
        duration: 35000 // Shorter for faster progression
      },
      2: { 
        difficulty: { gameSpeed: 3.6, obstacleSpawnRate: 0.030, powerUpSpawnRate: 0.013 },
        theme: 'aurora',
        duration: 35000
      },
      3: { 
        difficulty: { gameSpeed: 2.8, obstacleSpawnRate: 0.032, powerUpSpawnRate: 0.014 },
        theme: 'galaxy',
        duration: 36000
      },
      4: { 
        difficulty: { gameSpeed: 2.5, obstacleSpawnRate: 0.025, powerUpSpawnRate: 0.009 }, 
        theme: 'aurora',
        duration: 46000
      },
      5: { 
        difficulty: { gameSpeed: 3.0, obstacleSpawnRate: 0.030, powerUpSpawnRate: 0.009 }, 
        theme: 'nebula',
        duration: 45000
      },
      6: { 
        difficulty: { gameSpeed: 3.4, obstacleSpawnRate: 0.035, powerUpSpawnRate: 0.010 }, 
        theme: 'crystal',
        duration: 45000
      },
      7: { 
        difficulty: { gameSpeed: 3.8, obstacleSpawnRate: 0.040, powerUpSpawnRate: 0.011 }, 
        theme: 'plasma',
        duration: 45000
      },
      8: { 
        difficulty: { gameSpeed: 4.2, obstacleSpawnRate: 0.045, powerUpSpawnRate: 0.012 }, 
        theme: 'quantum',
        duration: 45000
      },
      9: { 
        difficulty: { gameSpeed: 4.6, obstacleSpawnRate: 0.050, powerUpSpawnRate: 0.013 }, 
        theme: 'solar',
        duration: 45000
      },
      10: { 
        difficulty: { gameSpeed: 5.0, obstacleSpawnRate: 0.055, powerUpSpawnRate: 0.014 }, 
        theme: 'core',
        duration: 45000
      },
      11: { 
        difficulty: { gameSpeed: 5.5, obstacleSpawnRate: 0.060, powerUpSpawnRate: 0.015 }, 
        theme: 'void',
        duration: 45000
      },
      12: { 
        difficulty: { gameSpeed: 6.0, obstacleSpawnRate: 0.065, powerUpSpawnRate: 0.016 }, 
        theme: 'void',
        duration: 45000
      },
      13: { 
        difficulty: { gameSpeed: 6.5, obstacleSpawnRate: 0.070, powerUpSpawnRate: 0.017 }, 
        theme: 'void',
        duration: 45000
      },
      14: { 
        difficulty: { gameSpeed: 7.0, obstacleSpawnRate: 0.075, powerUpSpawnRate: 0.018 }, 
        theme: 'void',
        duration: 45000
      },
      15: { 
        difficulty: { gameSpeed: 4.0, obstacleSpawnRate: 0.030, powerUpSpawnRate: 0.020 }, // Slower for boss mechanics
        theme: 'boss',
        duration: 180000 // 3 minutes for boss fight
      }
    };
    
    return configs[level] || configs[1];
  }
  
  initializeLevelEffects(config) {
    this.backgroundEffects = [];
    
    // Add theme-specific background effects
    switch (config.theme) {
      case 'starry':
        for (let i = 0; i < 5; i++) {
          this.backgroundEffects.push({
            type: 'shooting_star',
            x: Math.random() * this.canvas.width,
            y: -10,
            speed: 3 + Math.random() * 2,
            life: 1000 + Math.random() * 2000
          });
        }
        break;
      case 'nebula':
        for (let i = 0; i < 10; i++) {
          this.backgroundEffects.push({
            type: 'nebula_particle',
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            speed: 0.5 + Math.random(),
            color: `hsl(${280 + Math.random() * 80}, 70%, 60%)`,
            size: 2 + Math.random() * 3
          });
        }
        break;
      case 'boss':
        // Add ominous energy effects
        for (let i = 0; i < 8; i++) {
          this.backgroundEffects.push({
            type: 'energy_tendril',
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            angle: Math.random() * Math.PI * 2,
            length: 50 + Math.random() * 100,
            color: '#FF1493'
          });
        }
        break;
    }
  }
  
  createBossTentacles() {
    const tentacles = [];
    for (let i = 0; i < 6; i++) {
      tentacles.push({
        angle: (i * Math.PI) / 3,
        length: 60 + Math.random() * 40,
        wiggleOffset: Math.random() * Math.PI,
        health: 50
      });
    }
    return tentacles;
  }
  
  update(deltaTime) {
    if (this.gameState === 'bossIntro') {
      this.bossIntroTimer -= deltaTime;
      if (this.bossIntroTimer <= 0) {
        this.gameState = 'playing';
      }
      this.updateBackgroundEffects(deltaTime);
      return;
    }
    
    if (this.gameState !== 'playing') return;
    
    this.gameTime += deltaTime;
    this.levelTime += deltaTime;
    
    // Update player
    this.updatePlayer(deltaTime);
    
    // Update obstacles
    this.updateObstacles(deltaTime);
    
    // Update power-ups
    this.updatePowerUps(deltaTime);
    
    // Update particles
    this.updateParticles(deltaTime);
    
    // Update projectiles
    this.updateProjectiles(deltaTime);
    
    // Update background effects
    this.updateBackgroundEffects(deltaTime);
    
    // Update special effects
    this.updateSpecialEffects(deltaTime);
    
    // Update boss
    if (this.isBossLevel && this.boss) {
      this.updateBoss(deltaTime);
    }
    
    // Spawn new objects
    this.spawnObjects();
    
    // Check collisions
    this.checkCollisions();
    
    // Check level completion
    this.checkLevelCompletion();
    
    // Update flutterer special abilities
    this.updateFluttererSpecials(deltaTime);
  }
  
  updatePlayer(deltaTime) {
    if (!this.player) return;
    
    // Smooth movement to target position
    const dx = this.player.targetX - this.player.x;
    const dy = this.player.targetY - this.player.y;
    
    this.player.x += dx * 0.15;
    this.player.y += dy * 0.15;
    
    // Keep player within bounds
    this.player.x = Math.max(this.player.width/2, Math.min(this.canvas.width - this.player.width/2, this.player.x));
    this.player.y = Math.max(this.player.height/2, Math.min(this.canvas.height - this.player.height/2, this.player.y));
    
    // Update power-up timers
    if (this.player.shieldTime > 0) {
      this.player.shieldTime -= deltaTime;
      if (this.player.shieldTime <= 0) {
        this.player.hasShield = false;
      }
    }
    
    if (this.player.blasterTime > 0) {
      this.player.blasterTime -= deltaTime;
      if (this.player.blasterTime <= 0) {
        this.player.blasterMode = false;
        this.player.blasterLevel = 0; // Reset blaster level when power-up expires
      } else {
        // Automatic shooting when blaster is active
        this.handleAutomaticShooting(deltaTime);
      }
    }
    
    if (this.player.speedBoostTime > 0) {
      this.player.speedBoostTime -= deltaTime;
      if (this.player.speedBoostTime <= 0) {
        this.player.speedBoost = false;
      }
    }
  }
  
  updateObstacles(deltaTime) {
    // Update obstacles (use reverse iteration to safely remove elements)
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i];
      obstacle.y += this.gameSpeed;
      obstacle.rotation += obstacle.rotationSpeed;
      
      // Remove obstacles that are off screen
      if (obstacle.y > this.canvas.height + obstacle.height) {
        this.obstacles.splice(i, 1);
        this.score += 10; // Score for surviving
      }
    }
  }
  
  updatePowerUps(deltaTime) {
    // Update power-ups (use reverse iteration to safely remove elements)
    for (let i = this.powerUps.length - 1; i >= 0; i--) {
      const powerUp = this.powerUps[i];
      powerUp.y += this.gameSpeed * 0.7;
      powerUp.rotation += 0.05;
      
      // Remove power-ups that are off screen
      if (powerUp.y > this.canvas.height + powerUp.height) {
        this.powerUps.splice(i, 1);
      }
    }
  }
  
  updateParticles(deltaTime) {
    this.particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= deltaTime;
      particle.alpha = particle.life / particle.maxLife;
      
      if (particle.life <= 0) {
        this.particles.splice(index, 1);
      }
    });
  }
  
  updateBoss(deltaTime) {
    if (!this.boss) return;
    
    // Boss movement
    this.boss.x += this.boss.speed * this.boss.moveDirection;
    
    if (this.boss.x <= this.boss.width/2 || this.boss.x >= this.canvas.width - this.boss.width/2) {
      this.boss.moveDirection *= -1;
    }
    
    // Update boss phase based on health
    const healthPercentage = this.boss.health / this.boss.maxHealth;
    if (healthPercentage > 0.66) {
      this.boss.phase = 1;
    } else if (healthPercentage > 0.33) {
      this.boss.phase = 2;
    } else {
      this.boss.phase = 3;
    }
    
    // Boss shooting patterns
    this.boss.shootTimer += deltaTime;
    this.boss.specialAttackTimer += deltaTime;
    
    switch (this.boss.phase) {
      case 1:
        // Phase 1: Basic projectile shooting
        if (this.boss.shootTimer > 1000) {
          this.spawnBossProjectile('basic');
          this.boss.shootTimer = 0;
        }
        break;
        
      case 2:
        // Phase 2: Faster shooting + swarm attacks
        if (this.boss.shootTimer > 700) {
          this.spawnBossProjectile('spread');
          this.boss.shootTimer = 0;
        }
        if (this.boss.specialAttackTimer > 3000) {
          this.spawnEnemySwarm();
          this.boss.specialAttackTimer = 0;
        }
        break;
        
      case 3:
        // Phase 3: Rage mode - beam attacks
        if (this.boss.shootTimer > 500) {
          this.spawnBossProjectile('homing');
          this.boss.shootTimer = 0;
        }
        if (this.boss.specialAttackTimer > 2000) {
          this.spawnRageBeam();
          this.boss.specialAttackTimer = 0;
        }
        break;
    }
    
    // Update tentacles (visual only)
    if (this.boss.tentacles) {
      this.boss.tentacles.forEach(tentacle => {
        tentacle.wiggleOffset += 0.1;
      });
    }
    
    // Boss defeated
    if (this.boss.health <= 0) {
      this.createBossExplosion();
      this.gameStats.bossDefeats++;
      this.saveBossDefeat();
      this.boss = null;
      this.completeLevel();
    }
  }
  
  spawnBossProjectile(type) {
    if (!this.boss || !this.player) return;
    
    switch (type) {
      case 'basic':
        this.obstacles.push({
          x: this.boss.x,
          y: this.boss.y + this.boss.height/2,
          width: 15,
          height: 15,
          rotation: 0,
          rotationSpeed: 0.3,
          type: 'boss_projectile',
          vx: (this.player.x - this.boss.x) * 0.003,
          vy: 3,
          color: '#FF00FF'
        });
        break;
        
      case 'spread':
        // Create 3 projectiles in a spread pattern
        for (let i = -1; i <= 1; i++) {
          this.obstacles.push({
            x: this.boss.x + (i * 30),
            y: this.boss.y + this.boss.height/2,
            width: 12,
            height: 12,
            rotation: 0,
            rotationSpeed: 0.4,
            type: 'boss_projectile',
            vx: i * 2,
            vy: 4,
            color: '#FF6600'
          });
        }
        break;
        
      case 'homing':
        this.obstacles.push({
          x: this.boss.x,
          y: this.boss.y + this.boss.height/2,
          width: 18,
          height: 18,
          rotation: 0,
          rotationSpeed: 0.5,
          type: 'boss_homing',
          vx: 0,
          vy: 2,
          color: '#FF0000',
          homingSpeed: 0.002
        });
        break;
    }
  }
  
  spawnEnemySwarm() {
    // Spawn small enemy insects
    for (let i = 0; i < 5; i++) {
      this.obstacles.push({
        x: Math.random() * this.canvas.width,
        y: -30,
        width: 20,
        height: 20,
        rotation: 0,
        rotationSpeed: 0.2,
        type: 'swarm_insect',
        vx: (Math.random() - 0.5) * 2,
        vy: 2 + Math.random() * 2
      });
    }
  }
  
  spawnRageBeam() {
    // Create a warning indicator first
    this.specialEffects.push({
      type: 'beam_warning',
      x: this.boss.x,
      y: this.boss.y,
      width: 20,
      height: this.canvas.height,
      life: 1000,
      maxLife: 1000,
      alpha: 1,
      color: '#FF0000'
    });
    
    // Spawn actual beam after warning
    setTimeout(() => {
      this.obstacles.push({
        x: this.boss.x - 10,
        y: this.boss.y,
        width: 20,
        height: this.canvas.height,
        type: 'rage_beam',
        life: 2000,
        color: '#FF0000'
      });
    }, 1000);
  }
  
  createBossExplosion() {
    // Create massive explosion effect
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: this.boss.x + (Math.random() - 0.5) * this.boss.width,
        y: this.boss.y + (Math.random() - 0.5) * this.boss.height,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        color: ['#FF0000', '#FF6600', '#FFFF00', '#FFFFFF'][Math.floor(Math.random() * 4)],
        life: 2000,
        maxLife: 2000,
        alpha: 1,
        size: 5 + Math.random() * 10
      });
    }
    
    // Screen shake effect
    this.specialEffects.push({
      type: 'screen_shake',
      intensity: 10,
      life: 1000,
      maxLife: 1000,
      alpha: 1
    });
  }
  
  saveBossDefeat() {
    localStorage.setItem('butterflyBossDefeats', this.gameStats.bossDefeats.toString());
  }
  
  spawnObjects() {
    // Spawn obstacles
    if (Math.random() < this.obstacleSpawnRate && !this.isBossLevel) {
      this.spawnObstacle();
    }
    
    // Spawn power-ups
    if (Math.random() < this.powerUpSpawnRate) {
      this.spawnPowerUp();
    }
  }
  
  spawnObstacle() {
    const obstacle = {
      x: Math.random() * (this.canvas.width - 60) + 30,
      y: -30,
      width: 30 + Math.random() * 20,
      height: 30 + Math.random() * 20,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      type: Math.random() > 0.5 ? 'asteroid' : 'insect'
    };
    
    this.obstacles.push(obstacle);
  }
  
  spawnPowerUp() {
    const types = ['speed', 'shield', 'blaster', 'health'];
    const powerUp = {
      x: Math.random() * (this.canvas.width - 40) + 20,
      y: -20,
      width: 25,
      height: 25,
      rotation: 0,
      type: types[Math.floor(Math.random() * types.length)]
    };
    
    this.powerUps.push(powerUp);
  }
  
  spawnBossProjectile() {
    if (!this.boss || !this.player) return;
    
    const projectile = {
      x: this.boss.x,
      y: this.boss.y + this.boss.height/2,
      width: 15,
      height: 15,
      rotation: 0,
      rotationSpeed: 0.3,
      type: 'boss_projectile',
      vx: (this.player.x - this.boss.x) * 0.005,
      vy: 3
    };
    
    this.obstacles.push(projectile);
  }
  
  checkCollisions() {
    if (!this.player) return;
    
    // Check obstacle collisions (use reverse iteration to safely remove elements)
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i];
      
      // Special handling for homing projectiles
      if (obstacle.type === 'boss_homing') {
        const dx = this.player.x - obstacle.x;
        const dy = this.player.y - obstacle.y;
        obstacle.vx += dx * obstacle.homingSpeed;
        obstacle.vy += dy * obstacle.homingSpeed;
      }
      
      if (this.isColliding(this.player, obstacle)) {
        if (!this.player.hasShield) {
          this.playerHit();
        } else {
          // Shield deflects projectiles
          if (obstacle.type.includes('boss_')) {
            this.createParticles(obstacle.x, obstacle.y, '#00FFFF');
          }
        }
        this.createExplosion(obstacle.x, obstacle.y);
        this.obstacles.splice(i, 1);
      }
    }
    
    // Check power-up collisions (use reverse iteration to safely remove elements)
    for (let i = this.powerUps.length - 1; i >= 0; i--) {
      const powerUp = this.powerUps[i];
      if (this.isColliding(this.player, powerUp)) {
        this.collectPowerUp(powerUp);
        this.createPowerUpEffect(powerUp.x, powerUp.y, powerUp.type);
        this.powerUps.splice(i, 1);
      }
    }
    
    // Check player projectile vs obstacle collisions (use reverse iteration for both arrays)
    for (let pIndex = this.projectiles.length - 1; pIndex >= 0; pIndex--) {
      const projectile = this.projectiles[pIndex];
      if (projectile.type !== 'player') continue;
      
      for (let oIndex = this.obstacles.length - 1; oIndex >= 0; oIndex--) {
        const obstacle = this.obstacles[oIndex];
        if (this.isColliding(projectile, obstacle)) {
          this.createExplosion(obstacle.x, obstacle.y);
          this.score += obstacle.points || 20;
          
          // Remove both projectile and obstacle
          this.obstacles.splice(oIndex, 1);
          this.projectiles.splice(pIndex, 1);
          
          // Play sound effect
          try {
            if (window.audioManager) {
              window.audioManager.playSound('enemy_explosion');
            }
          } catch (error) {
            console.warn('Audio error:', error);
          }
          break; // Exit obstacle loop since projectile is gone
        }
      }
    }
    
    // Check player projectile vs boss collisions
    if (this.boss) {
      this.projectiles.forEach((projectile, pIndex) => {
        if (projectile.type === 'player' && this.isColliding(projectile, this.boss)) {
          this.boss.health -= projectile.damage || 25;
          this.createParticles(projectile.x, projectile.y, '#FF6600');
          this.projectiles.splice(pIndex, 1);
          
          // Boss flash when hit
          this.boss.invulnerable = true;
          setTimeout(() => {
            if (this.boss) this.boss.invulnerable = false;
          }, 100);
        }
      });
      
      // Check boss collision with player
      if (this.isColliding(this.player, this.boss)) {
        if (!this.player.hasShield) {
          this.playerHit();
        }
      }
    }
  }
  
  isColliding(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
  }
  
  playerHit() {
    // Reduce player health first
    if (this.player) {
      this.player.health -= 25; // Damage per hit
      
      if (this.player.health <= 0) {
        this.player.health = 0;
        // Only reduce lives when health reaches zero
        this.lives--;
        
        if (this.lives > 0) {
          // Restore health if player has lives left
          this.player.health = this.player.maxHealth;
        }
      }
    }
    
    // Enhanced visual effects
    this.createExplosion(this.player.x, this.player.y);
    this.particleSystem.createExplosion(this.player.x, this.player.y, '#ff6b6b', 15);
    this.screenEffects.hitEffect(); // Screen shake + flash
    
    // Play damage sound
    if (window.AudioManager) {
      window.AudioManager.playSound('player_hit');
    }
    
    if (this.lives <= 0) {
      this.gameState = 'gameOver';
      // Boss explosion visual effect for game over
      this.particleSystem.createExplosion(this.player.x, this.player.y, '#ff0000', 25);
      this.screenEffects.shake(8, 500); // Strong game over shake
      
      if (window.AudioManager) {
        window.AudioManager.playSound('game_over');
        window.AudioManager.stopAllAudio();
      }
    }
  }
  
  collectPowerUp(powerUp) {
    switch (powerUp.type) {
      case 'speed':
        this.player.speedBoost = true;
        this.player.speedBoostTime = 5000;
        this.player.speed = this.player.baseSpeed * 1.5;
        break;
      case 'shield':
        this.player.hasShield = true;
        this.player.shieldTime = 8000;
        break;
      case 'blaster':
        this.player.blasterMode = true;
        this.player.blasterTime = 10000;
        // Increase blaster level (max level 3)
        this.player.blasterLevel = Math.min(3, this.player.blasterLevel + 1);
        
        // Show level-up indicator
        this.createFloatingText(this.player.x, this.player.y - 30, 
          `BLASTER LV${this.player.blasterLevel}!`, '#FF00FF', 2000);
        break;
      case 'health':
        this.player.health = Math.min(this.player.maxHealth, this.player.health + 25);
        break;
    }
    
    this.score += 50;
    
    // Enhanced visual effects for power-up collection
    const colors = {
      'speed': '#00FF00',
      'shield': '#00FFFF', 
      'blaster': '#FF4500',
      'health': '#FF69B4'
    };
    
    // Create sparkle explosion
    this.particleSystem.createSparkles(
      powerUp.x, powerUp.y, 
      colors[powerUp.type] || '#FFD700', 
      20
    );
    
    // Screen flash effect
    this.screenEffects.powerUpEffect();
    
    // Play enhanced power-up sounds
    if (window.AudioManager) {
      window.AudioManager.playPowerUpSound(powerUp.type);
    }
  }
  
  createPowerUpEffect(x, y, type) {
    // Enhanced power-up collection effect with more particles
    const colors = {
      'speed': '#00FF00',
      'shield': '#00FFFF', 
      'blaster': '#FF4500',
      'health': '#FF69B4'
    };
    
    // Create larger sparkle burst
    for (let i = 0; i < 12; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 30,
        y: y + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        color: colors[type] || '#FFD700',
        life: 1200,
        maxLife: 1200,
        alpha: 1,
        size: 2 + Math.random() * 4
      });
    }
    
    // Add floating "+50" text effect
    this.specialEffects.push({
      type: 'power_up_collect',
      x: x,
      y: y,
      scale: 1,
      life: 1500,
      maxLife: 1500,
      alpha: 1,
      color: colors[type] || '#FFD700',
      text: '+50'
    });
  }
  
  createExplosion(x, y) {
    for (let i = 0; i < 8; i++) {
      this.createParticle(x, y, '#FF6B35', Math.random() * 6 - 3, Math.random() * 6 - 3);
    }
  }
  
  createParticles(x, y, color) {
    for (let i = 0; i < 6; i++) {
      this.createParticle(x, y, color, Math.random() * 4 - 2, Math.random() * 4 - 2);
    }
  }
  
  createParticle(x, y, color, vx, vy) {
    this.particles.push({
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      color: color,
      life: 1000,
      maxLife: 1000,
      alpha: 1
    });
  }
  
  checkLevelCompletion() {
    if (this.isBossLevel) {
      if (this.boss && this.boss.health <= 0) {
        this.completeLevel();
      }
    } else {
      if (this.levelTime >= this.levelDuration) {
        this.completeLevel();
      }
    }
  }
  
  completeLevel() {
    this.score += 1000 * this.currentLevel;
    
    if (this.currentLevel >= this.maxLevel) {
      this.gameState = 'gameComplete';
    } else {
      this.currentLevel++;
      this.gameState = 'levelComplete';
      setTimeout(() => {
        this.initializeLevel();
        this.gameState = 'playing';
      }, 2000);
    }
  }
  
  handleAutomaticShooting(deltaTime) {
    const currentTime = Date.now();
    
    // Different firing rates based on blaster level (made slower and less aggressive)
    let fireRate;
    switch (this.player.blasterLevel) {
      case 1: fireRate = 800; break; // Single shot every 800ms (was 400ms)
      case 2: fireRate = 600; break; // Dual shot every 600ms (was 300ms)
      case 3: fireRate = 400; break; // Laser beam every 400ms (was 150ms)
      default: return;
    }
    
    if (currentTime - this.player.lastShotTime >= fireRate) {
      // Auto-target the nearest obstacle or shoot straight up (less aggressive targeting)
      const target = this.findNearestObstacle() || { x: this.player.x, y: this.player.y - 150 };
      this.shootProjectile(target.x, target.y);
    }
  }
  
  findNearestObstacle() {
    let nearestObstacle = null;
    let nearestDistance = Infinity;
    
    this.obstacles.forEach(obstacle => {
      // Only target obstacles that are above player and within a reasonable range
      if (obstacle.y <= this.player.y - 50) { // Must be at least 50 pixels above
        const dx = obstacle.x - this.player.x;
        const dy = obstacle.y - this.player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < nearestDistance && distance < 150) { // Reduced from 200 to 150 pixels
          nearestDistance = distance;
          nearestObstacle = obstacle;
        }
      }
    });
    
    return nearestObstacle;
  }

  shootProjectile(targetX, targetY) {
    const currentTime = Date.now();
    
    // Update last shot time
    this.player.lastShotTime = currentTime;
    
    switch (this.player.blasterLevel) {
      case 1: // Single shot
        this.createPlayerProjectile(this.player.x, this.player.y - 10, targetX, targetY, 'single');
        break;
        
      case 2: // Dual shot
        this.createPlayerProjectile(this.player.x - 10, this.player.y - 10, targetX, targetY, 'dual');
        this.createPlayerProjectile(this.player.x + 10, this.player.y - 10, targetX, targetY, 'dual');
        break;
        
      case 3: // Laser beam
        this.createPlayerProjectile(this.player.x, this.player.y - 10, targetX, targetY, 'laser');
        break;
    }
    
    // Play shooting sound effect
    if (typeof window !== 'undefined' && window.audioManager) {
      window.audioManager.playSFX('blaster_shoot', { volume: 0.4 });
    }
  }
  
  createPlayerProjectile(startX, startY, targetX, targetY, shotType) {
    // Calculate direction
    const dx = targetX - startX;
    const dy = targetY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize direction
    const speed = shotType === 'laser' ? 15 : 12;
    const vx = (dx / distance) * speed;
    const vy = (dy / distance) * speed;
    
    const projectile = {
      x: startX,
      y: startY,
      width: shotType === 'laser' ? 8 : 6,
      height: shotType === 'laser' ? 20 : 12,
      vx: vx,
      vy: vy,
      type: 'player',
      shotType: shotType,
      damage: shotType === 'laser' ? 40 : shotType === 'dual' ? 20 : 25,
      life: 3000, // 3 seconds
      color: shotType === 'laser' ? '#FF0080' : '#00FFFF'
    };
    
    this.projectiles.push(projectile);
  }

  updateProjectiles(deltaTime) {
    this.projectiles.forEach((projectile, index) => {
      projectile.x += projectile.vx;
      projectile.y += projectile.vy;
      projectile.life -= deltaTime;
      
      // Remove projectiles that are off screen or expired
      if (projectile.y < -50 || projectile.y > this.canvas.height + 50 || 
          projectile.x < -50 || projectile.x > this.canvas.width + 50 || 
          projectile.life <= 0) {
        this.projectiles.splice(index, 1);
      }
    });
  }
  
  updateBackgroundEffects(deltaTime) {
    this.backgroundEffects.forEach((effect, index) => {
      switch (effect.type) {
        case 'shooting_star':
          effect.y += effect.speed;
          effect.life -= deltaTime;
          if (effect.y > this.canvas.height || effect.life <= 0) {
            this.backgroundEffects.splice(index, 1);
          }
          break;
        case 'nebula_particle':
          effect.y += effect.speed;
          if (effect.y > this.canvas.height) {
            effect.y = -10;
            effect.x = Math.random() * this.canvas.width;
          }
          break;
        case 'energy_tendril':
          effect.angle += 0.02;
          break;
      }
    });
  }
  
  updateSpecialEffects(deltaTime) {
    this.specialEffects.forEach((effect, index) => {
      effect.life -= deltaTime;
      effect.alpha = effect.life / effect.maxLife;
      
      if (effect.life <= 0) {
        this.specialEffects.splice(index, 1);
      } else {
        // Update effect based on type
        switch (effect.type) {
          case 'power_up_collect':
            effect.scale += 0.05;
            effect.y -= 2;
            break;
          case 'explosion':
            effect.scale += 0.1;
            break;
        }
      }
    });
  }
  
  updateFluttererSpecials(deltaTime) {
    if (!this.selectedFlutterer || !this.player) return;
    
    const special = this.selectedFlutterer.skills.special;
    
    // Update special ability cooldowns
    if (this.player.specialCooldown > 0) {
      this.player.specialCooldown -= deltaTime;
    }
    
    switch (special) {
      case 'trail_sparkles':
        // Add sparkle trail particles
        if (Math.random() < 0.3) {
          this.createSparkleTrail(this.player.x, this.player.y);
        }
        break;
      case 'shoot_projectiles':
        // Auto-shoot when blaster mode is active
        if (this.player.blasterMode && this.player.specialCooldown <= 0) {
          this.shootPlayerProjectile();
          this.player.specialCooldown = 500; // 0.5 second cooldown
        }
        break;
    }
  }
  
  createSparkleTrail(x, y) {
    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: '#FFD700',
        life: 800,
        maxLife: 800,
        alpha: 1,
        size: 2 + Math.random() * 2
      });
    }
  }
  
  shootPlayerProjectile() {
    this.projectiles.push({
      x: this.player.x,
      y: this.player.y - 20,
      vx: 0,
      vy: -8,
      width: 8,
      height: 15,
      color: '#00FFFF',
      life: 2000,
      type: 'player',
      damage: 25
    });
  }
  
  createFloatingText(x, y, text, color, duration = 2000) {
    // Add floating text effect to special effects
    this.specialEffects.push({
      type: 'floating_text',
      x: x,
      y: y,
      text: text,
      color: color,
      life: duration,
      maxLife: duration,
      vy: -1.5 // Float upward
    });
  }
};