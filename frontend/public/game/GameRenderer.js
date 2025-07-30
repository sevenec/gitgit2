window.GameRenderer = class GameRenderer {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.nebulaOffset = 0;
    this.starField = this.generateStarField();
  }
  
  generateStarField() {
    const stars = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 0.5,
        brightness: Math.random() * 0.8 + 0.2
      });
    }
    return stars;
  }
  
  render(gameEngine) {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render enhanced background
    this.renderEnhancedBackground(gameEngine.currentLevel);
    
    // Render background effects
    this.renderBackgroundEffects(gameEngine.backgroundEffects);
    
    switch (gameEngine.gameState) {
      case 'menu':
        this.renderMenu();
        break;
      case 'bossIntro':
        this.renderBossIntro(gameEngine);
        break;
      case 'playing':
        this.renderGame(gameEngine);
        break;
      case 'paused':
        this.renderGame(gameEngine);
        this.renderPauseOverlay();
        break;
      case 'gameOver':
        this.renderGame(gameEngine);
        this.renderGameOver(gameEngine);
        break;
      case 'levelComplete':
        this.renderGame(gameEngine);
        this.renderLevelComplete(gameEngine);
        break;
      case 'gameComplete':
        this.renderGameComplete(gameEngine);
        break;
    }
  }
  
  renderEnhancedBackground(level) {
    // Enhanced background rendering with level-specific themes
    const backgroundConfig = this.getLevelBackgroundConfig(level);
    
    // Create complex multi-stop gradient
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    backgroundConfig.gradientStops.forEach((stop, index) => {
      gradient.addColorStop(index / (backgroundConfig.gradientStops.length - 1), stop);
    });
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render enhanced star field
    this.renderEnhancedStars();
    
    // Add level-specific visual effects
    this.renderLevelVisualEffects(level, backgroundConfig);
  }
  
  getLevelBackgroundConfig(level) {
    const configs = {
      1: {
        name: 'Starry Genesis',
        gradientStops: ['#0B1426', '#1B2951', '#2A3F7A', '#4A5F9A'],
        effects: ['twinkling_stars', 'gentle_drift']
      },
      5: {
        name: 'Colorful Nebula', 
        gradientStops: ['#2D1B69', '#8B2986', '#E94560', '#F2CC8F'],
        effects: ['nebula_swirls', 'color_transitions']
      },
      10: {
        name: 'Galactic Core',
        gradientStops: ['#4A1A4A', '#7A2A7A', '#AA3AAA', '#DA4ADA'],
        effects: ['core_pulsation', 'energy_streams']
      },
      15: {
        name: 'Boss Arena',
        gradientStops: ['#4B0082', '#8B008B', '#FF1493', '#FF69B4'],
        effects: ['boss_aura', 'energy_tendrils', 'ominous_glow']
      }
    };
    
    // Find appropriate config for level
    const levelKeys = Object.keys(configs).map(Number).sort((a, b) => b - a);
    for (let key of levelKeys) {
      if (level >= key) {
        return configs[key];
      }
    }
    return configs[1];
  }
  
  renderEnhancedStars() {
    // Enhanced star field with multiple types and twinkling
    this.ctx.fillStyle = '#FFFFFF';
    this.starField.forEach(star => {
      star.y += star.speed;
      if (star.y > this.canvas.height) {
        star.y = -5;
        star.x = Math.random() * this.canvas.width;
      }
      
      // Enhanced twinkling effect
      const time = Date.now() * 0.003;
      const twinkle = Math.sin(time + star.x * 0.01) * 0.3 + 0.7;
      
      this.ctx.save();
      this.ctx.globalAlpha = star.brightness * twinkle;
      
      // Add subtle glow to larger stars
      if (star.size > 2) {
        this.ctx.shadowColor = '#FFFFFF';
        this.ctx.shadowBlur = star.size * 2;
      }
      
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.restore();
    });
  }
  
  renderLevelVisualEffects(level, config) {
    const time = Date.now() * 0.001;
    
    switch (true) {
      case level <= 3:
        this.renderTwinklingEffect(time);
        break;
      case level <= 7:
        this.renderNebulaSwirls(time);
        break;
      case level <= 12:
        this.renderEnergyStreams(time);
        break;
      case level === 15:
        this.renderBossAura(time);
        break;
    }
  }
  
  renderTwinklingEffect(time) {
    // Subtle twinkling particles
    for (let i = 0; i < 15; i++) {
      const x = (Math.sin(time * 0.5 + i) * 0.5 + 0.5) * this.canvas.width;
      const y = (Math.cos(time * 0.3 + i * 0.7) * 0.5 + 0.5) * this.canvas.height;
      const alpha = Math.sin(time * 2 + i) * 0.3 + 0.3;
      
      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = '#E6E6FA';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 1, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }
  
  renderNebulaSwirls(time) {
    // Colorful nebula swirl effects
    for (let i = 0; i < 4; i++) {
      const centerX = this.canvas.width * (0.2 + i * 0.2);
      const centerY = this.canvas.height * 0.5 + Math.sin(time + i) * 50;
      const radius = 25 + Math.sin(time * 2 + i) * 8;
      
      this.ctx.save();
      this.ctx.translate(centerX, centerY);
      this.ctx.rotate(time * 0.5 + i);
      
      const colors = ['#8B2986', '#E94560', '#F2CC8F'];
      const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      gradient.addColorStop(0, `${colors[i % colors.length]}40`);
      gradient.addColorStop(0.7, `${colors[i % colors.length]}20`);
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
      
      this.ctx.restore();
    }
  }
  
  renderEnergyStreams(time) {
    // Galactic core energy streams
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(170, 58, 170, 0.4)';
    this.ctx.lineWidth = 2;
    this.ctx.shadowColor = '#AA3AAA';
    this.ctx.shadowBlur = 6;
    
    for (let i = 0; i < 6; i++) {
      const startX = (i * this.canvas.width / 6) + Math.sin(time + i) * 15;
      const startY = 0;
      const endX = startX + Math.cos(time * 0.7 + i) * 20;
      const endY = this.canvas.height;
      
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.quadraticCurveTo(
        startX + Math.sin(time * 2 + i) * 30, 
        this.canvas.height / 2,
        endX, 
        endY
      );
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }
  
  renderBossAura(time) {
    // Ominous boss aura effect
    const centerX = this.canvas.width / 2;
    const centerY = 100;
    const maxRadius = 120;
    
    for (let i = 0; i < 3; i++) {
      const radius = (maxRadius * (i + 1) / 3) * (0.7 + 0.3 * Math.sin(time * 2 + i));
      const alpha = 0.15 - (i * 0.04);
      
      const gradient = this.ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );
      gradient.addColorStop(0, `rgba(255, 20, 147, ${alpha})`);
      gradient.addColorStop(0.6, `rgba(139, 0, 139, ${alpha * 0.5})`);
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  renderBackgroundEffects(effects) {
    effects.forEach(effect => {
      this.ctx.save();
      
      switch (effect.type) {
        case 'shooting_star':
          this.ctx.strokeStyle = '#FFFFFF';
          this.ctx.lineWidth = 2;
          this.ctx.globalAlpha = 0.8;
          this.ctx.beginPath();
          this.ctx.moveTo(effect.x, effect.y);
          this.ctx.lineTo(effect.x - 20, effect.y - 10);
          this.ctx.stroke();
          break;
          
        case 'nebula_particle':
          this.ctx.fillStyle = effect.color;
          this.ctx.globalAlpha = 0.6;
          this.ctx.beginPath();
          this.ctx.arc(effect.x, effect.y, effect.size, 0, Math.PI * 2);
          this.ctx.fill();
          break;
          
        case 'energy_tendril':
          this.ctx.strokeStyle = effect.color;
          this.ctx.lineWidth = 3;
          this.ctx.globalAlpha = 0.4;
          this.ctx.beginPath();
          this.ctx.moveTo(effect.x, effect.y);
          const endX = effect.x + Math.cos(effect.angle) * effect.length;
          const endY = effect.y + Math.sin(effect.angle) * effect.length;
          this.ctx.lineTo(endX, endY);
          this.ctx.stroke();
          break;
      }
      
      this.ctx.restore();
    });
  }
  
  renderBossIntro(gameEngine) {
    // Render game normally first
    this.renderGame(gameEngine);
    
    // Boss intro overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Epic boss introduction text
    this.ctx.fillStyle = '#FF1493';
    this.ctx.font = 'bold 36px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('FINAL BOSS APPROACHING', this.canvas.width / 2, this.canvas.height / 2 - 60);
    
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillText('MOTHER INSECT AWAKENS', this.canvas.width / 2, this.canvas.height / 2 - 20);
    
    this.ctx.fillStyle = '#FFD700';
    this.ctx.font = '18px Arial';
    this.ctx.fillText('Use all your power-ups to survive!', this.canvas.width / 2, this.canvas.height / 2 + 20);
    
    // Countdown timer
    const timeLeft = Math.ceil(gameEngine.bossIntroTimer / 1000);
    this.ctx.fillStyle = '#FF0000';
    this.ctx.font = 'bold 48px Arial';
    this.ctx.fillText(timeLeft.toString(), this.canvas.width / 2, this.canvas.height / 2 + 80);
  }
  
  renderBackground(level) {
    // Create gradient based on level
    let gradient;
    
    if (level <= 5) {
      // Starry night theme
      gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
      gradient.addColorStop(0, '#0B1426');
      gradient.addColorStop(0.5, '#1B2951');
      gradient.addColorStop(1, '#2A3F7A');
    } else if (level <= 10) {
      // Colorful nebula theme
      gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
      gradient.addColorStop(0, '#2D1B69');
      gradient.addColorStop(0.3, '#8B2986');
      gradient.addColorStop(0.7, '#E94560');
      gradient.addColorStop(1, '#F2CC8F');
    } else {
      // Dark void theme
      gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
      gradient.addColorStop(0, '#000000');
      gradient.addColorStop(0.3, '#1A0033');
      gradient.addColorStop(0.7, '#330066');
      gradient.addColorStop(1, '#660099');
    }
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Animate star field
    this.nebulaOffset += 0.5;
    if (this.nebulaOffset > this.canvas.height) {
      this.nebulaOffset = 0;
    }
    
    // Render stars
    this.ctx.fillStyle = '#FFFFFF';
    this.starField.forEach(star => {
      star.y += star.speed;
      if (star.y > this.canvas.height) {
        star.y = -5;
        star.x = Math.random() * this.canvas.width;
      }
      
      this.ctx.globalAlpha = star.brightness;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    this.ctx.globalAlpha = 1;
  }
  
  renderMenu() {
    // Game title
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 32px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('BUTTERFLY', this.canvas.width / 2, this.canvas.height / 2 - 60);
    
    this.ctx.fillStyle = '#FFD700';
    this.ctx.font = 'bold 28px Arial';
    this.ctx.fillText('NEBULA BRAWL', this.canvas.width / 2, this.canvas.height / 2 - 20);
    
    // Subtitle
    this.ctx.fillStyle = '#CCCCCC';
    this.ctx.font = '18px Arial';
    this.ctx.fillText('Tap or Click to Start', this.canvas.width / 2, this.canvas.height / 2 + 40);
    
    // Draw a simple butterfly
    this.drawButterfly(this.canvas.width / 2, this.canvas.height / 2 + 100, 0, 1.5);
  }
  
  renderGame(gameEngine) {
    // Render player with flutterer customization
    if (gameEngine.player) {
      this.drawFlutterer(
        gameEngine.player.x, 
        gameEngine.player.y, 
        0,
        1,
        gameEngine.player.hasShield,
        gameEngine.selectedFlutterer
      );
    }
    
    // Render obstacles
    gameEngine.obstacles.forEach(obstacle => {
      if (obstacle.type === 'boss_projectile') {
        this.drawBossProjectile(obstacle);
      } else if (obstacle.type === 'boss_homing') {
        this.drawHomingProjectile(obstacle);
      } else if (obstacle.type === 'rage_beam') {
        this.drawRageBeam(obstacle);
      } else {
        this.drawObstacle(obstacle);
      }
    });
    
    // Render power-ups
    gameEngine.powerUps.forEach(powerUp => {
      this.drawPowerUp(powerUp);
    });
    
    // Render player projectiles
    gameEngine.projectiles.forEach(projectile => {
      if (projectile.type === 'player') {
        this.drawPlayerProjectile(projectile);
      }
    });
    
    // Render particles with enhanced effects
    gameEngine.particles.forEach(particle => {
      this.ctx.globalAlpha = particle.alpha;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size || 3, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    this.ctx.globalAlpha = 1;
    
    // Render special effects
    this.renderSpecialEffects(gameEngine.specialEffects);
    
    // Render boss
    if (gameEngine.boss) {
      this.drawEnhancedBoss(gameEngine.boss);
    }
    
    // Render UI
    this.renderUI(gameEngine);
  }
  
  drawFlutterer(x, y, rotation, scale = 1, hasShield = false, flutterer = null) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation);
    this.ctx.scale(scale, scale);
    
    // Use flutterer colors if available
    const colors = flutterer?.colors || {
      body: '#8B4513',
      wing1: '#FF6B9D',
      wing2: '#FF8FA3',
      accent: '#FFFFFF'
    };
    
    // Shield effect
    if (hasShield) {
      this.ctx.strokeStyle = '#00FFFF';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 25, 0, Math.PI * 2);
      this.ctx.stroke();
    }
    
    // Legendary glow effect
    if (flutterer?.rarity === 'legendary' && flutterer.colors.glow) {
      this.ctx.shadowColor = flutterer.colors.glow;
      this.ctx.shadowBlur = 15;
    }
    
    // Butterfly body
    this.ctx.fillStyle = colors.body;
    this.ctx.fillRect(-2, -15, 4, 30);
    
    // Wings with rarity-based effects
    this.ctx.fillStyle = colors.wing1;
    
    // Upper wings
    this.ctx.beginPath();
    this.ctx.ellipse(-10, -8, 8, 12, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(10, -8, 8, 12, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Lower wings
    this.ctx.fillStyle = colors.wing2;
    this.ctx.beginPath();
    this.ctx.ellipse(-8, 5, 6, 8, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(8, 5, 6, 8, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Wing patterns
    this.ctx.fillStyle = colors.accent;
    this.ctx.beginPath();
    this.ctx.arc(-10, -8, 3, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.arc(10, -8, 3, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Reset shadow
    this.ctx.shadowBlur = 0;
    
    this.ctx.restore();
  }
  
  drawPlayerProjectile(projectile) {
    this.ctx.save();
    this.ctx.translate(projectile.x, projectile.y);
    
    this.ctx.fillStyle = projectile.color;
    this.ctx.shadowColor = projectile.color;
    this.ctx.shadowBlur = 8;
    
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, projectile.width/2, projectile.height/2, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }
  
  drawHomingProjectile(obstacle) {
    this.ctx.save();
    this.ctx.translate(obstacle.x, obstacle.y);
    this.ctx.rotate(obstacle.rotation);
    
    // Pulsing effect for homing projectiles
    const pulseScale = 1 + Math.sin(Date.now() * 0.01) * 0.2;
    this.ctx.scale(pulseScale, pulseScale);
    
    this.ctx.fillStyle = obstacle.color;
    this.ctx.shadowColor = obstacle.color;
    this.ctx.shadowBlur = 12;
    
    this.ctx.beginPath();
    this.ctx.arc(0, 0, obstacle.width / 2, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }
  
  drawRageBeam(obstacle) {
    this.ctx.save();
    
    this.ctx.fillStyle = obstacle.color;
    this.ctx.globalAlpha = 0.8;
    this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    
    // Add crackling energy effect
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2;
    this.ctx.globalAlpha = 0.6;
    
    for (let i = 0; i < 5; i++) {
      const y = obstacle.y + (i * obstacle.height / 5);
      this.ctx.beginPath();
      this.ctx.moveTo(obstacle.x, y);
      this.ctx.lineTo(obstacle.x + obstacle.width, y + (Math.random() - 0.5) * 20);
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }
  
  renderSpecialEffects(effects) {
    effects.forEach(effect => {
      this.ctx.save();
      this.ctx.globalAlpha = effect.alpha;
      
      switch (effect.type) {
        case 'power_up_collect':
          this.ctx.translate(effect.x, effect.y);
          this.ctx.scale(effect.scale, effect.scale);
          this.ctx.fillStyle = effect.color;
          this.ctx.font = 'bold 16px Arial';
          this.ctx.textAlign = 'center';
          this.ctx.fillText('+50', 0, 0);
          break;
          
        case 'explosion':
          this.ctx.translate(effect.x, effect.y);
          this.ctx.scale(effect.scale, effect.scale);
          this.ctx.fillStyle = '#FF6600';
          this.ctx.beginPath();
          this.ctx.arc(0, 0, 20, 0, Math.PI * 2);
          this.ctx.fill();
          break;
          
        case 'beam_warning':
          this.ctx.fillStyle = effect.color;
          this.ctx.globalAlpha = 0.3;
          this.ctx.fillRect(effect.x, effect.y, effect.width, effect.height);
          break;
          
        case 'screen_shake':
          // Screen shake is handled at the canvas level
          const shakeX = (Math.random() - 0.5) * effect.intensity * effect.alpha;
          const shakeY = (Math.random() - 0.5) * effect.intensity * effect.alpha;
          this.ctx.translate(shakeX, shakeY);
          break;
      }
      
      this.ctx.restore();
    });
  }
  
  drawButterfly(x, y, rotation, scale = 1, hasShield = false) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation);
    this.ctx.scale(scale, scale);
    
    // Shield effect
    if (hasShield) {
      this.ctx.strokeStyle = '#00FFFF';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 25, 0, Math.PI * 2);
      this.ctx.stroke();
    }
    
    // Butterfly body
    this.ctx.fillStyle = '#8B4513';
    this.ctx.fillRect(-2, -15, 4, 30);
    
    // Wings
    this.ctx.fillStyle = '#FF6B9D';
    
    // Upper wings
    this.ctx.beginPath();
    this.ctx.ellipse(-10, -8, 8, 12, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(10, -8, 8, 12, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Lower wings
    this.ctx.fillStyle = '#FF8FA3';
    this.ctx.beginPath();
    this.ctx.ellipse(-8, 5, 6, 8, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(8, 5, 6, 8, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Wing patterns
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.arc(-10, -8, 3, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.arc(10, -8, 3, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }
  
  drawObstacle(obstacle) {
    this.ctx.save();
    this.ctx.translate(obstacle.x, obstacle.y);
    this.ctx.rotate(obstacle.rotation);
    
    if (obstacle.type === 'asteroid') {
      // Draw asteroid
      this.ctx.fillStyle = '#8B7355';
      this.ctx.strokeStyle = '#A0522D';
      this.ctx.lineWidth = 2;
      
      this.ctx.beginPath();
      const sides = 8;
      for (let i = 0; i < sides; i++) {
        const angle = (i * Math.PI * 2) / sides;
        const radius = obstacle.width / 2 + Math.sin(angle * 3) * 3;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
    } else {
      // Draw hostile insect
      this.ctx.fillStyle = '#8B0000';
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, obstacle.width / 2, obstacle.height / 2, 0, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Insect features
      this.ctx.fillStyle = '#FF0000';
      this.ctx.beginPath();
      this.ctx.arc(-obstacle.width/4, -obstacle.height/4, 2, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.beginPath();
      this.ctx.arc(obstacle.width/4, -obstacle.height/4, 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }
  
  drawPowerUp(powerUp) {
    this.ctx.save();
    this.ctx.translate(powerUp.x, powerUp.y);
    this.ctx.rotate(powerUp.rotation);
    
    // Glow effect
    this.ctx.shadowColor = this.getPowerUpColor(powerUp.type);
    this.ctx.shadowBlur = 10;
    
    this.ctx.fillStyle = this.getPowerUpColor(powerUp.type);
    this.ctx.beginPath();
    this.ctx.arc(0, 0, powerUp.width / 2, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Power-up symbol
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 12px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.getPowerUpSymbol(powerUp.type), 0, 4);
    
    this.ctx.restore();
  }
  
  drawEnhancedBoss(boss) {
    this.ctx.save();
    this.ctx.translate(boss.x, boss.y);
    
    // Boss flashing when hit
    if (boss.invulnerable) {
      this.ctx.globalAlpha = 0.5;
    }
    
    // Phase-based visual changes
    let bossColor = '#4B0082';
    let eyeColor = '#FF0000';
    let tentacleColor = '#8B008B';
    
    switch (boss.phase) {
      case 2:
        bossColor = '#8B0000';
        eyeColor = '#FF4500';
        tentacleColor = '#B22222';
        break;
      case 3:
        bossColor = '#000000';
        eyeColor = '#FF0000';
        tentacleColor = '#DC143C';
        // Add rage aura
        this.ctx.shadowColor = '#FF0000';
        this.ctx.shadowBlur = 20;
        break;
    }
    
    // Boss body (large menacing insect)
    this.ctx.fillStyle = bossColor;
    this.ctx.strokeStyle = tentacleColor;
    this.ctx.lineWidth = 3;
    
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, boss.width / 2, boss.height / 2, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
    
    // Boss eyes with phase-based glow
    this.ctx.fillStyle = eyeColor;
    this.ctx.shadowColor = eyeColor;
    this.ctx.shadowBlur = boss.phase * 5;
    
    this.ctx.beginPath();
    this.ctx.arc(-boss.width/4, -boss.height/4, 8, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.arc(boss.width/4, -boss.height/4, 8, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Enhanced tentacles with wiggle animation
    this.ctx.shadowBlur = 0;
    this.ctx.strokeStyle = tentacleColor;
    this.ctx.lineWidth = 4;
    
    if (boss.tentacles) {
      boss.tentacles.forEach(tentacle => {
        const baseX = Math.cos(tentacle.angle) * boss.width / 3;
        const baseY = Math.sin(tentacle.angle) * boss.height / 3;
        const endX = Math.cos(tentacle.angle + Math.sin(tentacle.wiggleOffset) * 0.3) * tentacle.length;
        const endY = Math.sin(tentacle.angle + Math.sin(tentacle.wiggleOffset) * 0.3) * tentacle.length;
        
        this.ctx.beginPath();
        this.ctx.moveTo(baseX, baseY);
        this.ctx.quadraticCurveTo(
          baseX + endX * 0.5 + Math.sin(tentacle.wiggleOffset) * 10,
          baseY + endY * 0.5 + Math.cos(tentacle.wiggleOffset) * 10,
          baseX + endX,
          baseY + endY
        );
        this.ctx.stroke();
      });
    }
    
    // Boss health bar with phase colors
    const barWidth = boss.width;
    const barHeight = 8;
    const barY = -boss.height / 2 - 20;
    
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = '#FF0000';
    this.ctx.fillRect(-barWidth / 2, barY, barWidth, barHeight);
    
    // Health bar color based on phase
    const healthColors = ['#00FF00', '#FFFF00', '#FF4500'];
    this.ctx.fillStyle = healthColors[boss.phase - 1] || '#00FF00';
    const healthPercent = boss.health / boss.maxHealth;
    this.ctx.fillRect(-barWidth / 2, barY, barWidth * healthPercent, barHeight);
    
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(-barWidth / 2, barY, barWidth, barHeight);
    
    // Phase indicator
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 12px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`PHASE ${boss.phase}`, 0, barY - 10);
    
    this.ctx.restore();
  }
  
  drawBossProjectile(projectile) {
    this.ctx.save();
    this.ctx.translate(projectile.x, projectile.y);
    this.ctx.rotate(projectile.rotation);
    
    this.ctx.fillStyle = '#FF00FF';
    this.ctx.shadowColor = '#FF00FF';
    this.ctx.shadowBlur = 8;
    
    this.ctx.beginPath();
    this.ctx.arc(0, 0, projectile.width / 2, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }
  
  getPowerUpColor(type) {
    switch (type) {
      case 'speed': return '#00FF00';
      case 'shield': return '#00FFFF';
      case 'blaster': return '#FF4500';
      case 'health': return '#FF69B4';
      default: return '#FFD700';
    }
  }
  
  getPowerUpSymbol(type) {
    switch (type) {
      case 'speed': return '⚡';
      case 'shield': return '🛡';
      case 'blaster': return '💥';
      case 'health': return '❤';
      default: return '⭐';
    }
  }
  
  renderUI(gameEngine) {
    // Score
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 20px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${gameEngine.score}`, 20, 40);
    
    // Level
    this.ctx.fillText(`Level: ${gameEngine.currentLevel}`, 20, 70);
    
    // Lives
    this.ctx.fillText(`Lives: ${gameEngine.lives}`, 20, 100);
    
    // Level progress (for non-boss levels)
    if (!gameEngine.isBossLevel) {
      const progress = gameEngine.levelTime / gameEngine.levelDuration;
      const barWidth = 200;
      const barHeight = 10;
      const barX = this.canvas.width - barWidth - 20;
      const barY = 30;
      
      this.ctx.fillStyle = '#333333';
      this.ctx.fillRect(barX, barY, barWidth, barHeight);
      
      this.ctx.fillStyle = '#00FF00';
      this.ctx.fillRect(barX, barY, barWidth * progress, barHeight);
      
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(barX, barY, barWidth, barHeight);
      
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = '14px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Level Progress', barX + barWidth / 2, barY - 5);
    }
    
    // Power-up indicators
    let indicatorY = this.canvas.height - 100;
    
    if (gameEngine.player.hasShield) {
      this.ctx.fillStyle = '#00FFFF';
      this.ctx.fillRect(20, indicatorY, 30, 20);
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('SHIELD', 35, indicatorY + 14);
      indicatorY -= 30;
    }
    
    if (gameEngine.player.blasterMode) {
      this.ctx.fillStyle = '#FF4500';
      this.ctx.fillRect(20, indicatorY, 30, 20);
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('BLAST', 35, indicatorY + 14);
      indicatorY -= 30;
    }
    
    if (gameEngine.player.speedBoost) {
      this.ctx.fillStyle = '#00FF00';
      this.ctx.fillRect(20, indicatorY, 30, 20);
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('SPEED', 35, indicatorY + 14);
    }
  }
  
  renderGameOver(gameEngine) {
    // Semi-transparent overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Game Over text
    this.ctx.fillStyle = '#FF0000';
    this.ctx.font = 'bold 36px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 40);
    
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Final Score: ${gameEngine.score}`, this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.fillText(`Level Reached: ${gameEngine.currentLevel}`, this.canvas.width / 2, this.canvas.height / 2 + 30);
    
    this.ctx.font = '16px Arial';
    this.ctx.fillText('Tap or Click to Restart', this.canvas.width / 2, this.canvas.height / 2 + 80);
  }
  
  renderLevelComplete(gameEngine) {
    // Semi-transparent overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Level Complete text
    this.ctx.fillStyle = '#00FF00';
    this.ctx.font = 'bold 32px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('LEVEL COMPLETE!', this.canvas.width / 2, this.canvas.height / 2 - 20);
    
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = '18px Arial';
    this.ctx.fillText(`Next Level: ${gameEngine.currentLevel}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
  }
  
  renderGameComplete(gameEngine) {
    // Victory background
    this.ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#4B0082';
    this.ctx.font = 'bold 32px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('CONGRATULATIONS!', this.canvas.width / 2, this.canvas.height / 2 - 60);
    
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillText('You defeated the Mother Insect!', this.canvas.width / 2, this.canvas.height / 2 - 20);
    
    this.ctx.fillStyle = '#8B0000';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Final Score: ${gameEngine.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
    
    this.ctx.fillStyle = '#4B0082';
    this.ctx.font = '16px Arial';
    this.ctx.fillText('Tap or Click to Play Again', this.canvas.width / 2, this.canvas.height / 2 + 80);
  }
};