class GameEngine {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.gameState = 'menu'; // menu, playing, paused, gameOver, levelComplete
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
    
    this.setupEventListeners();
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
    this.levelTime = 0;
    this.isBossLevel = this.currentLevel === this.maxLevel;
    
    // Initialize player
    this.player = {
      x: this.canvas.width / 2,
      y: this.canvas.height - 100,
      targetX: this.canvas.width / 2,
      targetY: this.canvas.height - 100,
      width: 40,
      height: 40,
      speed: 8,
      health: 100,
      maxHealth: 100,
      hasShield: false,
      shieldTime: 0,
      blasterMode: false,
      blasterTime: 0,
      speedBoost: false,
      speedBoostTime: 0
    };
    
    // Initialize boss for final level
    if (this.isBossLevel) {
      this.boss = {
        x: this.canvas.width / 2,
        y: 100,
        width: 120,
        height: 120,
        health: 500,
        maxHealth: 500,
        shootTimer: 0,
        moveDirection: 1,
        speed: 2
      };
    }
    
    // Adjust game speed based on level
    this.gameSpeed = 2 + (this.currentLevel * 0.5);
    this.obstacleSpawnRate = 0.02 + (this.currentLevel * 0.005);
  }
  
  update(deltaTime) {
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
}