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
    
    // Touch controls
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
    
    // Enhanced effects
    this.backgroundEffects = [];
    this.specialEffects = [];
    
    this.setupEventListeners();
    this.initializeDefaultFlutterer();
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
    // Touch events for mobile
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      this.touchStartX = touch.clientX - rect.left;
      this.touchStartY = touch.clientY - rect.top;
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
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        
        // Move player based on touch position
        this.player.targetX = touchX;
        this.player.targetY = touchY;
      }
    });
    
    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.isTouching = false;
    });
    
    // Mouse events for desktop testing
    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.touchStartX = e.clientX - rect.left;
      this.touchStartY = e.clientY - rect.top;
      this.isTouching = true;
      
      if (this.gameState === 'menu' || this.gameState === 'gameOver') {
        this.startGame();
      }
    });
    
    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isTouching && this.player && this.gameState === 'playing') {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        this.player.targetX = mouseX;
        this.player.targetY = mouseY;
      }
    });
    
    this.canvas.addEventListener('mouseup', () => {
      this.isTouching = false;
    });
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
    
    // Initialize background effects based on level theme
    this.initializeLevelEffects(levelConfig);
  }
  
  getLevelConfig(level) {
    // Simplified level config - in full implementation this would come from levels.js
    const configs = {
      1: { difficulty: { gameSpeed: 2, obstacleSpawnRate: 0.02, powerUpSpawnRate: 0.005 }, theme: 'starry' },
      5: { difficulty: { gameSpeed: 4, obstacleSpawnRate: 0.04, powerUpSpawnRate: 0.009 }, theme: 'nebula' },
      10: { difficulty: { gameSpeed: 6.5, obstacleSpawnRate: 0.065, powerUpSpawnRate: 0.014 }, theme: 'core' },
      15: { difficulty: { gameSpeed: 4, obstacleSpawnRate: 0.03, powerUpSpawnRate: 0.02 }, theme: 'boss' }
    };
    
    // Find closest config
    const availableLevels = Object.keys(configs).map(Number).sort((a, b) => a - b);
    let targetLevel = availableLevels[0];
    
    for (let i = 0; i < availableLevels.length; i++) {
      if (level >= availableLevels[i]) {
        targetLevel = availableLevels[i];
      }
    }
    
    return configs[targetLevel];
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
    this.obstacles.forEach((obstacle, index) => {
      obstacle.y += this.gameSpeed;
      obstacle.rotation += obstacle.rotationSpeed;
      
      // Remove obstacles that are off screen
      if (obstacle.y > this.canvas.height + obstacle.height) {
        this.obstacles.splice(index, 1);
        this.score += 10; // Score for surviving
      }
    });
  }
  
  updatePowerUps(deltaTime) {
    this.powerUps.forEach((powerUp, index) => {
      powerUp.y += this.gameSpeed * 0.7;
      powerUp.rotation += 0.05;
      
      // Remove power-ups that are off screen
      if (powerUp.y > this.canvas.height + powerUp.height) {
        this.powerUps.splice(index, 1);
      }
    });
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
    
    // Boss shooting
    this.boss.shootTimer += deltaTime;
    if (this.boss.shootTimer > 1000) { // Shoot every second
      this.spawnBossProjectile();
      this.boss.shootTimer = 0;
    }
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
    
    // Check obstacle collisions
    this.obstacles.forEach((obstacle, index) => {
      if (this.isColliding(this.player, obstacle)) {
        if (!this.player.hasShield) {
          this.playerHit();
        }
        this.createExplosion(obstacle.x, obstacle.y);
        this.obstacles.splice(index, 1);
      }
    });
    
    // Check power-up collisions
    this.powerUps.forEach((powerUp, index) => {
      if (this.isColliding(this.player, powerUp)) {
        this.collectPowerUp(powerUp);
        this.powerUps.splice(index, 1);
      }
    });
    
    // Check boss collision
    if (this.boss && this.isColliding(this.player, this.boss)) {
      if (!this.player.hasShield) {
        this.playerHit();
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
    this.lives--;
    this.createExplosion(this.player.x, this.player.y);
    
    if (this.lives <= 0) {
      this.gameState = 'gameOver';
    }
  }
  
  collectPowerUp(powerUp) {
    switch (powerUp.type) {
      case 'speed':
        this.player.speedBoost = true;
        this.player.speedBoostTime = 5000;
        break;
      case 'shield':
        this.player.hasShield = true;
        this.player.shieldTime = 8000;
        break;
      case 'blaster':
        this.player.blasterMode = true;
        this.player.blasterTime = 10000;
        break;
      case 'health':
        this.player.health = Math.min(this.player.maxHealth, this.player.health + 25);
        break;
    }
    
    this.score += 50;
    this.createParticles(powerUp.x, powerUp.y, '#FFD700');
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
};