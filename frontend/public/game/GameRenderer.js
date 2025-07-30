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
    
    // Get flutterer-specific visual properties
    const visualProps = this.getFluttererVisualProperties(flutterer);
    
    // Animation timing
    const time = Date.now() * 0.01;
    const wingFlap = Math.sin(time * 0.8) * 0.3 + 0.7; // Wing flapping animation
    const bodyBob = Math.sin(time * 0.5) * 1; // Gentle body movement
    
    // Apply gentle floating animation
    this.ctx.translate(0, bodyBob);
    
    // Butterfly body - vary thickness and length based on flutterer
    this.ctx.fillStyle = colors.body;
    const bodyWidth = visualProps.bodyWidth;
    const bodyHeight = visualProps.bodyHeight;
    this.ctx.fillRect(-bodyWidth/2, -bodyHeight/2, bodyWidth, bodyHeight);
    
    // Add body segments for realism
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    for (let i = 0; i < 3; i++) {
      const segmentY = -bodyHeight/2 + (i + 1) * (bodyHeight/4);
      this.ctx.fillRect(-bodyWidth/2, segmentY, bodyWidth, 1);
    }
    
    // Wings with rarity and character-based variations + flutter animation
    this.drawEnhancedWings(colors, visualProps, flutterer, wingFlap);
    
    // Special effects based on flutterer type
    this.drawFluttererSpecialEffects(flutterer, visualProps);
    
    // Antennae with subtle movement
    this.ctx.strokeStyle = colors.body;
    this.ctx.lineWidth = 1;
    const antennaeSway = Math.sin(time * 0.7) * 0.1;
    
    this.ctx.beginPath();
    this.ctx.moveTo(-1, -bodyHeight/2);
    this.ctx.lineTo(-3 + antennaeSway, -bodyHeight/2 - 6);
    this.ctx.moveTo(1, -bodyHeight/2);
    this.ctx.lineTo(3 - antennaeSway, -bodyHeight/2 - 6);
    this.ctx.stroke();
    
    // Antennae tips
    this.ctx.fillStyle = colors.accent;
    this.ctx.beginPath();
    this.ctx.arc(-3 + antennaeSway, -bodyHeight/2 - 6, 1, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(3 - antennaeSway, -bodyHeight/2 - 6, 1, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Reset shadow
    this.ctx.shadowBlur = 0;
    
    this.ctx.restore();
  }
  
  getFluttererVisualProperties(flutterer) {
    if (!flutterer) {
      return {
        bodyWidth: 4,
        bodyHeight: 30,
        wingScale: 1,
        wingShape: 'standard',
        upperWingSize: { width: 8, height: 12 },
        lowerWingSize: { width: 6, height: 8 },
        pattern: 'simple',
        trailEffect: false,
        sparkles: false
      };
    }
    
    // Define unique visual properties for each flutterer
    const visualConfigs = {
      'basic_cosmic': {
        bodyWidth: 4, bodyHeight: 30, wingScale: 1, wingShape: 'standard',
        upperWingSize: { width: 8, height: 12 }, lowerWingSize: { width: 6, height: 8 },
        pattern: 'simple', trailEffect: false, sparkles: false
      },
      'stardust_dancer': {
        bodyWidth: 3, bodyHeight: 28, wingScale: 1.1, wingShape: 'elongated',
        upperWingSize: { width: 9, height: 14 }, lowerWingSize: { width: 7, height: 10 },
        pattern: 'sparkles', trailEffect: true, sparkles: true
      },
      'solar_glider': {
        bodyWidth: 5, bodyHeight: 32, wingScale: 1.2, wingShape: 'broad',
        upperWingSize: { width: 10, height: 11 }, lowerWingSize: { width: 8, height: 7 },
        pattern: 'radial', trailEffect: false, sparkles: false
      },
      'frost_wing': {
        bodyWidth: 4, bodyHeight: 30, wingScale: 1.1, wingShape: 'crystalline',
        upperWingSize: { width: 9, height: 13 }, lowerWingSize: { width: 6, height: 9 },
        pattern: 'frost', trailEffect: false, sparkles: true
      },
      'plasma_striker': {
        bodyWidth: 5, bodyHeight: 28, wingScale: 0.9, wingShape: 'angular',
        upperWingSize: { width: 7, height: 11 }, lowerWingSize: { width: 5, height: 7 },
        pattern: 'electric', trailEffect: false, sparkles: false
      },
      'void_phantom': {
        bodyWidth: 3, bodyHeight: 32, wingScale: 1.3, wingShape: 'ethereal',
        upperWingSize: { width: 10, height: 15 }, lowerWingSize: { width: 8, height: 11 },
        pattern: 'ghostly', trailEffect: true, sparkles: false
      },
      'epic_blaster_wing': {
        bodyWidth: 6, bodyHeight: 34, wingScale: 1.2, wingShape: 'armored',
        upperWingSize: { width: 10, height: 13 }, lowerWingSize: { width: 7, height: 9 },
        pattern: 'tech', trailEffect: false, sparkles: false
      },
      'cosmic_guardian': {
        bodyWidth: 6, bodyHeight: 36, wingScale: 1.4, wingShape: 'guardian',
        upperWingSize: { width: 12, height: 14 }, lowerWingSize: { width: 9, height: 10 },
        pattern: 'shield', trailEffect: false, sparkles: true
      },
      'legendary_nebula_guardian': {
        bodyWidth: 7, bodyHeight: 38, wingScale: 1.5, wingShape: 'majestic',
        upperWingSize: { width: 13, height: 16 }, lowerWingSize: { width: 10, height: 12 },
        pattern: 'legendary', trailEffect: true, sparkles: true
      },
      'speedy_cosmic_flutter': {
        bodyWidth: 3, bodyHeight: 26, wingScale: 0.8, wingShape: 'streamlined',
        upperWingSize: { width: 6, height: 10 }, lowerWingSize: { width: 4, height: 6 },
        pattern: 'speed', trailEffect: true, sparkles: false
      }
    };
    
    return visualConfigs[flutterer.id] || visualConfigs['basic_cosmic'];
  }
  
  drawEnhancedWings(colors, visualProps, flutterer, wingFlap = 1) {
    const { upperWingSize, lowerWingSize, wingShape, pattern } = visualProps;
    
    // Apply wing flapping animation
    this.ctx.save();
    this.ctx.scale(1, wingFlap);
    
    // Upper wings with shape variations
    this.ctx.fillStyle = colors.wing1;
    
    switch (wingShape) {
      case 'elongated':
        this.drawElongatedWings(upperWingSize, lowerWingSize, colors);
        break;
      case 'broad':
        this.drawBroadWings(upperWingSize, lowerWingSize, colors);
        break;
      case 'crystalline':
        this.drawCrystallineWings(upperWingSize, lowerWingSize, colors);
        break;
      case 'angular':
        this.drawAngularWings(upperWingSize, lowerWingSize, colors);
        break;
      case 'ethereal':
        this.drawEtherealWings(upperWingSize, lowerWingSize, colors);
        break;
      case 'armored':
        this.drawArmoredWings(upperWingSize, lowerWingSize, colors);
        break;
      case 'guardian':
        this.drawGuardianWings(upperWingSize, lowerWingSize, colors);
        break;
      case 'majestic':
        this.drawMajesticWings(upperWingSize, lowerWingSize, colors);
        break;
      case 'streamlined':
        this.drawStreamlinedWings(upperWingSize, lowerWingSize, colors);
        break;
      default:
        this.drawStandardWings(upperWingSize, lowerWingSize, colors);
    }
    
    this.ctx.restore();
    
    // Add wing patterns (outside the flap animation to keep them stable)
    this.drawWingPatterns(pattern, colors, visualProps, flutterer);
  }
  
  drawStandardWings(upperSize, lowerSize, colors) {
    // Standard elliptical wings
    this.ctx.fillStyle = colors.wing1;
    this.ctx.beginPath();
    this.ctx.ellipse(-10, -8, upperSize.width, upperSize.height, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(10, -8, upperSize.width, upperSize.height, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = colors.wing2;
    this.ctx.beginPath();
    this.ctx.ellipse(-8, 5, lowerSize.width, lowerSize.height, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(8, 5, lowerSize.width, lowerSize.height, 0, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  drawElongatedWings(upperSize, lowerSize, colors) {
    // Longer, more graceful wings
    this.ctx.fillStyle = colors.wing1;
    this.ctx.beginPath();
    this.ctx.ellipse(-12, -10, upperSize.width, upperSize.height, -0.2, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(12, -10, upperSize.width, upperSize.height, 0.2, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = colors.wing2;
    this.ctx.beginPath();
    this.ctx.ellipse(-10, 6, lowerSize.width, lowerSize.height, -0.1, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(10, 6, lowerSize.width, lowerSize.height, 0.1, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  drawBroadWings(upperSize, lowerSize, colors) {
    // Broader, more powerful wings
    this.ctx.fillStyle = colors.wing1;
    this.ctx.beginPath();
    this.ctx.ellipse(-11, -6, upperSize.width, upperSize.height, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(11, -6, upperSize.width, upperSize.height, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = colors.wing2;
    this.ctx.beginPath();
    this.ctx.ellipse(-9, 4, lowerSize.width, lowerSize.height, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(9, 4, lowerSize.width, lowerSize.height, 0, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  drawCrystallineWings(upperSize, lowerSize, colors) {
    // Angular, crystalline wings
    this.drawAngularShape(-10, -8, upperSize.width, upperSize.height, colors.wing1, 6);
    this.drawAngularShape(10, -8, upperSize.width, upperSize.height, colors.wing1, 6);
    this.drawAngularShape(-8, 5, lowerSize.width, lowerSize.height, colors.wing2, 5);
    this.drawAngularShape(8, 5, lowerSize.width, lowerSize.height, colors.wing2, 5);
  }
  
  drawAngularWings(upperSize, lowerSize, colors) {
    // Sharp, aggressive wings
    this.drawTriangularWing(-10, -8, upperSize.width, upperSize.height, colors.wing1, 'left');
    this.drawTriangularWing(10, -8, upperSize.width, upperSize.height, colors.wing1, 'right');
    this.drawTriangularWing(-8, 5, lowerSize.width, lowerSize.height, colors.wing2, 'left');
    this.drawTriangularWing(8, 5, lowerSize.width, lowerSize.height, colors.wing2, 'right');
  }
  
  drawEtherealWings(upperSize, lowerSize, colors) {
    // Ghostly, semi-transparent wings
    this.ctx.globalAlpha = 0.7;
    this.ctx.fillStyle = colors.wing1;
    this.ctx.beginPath();
    this.ctx.ellipse(-12, -9, upperSize.width, upperSize.height, -0.3, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(12, -9, upperSize.width, upperSize.height, 0.3, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = colors.wing2;
    this.ctx.beginPath();
    this.ctx.ellipse(-10, 7, lowerSize.width, lowerSize.height, -0.2, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(10, 7, lowerSize.width, lowerSize.height, 0.2, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.globalAlpha = 1.0;
  }
  
  drawArmoredWings(upperSize, lowerSize, colors) {
    // Mechanical, armored wings
    this.drawRectangularWing(-10, -8, upperSize.width, upperSize.height, colors.wing1);
    this.drawRectangularWing(10, -8, upperSize.width, upperSize.height, colors.wing1);
    this.drawRectangularWing(-8, 5, lowerSize.width, lowerSize.height, colors.wing2);
    this.drawRectangularWing(8, 5, lowerSize.width, lowerSize.height, colors.wing2);
  }
  
  drawGuardianWings(upperSize, lowerSize, colors) {
    // Large, protective wings
    this.ctx.fillStyle = colors.wing1;
    this.ctx.beginPath();
    this.ctx.ellipse(-13, -7, upperSize.width, upperSize.height, -0.1, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(13, -7, upperSize.width, upperSize.height, 0.1, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = colors.wing2;
    this.ctx.beginPath();
    this.ctx.ellipse(-11, 4, lowerSize.width, lowerSize.height, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(11, 4, lowerSize.width, lowerSize.height, 0, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  drawMajesticWings(upperSize, lowerSize, colors) {
    // Royal, elaborate wings
    this.ctx.fillStyle = colors.wing1;
    this.ctx.beginPath();
    this.ctx.ellipse(-14, -9, upperSize.width, upperSize.height, -0.15, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(14, -9, upperSize.width, upperSize.height, 0.15, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = colors.wing2;
    this.ctx.beginPath();
    this.ctx.ellipse(-12, 3, lowerSize.width, lowerSize.height, -0.1, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(12, 3, lowerSize.width, lowerSize.height, 0.1, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  drawStreamlinedWings(upperSize, lowerSize, colors) {
    // Sleek, speed-focused wings
    this.ctx.fillStyle = colors.wing1;
    this.ctx.beginPath();
    this.ctx.ellipse(-8, -6, upperSize.width, upperSize.height, -0.4, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(8, -6, upperSize.width, upperSize.height, 0.4, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = colors.wing2;
    this.ctx.beginPath();
    this.ctx.ellipse(-6, 3, lowerSize.width, lowerSize.height, -0.3, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(6, 3, lowerSize.width, lowerSize.height, 0.3, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  drawAngularShape(x, y, width, height, color, sides) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    
    for (let i = 0; i < sides; i++) {
      const angle = (i * Math.PI * 2) / sides;
      const px = x + Math.cos(angle) * width;
      const py = y + Math.sin(angle) * height;
      
      if (i === 0) {
        this.ctx.moveTo(px, py);
      } else {
        this.ctx.lineTo(px, py);
      }
    }
    
    this.ctx.closePath();
    this.ctx.fill();
  }
  
  drawTriangularWing(x, y, width, height, color, side) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    
    if (side === 'left') {
      this.ctx.moveTo(x + width/2, y - height);
      this.ctx.lineTo(x - width, y);
      this.ctx.lineTo(x + width/2, y + height);
    } else {
      this.ctx.moveTo(x - width/2, y - height);
      this.ctx.lineTo(x + width, y);
      this.ctx.lineTo(x - width/2, y + height);
    }
    
    this.ctx.closePath();
    this.ctx.fill();
  }
  
  drawRectangularWing(x, y, width, height, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x - width/2, y - height/2, width, height);
    
    // Add metallic border
    this.ctx.strokeStyle = '#C0C0C0';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x - width/2, y - height/2, width, height);
  }
  
  drawWingPatterns(pattern, colors, visualProps, flutterer) {
    switch (pattern) {
      case 'sparkles':
        this.drawSparklePattern(colors);
        break;
      case 'radial':
        this.drawRadialPattern(colors);
        break;
      case 'frost':
        this.drawFrostPattern(colors);
        break;
      case 'electric':
        this.drawElectricPattern(colors);
        break;
      case 'ghostly':
        this.drawGhostlyPattern(colors);
        break;
      case 'tech':
        this.drawTechPattern(colors);
        break;
      case 'shield':
        this.drawShieldPattern(colors);
        break;
      case 'legendary':
        this.drawLegendaryPattern(colors, flutterer);
        break;
      case 'speed':
        this.drawSpeedPattern(colors);
        break;
      default:
        this.drawSimplePattern(colors);
    }
  }
  
  drawSimplePattern(colors) {
    // Simple wing spots
    this.ctx.fillStyle = colors.accent;
    this.ctx.beginPath();
    this.ctx.arc(-10, -8, 3, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.arc(10, -8, 3, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  drawSparklePattern(colors) {
    this.ctx.fillStyle = colors.accent;
    for (let i = 0; i < 6; i++) {
      const x = -15 + (i % 2) * 30 + (Math.random() - 0.5) * 8;
      const y = -12 + Math.floor(i / 2) * 8 + (Math.random() - 0.5) * 4;
      const size = 1 + Math.random() * 2;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  drawRadialPattern(colors) {
    this.ctx.strokeStyle = colors.accent;
    this.ctx.lineWidth = 1;
    
    // Left wing radial lines
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(-10, -8);
      this.ctx.lineTo(-10 - 6 + i * 2, -8 - 8 + i * 4);
      this.ctx.stroke();
    }
    
    // Right wing radial lines
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(10, -8);
      this.ctx.lineTo(10 + 6 - i * 2, -8 - 8 + i * 4);
      this.ctx.stroke();
    }
  }
  
  drawFrostPattern(colors) {
    this.ctx.strokeStyle = colors.accent;
    this.ctx.lineWidth = 1;
    
    // Crystalline frost patterns
    const positions = [[-10, -8], [10, -8], [-8, 5], [8, 5]];
    positions.forEach(([x, y]) => {
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + Math.cos(angle) * 4, y + Math.sin(angle) * 4);
        this.ctx.stroke();
      }
    });
  }
  
  drawElectricPattern(colors) {
    this.ctx.strokeStyle = colors.accent;
    this.ctx.lineWidth = 2;
    
    // Electric zigzag patterns
    this.ctx.beginPath();
    this.ctx.moveTo(-12, -10);
    this.ctx.lineTo(-8, -6);
    this.ctx.lineTo(-14, -4);
    this.ctx.lineTo(-6, -2);
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.moveTo(12, -10);
    this.ctx.lineTo(8, -6);
    this.ctx.lineTo(14, -4);
    this.ctx.lineTo(6, -2);
    this.ctx.stroke();
  }
  
  drawGhostlyPattern(colors) {
    this.ctx.globalAlpha = 0.3;
    this.ctx.fillStyle = colors.accent;
    
    // Ethereal wispy effects
    for (let i = 0; i < 8; i++) {
      const x = -15 + Math.random() * 30;
      const y = -15 + Math.random() * 25;
      const size = 2 + Math.random() * 3;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.globalAlpha = 1.0;
  }
  
  drawTechPattern(colors) {
    this.ctx.strokeStyle = colors.accent;
    this.ctx.lineWidth = 1;
    
    // Tech circuit patterns
    this.ctx.strokeRect(-12, -10, 4, 4);
    this.ctx.strokeRect(8, -10, 4, 4);
    this.ctx.strokeRect(-10, 3, 3, 3);
    this.ctx.strokeRect(7, 3, 3, 3);
    
    // Connection lines
    this.ctx.beginPath();
    this.ctx.moveTo(-10, -8);
    this.ctx.lineTo(-8, -6);
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.moveTo(10, -8);
    this.ctx.lineTo(8, -6);
    this.ctx.stroke();
  }
  
  drawShieldPattern(colors) {
    this.ctx.strokeStyle = colors.accent;
    this.ctx.lineWidth = 2;
    
    // Shield-like geometric patterns
    this.ctx.beginPath();
    this.ctx.arc(-10, -8, 5, 0, Math.PI * 2);
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.arc(10, -8, 5, 0, Math.PI * 2);
    this.ctx.stroke();
    
    // Cross pattern inside
    this.ctx.beginPath();
    this.ctx.moveTo(-12, -8);
    this.ctx.lineTo(-8, -8);
    this.ctx.moveTo(-10, -10);
    this.ctx.lineTo(-10, -6);
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.moveTo(8, -8);
    this.ctx.lineTo(12, -8);
    this.ctx.moveTo(10, -10);
    this.ctx.lineTo(10, -6);
    this.ctx.stroke();
  }
  
  drawLegendaryPattern(colors, flutterer) {
    // Multi-layered legendary effects
    if (flutterer?.colors?.glow) {
      this.ctx.shadowColor = flutterer.colors.glow;
      this.ctx.shadowBlur = 8;
    }
    
    this.ctx.fillStyle = colors.accent;
    
    // Ornate patterns
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;
      const radius = 6 + Math.sin(Date.now() * 0.005 + i) * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y - 8, 1, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.shadowBlur = 0;
  }
  
  drawSpeedPattern(colors) {
    this.ctx.strokeStyle = colors.accent;
    this.ctx.lineWidth = 2;
    
    // Speed lines/streaks
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(-15 + i * 2, -12 + i * 3);
      this.ctx.lineTo(-8 + i * 2, -8 + i * 3);
      this.ctx.stroke();
      
      this.ctx.beginPath();
      this.ctx.moveTo(15 - i * 2, -12 + i * 3);
      this.ctx.lineTo(8 - i * 2, -8 + i * 3);
      this.ctx.stroke();
    }
  }
  
  drawFluttererSpecialEffects(flutterer, visualProps) {
    if (!flutterer) return;
    
    const time = Date.now() * 0.003;
    
    // Trail effects for certain flutterers
    if (visualProps.trailEffect) {
      this.ctx.globalAlpha = 0.5;
      this.ctx.fillStyle = flutterer.colors.wing1;
      
      for (let i = 0; i < 3; i++) {
        const offsetY = 15 + i * 8;
        const size = 3 - i;
        this.ctx.beginPath();
        this.ctx.arc(0, offsetY, size, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      this.ctx.globalAlpha = 1.0;
    }
    
    // Sparkle effects
    if (visualProps.sparkles) {
      this.ctx.fillStyle = '#FFFFFF';
      
      for (let i = 0; i < 4; i++) {
        const x = Math.sin(time + i) * 20;
        const y = Math.cos(time * 1.5 + i) * 15;
        const alpha = Math.sin(time * 3 + i) * 0.5 + 0.5;
        
        this.ctx.globalAlpha = alpha;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 1, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      this.ctx.globalAlpha = 1.0;
    }
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
    this.ctx.translate(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2);
    
    if (obstacle.type === 'asteroid') {
      this.drawEnhancedAsteroid(obstacle);
    } else if (obstacle.type === 'insect') {
      this.drawEnhancedInsect(obstacle);
    } else {
      // Fallback for other obstacle types
      this.drawBasicObstacle(obstacle);
    }
    
    this.ctx.restore();
  }
  
  drawEnhancedAsteroid(obstacle) {
    const time = Date.now() * 0.001;
    const size = Math.min(obstacle.width, obstacle.height) / 2;
    
    // Rotating asteroid with multiple layers
    this.ctx.rotate(time * 0.5 + obstacle.rotation);
    
    // Main asteroid body with rough edges
    this.ctx.fillStyle = '#8B4513';
    this.ctx.beginPath();
    
    // Create irregular asteroid shape
    const points = 8;
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const variance = 0.7 + Math.sin(angle * 3) * 0.3; // Irregular shape
      const radius = size * variance;
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
    
    // Add metallic highlights
    this.ctx.strokeStyle = '#CD853F';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    
    // Glowing core
    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.6);
    gradient.addColorStop(0, 'rgba(255, 140, 0, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 69, 0, 0.4)');
    gradient.addColorStop(1, 'rgba(139, 69, 19, 0.1)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Sparkle effects
    for (let i = 0; i < 3; i++) {
      const sparkleAngle = time * 2 + i * Math.PI * 0.67;
      const sparkleRadius = size * 0.8;
      const sparkleX = Math.cos(sparkleAngle) * sparkleRadius;
      const sparkleY = Math.sin(sparkleAngle) * sparkleRadius;
      
      this.ctx.fillStyle = `rgba(255, 255, 255, ${0.8 + Math.sin(time * 4 + i) * 0.2})`;
      this.ctx.beginPath();
      this.ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  drawEnhancedInsect(obstacle) {
    const time = Date.now() * 0.003;
    const size = Math.min(obstacle.width, obstacle.height) / 2;
    
    // Floating insect with wing animation
    const hover = Math.sin(time * 4) * 3;
    this.ctx.translate(0, hover);
    
    // Insect body - segmented
    this.ctx.fillStyle = '#8B0000';
    
    // Head
    this.ctx.beginPath();
    this.ctx.ellipse(0, -size * 0.7, size * 0.3, size * 0.4, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Thorax
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, size * 0.4, size * 0.6, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Abdomen
    this.ctx.beginPath();
    this.ctx.ellipse(0, size * 0.5, size * 0.35, size * 0.7, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Animated wings
    const wingFlap = Math.sin(time * 20) * 0.3 + 0.7; // Fast wing flapping
    
    this.ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
    
    // Left wing
    this.ctx.save();
    this.ctx.scale(wingFlap, 1);
    this.ctx.beginPath();
    this.ctx.ellipse(-size * 0.6, -size * 0.2, size * 0.4, size * 0.8, -0.3, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
    
    // Right wing
    this.ctx.save();
    this.ctx.scale(wingFlap, 1);
    this.ctx.beginPath();
    this.ctx.ellipse(size * 0.6, -size * 0.2, size * 0.4, size * 0.8, 0.3, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
    
    // Glowing eyes
    this.ctx.fillStyle = '#FF4500';
    this.ctx.beginPath();
    this.ctx.arc(-size * 0.15, -size * 0.7, 3, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.arc(size * 0.15, -size * 0.7, 3, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Antennae
    this.ctx.strokeStyle = '#8B0000';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(-size * 0.1, -size * 0.9);
    this.ctx.lineTo(-size * 0.2, -size * 1.2);
    this.ctx.moveTo(size * 0.1, -size * 0.9);
    this.ctx.lineTo(size * 0.2, -size * 1.2);
    this.ctx.stroke();
    
    // Menacing aura
    this.ctx.strokeStyle = `rgba(255, 0, 0, ${0.3 + Math.sin(time * 6) * 0.2})`;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size * 1.2, 0, Math.PI * 2);
    this.ctx.stroke();
  }
  
  drawBasicObstacle(obstacle) {
    // Fallback rendering for other obstacle types
    const size = Math.min(obstacle.width, obstacle.height) / 2;
    
    this.ctx.fillStyle = obstacle.color || '#666';
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.strokeStyle = '#999';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
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