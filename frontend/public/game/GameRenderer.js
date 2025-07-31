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
    
    // Always render UI elements on top
    if (gameEngine.gameState === 'playing' || gameEngine.gameState === 'paused') {
      this.renderUI(gameEngine);
    }
    
    // Render enhanced effects and indicators
    if (gameEngine.screenEffects) {
      gameEngine.screenEffects.renderEffects(this.ctx, this.canvas);
    }
    
    if (gameEngine.mobileInput) {
      gameEngine.mobileInput.renderTouchIndicator(this.ctx);
    }
    
    // Performance stats disabled for clean UI
    // if (gameEngine.performanceOptimized) {
    //   this.renderPerformanceStats(gameEngine);
    // }
  }
  
  renderEnhancedBackground(level, levelConfig = null) {
    // Enhanced background rendering with level-specific themes
    const gameEngine = window.gameEngine;
    const config = levelConfig || (gameEngine ? gameEngine.getLevelConfig(level) : null);
    
    // FORCE DEBUG: Ensure we have config and log it
    console.log(`🎨 renderEnhancedBackground for Level ${level}:`, config);
    
    // Use level-specific background color if available, with more dramatic defaults
    let backgroundColor = '#001122'; // Default
    let accentColor = '#4A90E2'; // Default
    
    if (config) {
      backgroundColor = config.backgroundColor;
      accentColor = config.accentColor;
      console.log(`🎨 Using level colors - BG: ${backgroundColor}, Accent: ${accentColor}`);
    } else {
      console.warn(`🎨 No level config found for level ${level}, using defaults`);
    }
    
    // FORCE VARIETY: Make sure different levels have dramatically different backgrounds
    if (level === 1) {
      backgroundColor = '#001122'; // Dark blue
      accentColor = '#4A90E2'; // Blue
    } else if (level === 2) {
      backgroundColor = '#0D1B2A'; // Calm deep navy - much more soothing
      accentColor = '#7DD3FC'; // Soft sky blue - very calming
    } else if (level === 3) {
      backgroundColor = '#220011'; // Dark magenta
      accentColor = '#FF6B9D'; // Pink
    } else if (level >= 4) {
      // Use config colors for higher levels
      backgroundColor = config?.backgroundColor || '#112200';
      accentColor = config?.accentColor || '#FFAA00';
    }
    
    console.log(`🎨 FINAL colors for Level ${level} - BG: ${backgroundColor}, Accent: ${accentColor}`);
    
    // Create gradient with level-specific colors
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    gradient.addColorStop(0, backgroundColor);
    gradient.addColorStop(0.5, this.adjustBrightness(backgroundColor, 1.2));
    gradient.addColorStop(1, accentColor + '20'); // Add transparency
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render enhanced star field with level-specific colors
    this.renderEnhancedStars(accentColor);
    
    // Add level-specific visual effects
    this.renderLevelVisualEffects(level, { backgroundColor, accentColor, theme: config?.theme });
  }
  
  // Render stars with level-specific accent colors
  renderEnhancedStars(accentColor = '#FFFFFF') {
    this.ctx.save();
    const time = Date.now() * 0.001;
    
    // Generate pseudo-random star positions
    for (let i = 0; i < 50; i++) {
      const x = (i * 123 + time * 10) % this.canvas.width;
      const y = (i * 456 + time * 5) % this.canvas.height;
      const twinkle = Math.sin(time * 2 + i) * 0.5 + 0.5;
      
      this.ctx.fillStyle = accentColor + Math.floor(twinkle * 255).toString(16).padStart(2, '0');
      this.ctx.fillRect(x, y, 2, 2);
    }
    
    this.ctx.restore();
  }
  
  // Render level-specific visual effects
  renderLevelVisualEffects(level, config) {
    const { backgroundColor, accentColor, theme } = config;
    const time = Date.now() * 0.001;
    
    // Add theme-specific atmospheric effects
    switch (theme) {
      case 'aurora':
        this.renderAuroraEffect(accentColor, time);
        break;
      case 'galaxy':
        this.renderGalaxyEffect(accentColor, time);
        break;
      case 'nebula':
        this.renderNebulaEffect(accentColor, time);
        break;
      case 'plasma':
        this.renderPlasmaEffect(accentColor, time);
        break;
      case 'solar':
        this.renderSolarEffect(accentColor, time);
        break;
      case 'void':
        this.renderVoidEffect(accentColor, time);
        break;
      case 'storm':
        this.renderStormEffect(accentColor, time);
        break;
      default:
        // Default starfield effect
        break;
    }
  }
  
  // Individual theme effect renderers
  renderAuroraEffect(accentColor, time) {
    this.ctx.save();
    this.ctx.globalAlpha = 0.3;
    
    // Flowing aurora waves
    for (let i = 0; i < 3; i++) {
      const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.5, accentColor + '40');
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = gradient;
      const waveY = this.canvas.height * (0.2 + i * 0.3) + Math.sin(time + i) * 50;
      this.ctx.fillRect(0, waveY, this.canvas.width, 30);
    }
    
    this.ctx.restore();
  }
  
  renderGalaxyEffect(accentColor, time) {
    this.ctx.save();
    this.ctx.globalAlpha = 0.4;
    
    // Spiral galaxy arms
    this.ctx.strokeStyle = accentColor + '60';
    this.ctx.lineWidth = 2;
    
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    for (let arm = 0; arm < 2; arm++) {
      this.ctx.beginPath();
      for (let i = 0; i < 100; i++) {
        const angle = (i * 0.1) + time * 0.5 + (arm * Math.PI);
        const radius = i * 3;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        if (i === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }
  
  renderNebulaEffect(accentColor, time) {
    this.ctx.save();
    this.ctx.globalAlpha = 0.2;
    
    // Flowing nebula clouds
    for (let i = 0; i < 5; i++) {
      const x = (Math.sin(time * 0.5 + i) * this.canvas.width * 0.3) + this.canvas.width / 2;
      const y = (Math.cos(time * 0.3 + i) * this.canvas.height * 0.3) + this.canvas.height / 2;
      const size = 100 + Math.sin(time + i) * 30;
      
      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, accentColor + '40');
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }
  
  renderPlasmaEffect(accentColor, time) {
    this.ctx.save();
    this.ctx.globalAlpha = 0.3;
    this.ctx.strokeStyle = accentColor;
    this.ctx.lineWidth = 1;
    
    // Plasma energy grid
    const gridSize = 50;
    for (let x = 0; x < this.canvas.width; x += gridSize) {
      for (let y = 0; y < this.canvas.height; y += gridSize) {
        const intensity = Math.sin(time * 2 + x * 0.01 + y * 0.01) * 0.5 + 0.5;
        this.ctx.globalAlpha = intensity * 0.2;
        
        this.ctx.beginPath();
        this.ctx.rect(x, y, gridSize, gridSize);
        this.ctx.stroke();
      }
    }
    
    this.ctx.restore();
  }
  
  renderSolarEffect(accentColor, time) {
    this.ctx.save();
    
    // Solar flares from edges
    this.ctx.strokeStyle = '#FFA500';
    this.ctx.lineWidth = 2;
    this.ctx.shadowColor = '#FF4500';
    this.ctx.shadowBlur = 5;
    
    for (let i = 0; i < 4; i++) {
      if (Math.sin(time * 8 + i * 2) > 0.5) {
        const startX = i < 2 ? 0 : this.canvas.width;
        const startY = Math.random() * this.canvas.height;
        const endX = startX + (i < 2 ? 100 : -100);
        const endY = startY + (Math.random() - 0.5) * 200;
        
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
      }
    }
    
    this.ctx.restore();
  }
  
  renderVoidEffect(accentColor, time) {
    this.ctx.save();
    
    // Dark void distortions
    this.ctx.globalAlpha = 0.1;
    this.ctx.fillStyle = '#000000';
    
    for (let i = 0; i < 8; i++) {
      const x = Math.sin(time * 2 + i) * this.canvas.width * 0.3 + this.canvas.width / 2;
      const y = Math.cos(time * 1.5 + i) * this.canvas.height * 0.3 + this.canvas.height / 2;
      const size = 50 + Math.sin(time * 3 + i) * 20;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }
  
  renderStormEffect(accentColor, time) {
    this.ctx.save();
    
    // Lightning flashes
    if (Math.sin(time * 12) > 0.8) {
      this.ctx.globalAlpha = 0.1;
      this.ctx.fillStyle = '#FFD700';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    // Rain effect
    this.ctx.strokeStyle = accentColor + '40';
    this.ctx.lineWidth = 1;
    
    for (let i = 0; i < 50; i++) {
      const x = (i * 20 + time * 200) % this.canvas.width;
      const y = (time * 300 + i * 10) % this.canvas.height;
      
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x - 5, y + 15);
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }
  
  // Helper function to adjust color brightness
  adjustBrightness(color, factor) {
    const hex = color.replace('#', '');
    const r = Math.min(255, Math.floor(parseInt(hex.substr(0, 2), 16) * factor));
    const g = Math.min(255, Math.floor(parseInt(hex.substr(2, 2), 16) * factor));
    const b = Math.min(255, Math.floor(parseInt(hex.substr(4, 2), 16) * factor));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
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

  // Basic obstacle fallback rendering
  drawBasicObstacle(obstacle) {
    const size = Math.min(obstacle.width, obstacle.height) / 2;
    const time = Date.now() * 0.001;
    
    this.ctx.rotate(obstacle.rotation + time * 0.5);
    
    // DEBUGGING: Log when we fall back to basic
    console.log(`⚠️ Using basic obstacle fallback for type: ${obstacle.type}`);
    
    // Simple colorful obstacle - but make it more distinctive
    this.ctx.fillStyle = '#FF6B9D';
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2;
    
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
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
    // Render level-specific background first
    if (gameEngine && gameEngine.currentLevel) {
      // Get level config and pass it explicitly
      const levelConfig = gameEngine.levelConfig || gameEngine.getLevelConfig(gameEngine.currentLevel);
      this.renderEnhancedBackground(gameEngine.currentLevel, levelConfig);
    }
    
    // Apply screen shake effects
    this.ctx.save();
    if (gameEngine.screenEffects) {
      gameEngine.screenEffects.applyShake(this.ctx);
    }
    
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
    
    // Render power-ups with enhanced glow effect
    gameEngine.powerUps.forEach(powerUp => {
      this.drawEnhancedPowerUp(powerUp);
    });
    
    // Render player projectiles
    gameEngine.projectiles.forEach(projectile => {
      if (projectile.type === 'player') {
        this.drawPlayerProjectile(projectile);
      }
    });
    
    // Render original particles with enhanced effects
    gameEngine.particles.forEach(particle => {
      this.ctx.globalAlpha = particle.alpha;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size || 3, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    // Render enhanced particle system
    if (gameEngine.particleSystem) {
      gameEngine.particleSystem.render(this.ctx);
    }
    
    this.ctx.globalAlpha = 1;
    
    // Restore context after shake effects
    this.ctx.restore();
    
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
        sparkles: false,
        glow: false
      };
    }
    
    // Use visualProps from flutterer data if available
    const visualProps = flutterer.visualProps || {};
    const size = visualProps.size || 1.0;
    
    return {
      bodyWidth: Math.floor(4 * size),
      bodyHeight: Math.floor(30 * size),
      wingScale: size,
      wingShape: visualProps.wingShape || 'standard',
      upperWingSize: { 
        width: Math.floor(8 * size), 
        height: Math.floor(12 * size) 
      },
      lowerWingSize: { 
        width: Math.floor(6 * size), 
        height: Math.floor(8 * size) 
      },
      pattern: visualProps.wingPattern || 'simple',
      trailEffect: visualProps.trailEffect || false,
      sparkles: visualProps.sparkles || false,
      glow: visualProps.glow || false
    };
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
    
    // Enhanced projectile rendering based on shot type
    switch (projectile.shotType) {
      case 'single':
        this.drawSingleShot(projectile);
        break;
      case 'dual':
        this.drawDualShot(projectile);
        break;
      case 'laser':
        this.drawLaserBeam(projectile);
        break;
      default:
        this.drawBasicProjectile(projectile);
    }
    
    this.ctx.restore();
  }
  
  drawSingleShot(projectile) {
    // Basic energy projectile
    this.ctx.fillStyle = projectile.color;
    this.ctx.shadowColor = projectile.color;
    this.ctx.shadowBlur = 10;
    
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, projectile.width/2, projectile.height/2, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Add energy core
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, projectile.width/4, projectile.height/4, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.shadowBlur = 0;
  }
  
  drawDualShot(projectile) {
    // Smaller dual projectiles
    this.ctx.fillStyle = projectile.color;
    this.ctx.shadowColor = projectile.color;
    this.ctx.shadowBlur = 8;
    
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, projectile.width/2, projectile.height/2, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Twin sparkle effect
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.ellipse(-1, 0, 1, 2, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.ellipse(1, 0, 1, 2, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.shadowBlur = 0;
  }
  
  drawLaserBeam(projectile) {
    // Powerful laser beam
    const time = Date.now() * 0.01;
    
    // Outer glow
    this.ctx.strokeStyle = projectile.color;
    this.ctx.lineWidth = projectile.width + 4;
    this.ctx.shadowColor = projectile.color;
    this.ctx.shadowBlur = 15;
    
    this.ctx.beginPath();
    this.ctx.moveTo(0, -projectile.height/2);
    this.ctx.lineTo(0, projectile.height/2);
    this.ctx.stroke();
    
    // Inner beam
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = projectile.width/2;
    this.ctx.shadowBlur = 5;
    
    this.ctx.beginPath();
    this.ctx.moveTo(0, -projectile.height/2);
    this.ctx.lineTo(0, projectile.height/2);
    this.ctx.stroke();
    
    // Pulsing core
    const pulse = Math.sin(time * 0.5) * 0.3 + 0.7;
    this.ctx.strokeStyle = `rgba(255, 255, 255, ${pulse})`;
    this.ctx.lineWidth = 2;
    
    this.ctx.beginPath();
    this.ctx.moveTo(0, -projectile.height/2);
    this.ctx.lineTo(0, projectile.height/2);
    this.ctx.stroke();
    
    this.ctx.shadowBlur = 0;
  }
  
  drawBasicProjectile(projectile) {
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
          
        case 'floating_text':
          this.ctx.translate(effect.x, effect.y);
          this.ctx.fillStyle = effect.color;
          this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
          this.ctx.lineWidth = 3;
          this.ctx.font = 'bold 14px Arial';
          this.ctx.textAlign = 'center';
          // Outline for readability
          this.ctx.strokeText(effect.text, 0, 0);
          this.ctx.fillText(effect.text, 0, 0);
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
    
    // Get current level config for obstacle styling
    const gameEngine = window.gameEngine;
    const levelConfig = gameEngine ? gameEngine.getLevelConfig(gameEngine.currentLevel) : null;
    const accentColor = levelConfig?.accentColor || '#FFFFFF';
    
    // FORCE TEST: Make all obstacles use level-specific rendering
    console.log(`Drawing obstacle type: ${obstacle.type} for level ${gameEngine?.currentLevel}`);
    this.drawLevelSpecificObstacle(obstacle, levelConfig);
    
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
  
  drawLevelSpecificObstacle(obstacle, levelConfig) {
    const time = Date.now() * 0.001;
    const size = Math.min(obstacle.width, obstacle.height) / 2;
    const theme = levelConfig?.theme || 'starfield';
    const accentColor = levelConfig?.accentColor || '#FFFFFF';
    
    // USE THE OBSTACLE TYPE THAT WAS ALREADY SET IN spawnObstacle()
    const obstacleType = obstacle.type;
    
    console.log(`🎨 Drawing obstacle type: ${obstacleType} (from obstacle.type)`);
    
    this.ctx.rotate(obstacle.rotation + time * 0.5);
    
    // Add error handling to prevent runtime crashes
    try {
      switch (obstacleType) {
        case 'crystal':
        case 'ice':
          this.drawCrystalObstacle(obstacle, size, accentColor, time);
          break;
        case 'spiral':
        case 'vortex':
          this.drawSpiralObstacle(obstacle, size, accentColor, time);
          break;
        case 'cloud':
        case 'gas':
          this.drawGasCloudObstacle(obstacle, size, accentColor, time);
          break;
        case 'energy':
        case 'beam':
          this.drawEnergyObstacle(obstacle, size, accentColor, time);
          break;
        case 'shard':
        case 'prism':
          this.drawPrismObstacle(obstacle, size, accentColor, time);
          break;
        case 'flare':
        case 'corona':
          this.drawSolarObstacle(obstacle, size, accentColor, time);
          break;
        case 'particle':
        case 'wave':
          this.drawQuantumObstacle(obstacle, size, accentColor, time);
          break;
        case 'spore':
        case 'virus':
          this.drawBioObstacle(obstacle, size, accentColor, time);
          break;
        case 'lava':
        case 'magma':
          this.drawVolcanicObstacle(obstacle, size, accentColor, time);
          break;
        case 'shadow':
        case 'void':
          this.drawVoidObstacle(obstacle, size, accentColor, time);
          break;
        case 'lightning':
        case 'thunder':
          this.drawStormObstacle(obstacle, size, accentColor, time);
          break;
        case 'fractal':
        case 'distortion':
          this.drawChaosObstacle(obstacle, size, accentColor, time);
          break;
        case 'meteor':
        case 'shockwave':
          this.drawApocalypseObstacle(obstacle, size, accentColor, time);
          break;
        case 'asteroid':
        case 'debris':
          // Level 1 specific obstacles
          this.drawEnhancedAsteroid(obstacle);
          break;
        default:
          // Safe fallback
          console.log(`🎨 Using basic fallback for obstacle type: ${obstacleType}`);
          this.drawBasicObstacle(obstacle);
          break;
      }
    } catch (error) {
      console.warn(`Error drawing ${obstacleType} obstacle:`, error);
      // Fallback to basic obstacle to prevent crash
      this.drawBasicObstacle(obstacle);
    }
  }
  
  // Individual obstacle type renderers
  drawCrystalObstacle(obstacle, size, color, time) {
    // LEVEL 2: Gentle, calming crystal obstacles with soft blue glow
    this.ctx.fillStyle = '#87CEEB'; // Soft sky blue crystals - very calming
    this.ctx.strokeStyle = '#B0E0E6'; // Powder blue outline
    this.ctx.lineWidth = 2;
    this.ctx.shadowColor = '#87CEEB';
    this.ctx.shadowBlur = 8; // Softer glow for calming effect
    
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const radius = size * (0.8 + Math.sin(time * 2 + i) * 0.15); // Gentler pulsing
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
    
    // Add soft, calming crystalline core
    this.ctx.fillStyle = '#F0F8FF'; // Alice blue - very gentle
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.shadowBlur = 0;
  }
  
  drawSpiralObstacle(obstacle, size, color, time) {
    // LEVEL 3: Purple/magenta spinning spirals
    this.ctx.strokeStyle = '#FF6B9D'; // Bright magenta
    this.ctx.lineWidth = 4;
    this.ctx.shadowColor = '#FF6B9D';
    this.ctx.shadowBlur = 15;
    
    this.ctx.beginPath();
    
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 6 + time * 3; // Spinning effect
      const radius = (i / 60) * size * 1.2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();
    
    // Add pulsing center
    this.ctx.fillStyle = '#FFFFFF';
    const pulseSize = size * 0.2 * (1 + Math.sin(time * 5) * 0.3);
    this.ctx.beginPath();
    this.ctx.arc(0, 0, pulseSize, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.shadowBlur = 0;
  }
  
  drawGasCloudObstacle(obstacle, size, color, time) {
    // LEVEL 4: Orange/yellow nebula gas clouds
    this.ctx.fillStyle = 'rgba(255, 170, 0, 0.6)'; // Orange gas
    
    for (let i = 0; i < 8; i++) {
      const offsetX = Math.sin(time + i * 0.8) * size * 0.4;
      const offsetY = Math.cos(time + i * 1.2) * size * 0.4;
      const cloudSize = size * (0.4 + Math.sin(time * 1.5 + i) * 0.3);
      
      this.ctx.beginPath();
      this.ctx.arc(offsetX, offsetY, cloudSize, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // Add glowing center
    this.ctx.fillStyle = '#FFAA00';
    this.ctx.shadowColor = '#FFAA00';
    this.ctx.shadowBlur = 20;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
  }
  
  drawEnergyObstacle(obstacle, size, color, time) {
    // LEVEL 5: Electric blue energy orbs with lightning
    this.ctx.strokeStyle = '#FF4500'; // Orange-red energy
    this.ctx.lineWidth = 4;
    this.ctx.shadowColor = '#FF4500';
    this.ctx.shadowBlur = 20;
    
    // Main energy sphere
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size, 0, Math.PI * 2);
    this.ctx.stroke();
    
    // Energy bolts radiating outward
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + time * 4;
      const innerRadius = size * 0.3;
      const outerRadius = size * 1.5;
      
      this.ctx.beginPath();
      this.ctx.moveTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
      this.ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
      this.ctx.stroke();
    }
    
    // Pulsing core
    this.ctx.fillStyle = '#FFFFFF';
    const coreSize = size * 0.4 * (1 + Math.sin(time * 8) * 0.3);
    this.ctx.beginPath();
    this.ctx.arc(0, 0, coreSize, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.shadowBlur = 0;
  }

  // Additional unique obstacle types for visual variety
  drawPrismObstacle(obstacle, size, color, time) {
    this.ctx.fillStyle = color + '60';
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    
    // Multi-sided prism with rainbow refraction effect
    const sides = 8;
    for (let layer = 0; layer < 3; layer++) {
      const layerSize = size * (0.5 + layer * 0.25);
      const hueShift = (layer * 60 + time * 30) % 360;
      this.ctx.strokeStyle = `hsl(${hueShift}, 70%, 60%)`;
      
      this.ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2 + time + layer * 0.5;
        const x = Math.cos(angle) * layerSize;
        const y = Math.sin(angle) * layerSize;
        if (i === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.closePath();
      this.ctx.stroke();
      if (layer === 0) this.ctx.fill();
    }
  }
  
  drawSolarObstacle(obstacle, size, color, time) {
    // Solar flare/corona obstacle
    this.ctx.fillStyle = '#FF4500';
    this.ctx.shadowColor = '#FFA500';
    this.ctx.shadowBlur = 15;
    
    // Core
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Solar flares
    this.ctx.strokeStyle = '#FFD700';
    this.ctx.lineWidth = 4;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + time * 2;
      const flareLength = size * (1 + Math.sin(time * 3 + i) * 0.5);
      const startRadius = size * 0.5;
      
      this.ctx.beginPath();
      this.ctx.moveTo(Math.cos(angle) * startRadius, Math.sin(angle) * startRadius);
      this.ctx.lineTo(Math.cos(angle) * flareLength, Math.sin(angle) * flareLength);
      this.ctx.stroke();
    }
    this.ctx.shadowBlur = 0;
  }
  
  drawQuantumObstacle(obstacle, size, color, time) {
    // Quantum particle/wave obstacle with uncertainty principle visualization
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color + '30';
    
    // Multiple probability clouds
    for (let i = 0; i < 5; i++) {
      const phase = time * 4 + i * Math.PI * 0.4;
      const probability = Math.sin(phase) * 0.5 + 0.5;
      const cloudSize = size * (0.3 + probability * 0.4);
      const offset = Math.cos(phase * 1.3) * size * 0.2;
      
      this.ctx.globalAlpha = probability * 0.6;
      this.ctx.beginPath();
      this.ctx.arc(offset, Math.sin(phase * 0.7) * size * 0.2, cloudSize, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // Quantum interference pattern
    this.ctx.globalAlpha = 1;
    this.ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const waveOffset = time * 3 + i * Math.PI * 0.6;
      this.ctx.beginPath();
      for (let x = -size; x <= size; x += 5) {
        const wave = Math.sin(x * 0.1 + waveOffset) * size * 0.3;
        if (x === -size) this.ctx.moveTo(x, wave);
        else this.ctx.lineTo(x, wave);
      }
      this.ctx.stroke();
    }
  }
  
  drawBioObstacle(obstacle, size, color, time) {
    // Organic spore/virus obstacle
    this.ctx.fillStyle = color + '80';
    this.ctx.strokeStyle = color;
    
    // Main body - pulsating organic shape
    const pulseSize = size * (0.8 + Math.sin(time * 5) * 0.2);
    this.ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const variation = Math.sin(time * 3 + i * 0.5) * 0.3 + 1;
      const radius = pulseSize * variation;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
    
    // Spores/tendrils
    this.ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + time;
      const tendrilLength = size * (1.2 + Math.sin(time * 2 + i) * 0.3);
      
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.quadraticCurveTo(
        Math.cos(angle) * tendrilLength * 0.5,
        Math.sin(angle) * tendrilLength * 0.5 + Math.sin(time * 4) * 10,
        Math.cos(angle) * tendrilLength,
        Math.sin(angle) * tendrilLength
      );
      this.ctx.stroke();
      
      // Spore at tip
      this.ctx.beginPath();
      this.ctx.arc(Math.cos(angle) * tendrilLength, Math.sin(angle) * tendrilLength, 3, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  drawVolcanicObstacle(obstacle, size, color, time) {
    // Lava/magma obstacle with dripping effect
    this.ctx.fillStyle = '#FF6347';
    this.ctx.strokeStyle = '#FF4500';
    this.ctx.lineWidth = 3;
    
    // Molten core
    const coreSize = size * (0.6 + Math.sin(time * 4) * 0.2);
    this.ctx.shadowColor = '#FF0000';
    this.ctx.shadowBlur = 10;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, coreSize, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Lava drips
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = '#DC143C';
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const dripLength = size * (0.5 + Math.sin(time * 3 + i) * 0.3);
      const x = Math.cos(angle) * size * 0.7;
      const y = Math.sin(angle) * size * 0.7;
      
      // Teardrop shape
      this.ctx.beginPath();
      this.ctx.ellipse(x, y + dripLength * 0.3, 4, dripLength, angle + Math.PI/2, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // Heat shimmer effect
    this.ctx.strokeStyle = '#FFA500';
    this.ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const shimmerRadius = size * (1.2 + i * 0.2);
      this.ctx.globalAlpha = 0.3 - i * 0.1;
      this.ctx.beginPath();
      this.ctx.arc(Math.sin(time * 6) * 2, Math.cos(time * 4) * 2, shimmerRadius, 0, Math.PI * 2);
      this.ctx.stroke();
    }
    this.ctx.globalAlpha = 1;
  }
  
  drawVoidObstacle(obstacle, size, color, time) {
    // Dark void/shadow obstacle that seems to absorb light
    this.ctx.fillStyle = '#000000';
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1;
    
    // Dark core
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Void tendrils reaching outward
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + time * 0.5;
      const tendrilReach = size * (1.5 + Math.sin(time * 2 + i) * 0.5);
      
      // Create gradient from black to transparent
      const gradient = this.ctx.createRadialGradient(0, 0, size * 0.8, 0, 0, tendrilReach);
      gradient.addColorStop(0, '#000000');
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, tendrilReach, angle - 0.2, angle + 0.2);
      this.ctx.lineTo(0, 0);
      this.ctx.fill();
    }
    
    // Distortion effect around edge
    this.ctx.strokeStyle = color + '40';
    this.ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + time;
      const distortRadius = size * (1.1 + Math.sin(time * 8 + i) * 0.1);
      const x = Math.cos(angle) * distortRadius;
      const y = Math.sin(angle) * distortRadius;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, 2, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }
  
  drawStormObstacle(obstacle, size, color, time) {
    // Lightning/thunder storm obstacle
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = '#2F4F4F';
    this.ctx.lineWidth = 2;
    
    // Storm cloud core
    for (let i = 0; i < 4; i++) {
      const cloudSize = size * (0.4 + i * 0.15);
      const offset = Math.sin(time + i) * size * 0.2;
      this.ctx.globalAlpha = 0.6 - i * 0.1;
      this.ctx.beginPath();
      this.ctx.arc(offset, Math.cos(time * 1.2 + i) * size * 0.1, cloudSize, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.globalAlpha = 1;
    
    // Lightning bolts
    this.ctx.strokeStyle = '#FFD700';
    this.ctx.lineWidth = 3;
    this.ctx.shadowColor = '#FFD700';
    this.ctx.shadowBlur = 5;
    
    for (let i = 0; i < 3; i++) {
      if (Math.sin(time * 10 + i * 2) > 0.7) { // Random lightning flashes
        const startAngle = (i / 3) * Math.PI * 2;
        let x = Math.cos(startAngle) * size * 0.3;
        let y = Math.sin(startAngle) * size * 0.3;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        
        // Jagged lightning path
        for (let j = 0; j < 5; j++) {
          x += (Math.random() - 0.5) * size * 0.4;
          y += size * 0.3;
          this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
      }
    }
    this.ctx.shadowBlur = 0;
  }
  
  drawChaosObstacle(obstacle, size, color, time) {
    // Chaotic fractal/distortion obstacle
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color + '20';
    
    // Fractal-like chaotic pattern
    const iterations = 3;
    for (let iter = 0; iter < iterations; iter++) {
      const iterSize = size * (1 - iter * 0.2);
      const rotation = time * (1 + iter) + iter * Math.PI * 0.3;
      
      this.ctx.save();
      this.ctx.rotate(rotation);
      this.ctx.lineWidth = 3 - iter;
      
      // Chaotic geometric shape
      this.ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const chaos = Math.sin(time * 7 + i + iter * 2) * 0.5 + 1;
        const radius = iterSize * chaos;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        if (i === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.closePath();
      
      if (iter === 0) this.ctx.fill();
      this.ctx.stroke();
      this.ctx.restore();
    }
    
    // Chaotic particles
    for (let i = 0; i < 10; i++) {
      const particleAngle = time * 5 + i * 0.6;
      const particleRadius = size * (0.8 + Math.sin(time * 3 + i) * 0.6);
      const x = Math.cos(particleAngle) * particleRadius;
      const y = Math.sin(particleAngle) * particleRadius;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  drawApocalypseObstacle(obstacle, size, color, time) {
    // Meteoric/shockwave apocalypse obstacle
    this.ctx.fillStyle = '#8B0000';
    this.ctx.strokeStyle = '#FF0000';
    
    // Meteor core with trailing fire
    const coreSize = size * 0.6;
    this.ctx.shadowColor = '#FF4500';
    this.ctx.shadowBlur = 15;
    
    // Meteor body
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, coreSize, coreSize * 1.2, time * 2, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Fire trail
    this.ctx.shadowBlur = 0;
    for (let i = 0; i < 6; i++) {
      const trailLength = size * (1 + i * 0.2);
      const trailWidth = size * (0.3 - i * 0.04);
      const flicker = Math.sin(time * 8 + i) * 0.2 + 1;
      
      this.ctx.fillStyle = i < 2 ? '#FF4500' : i < 4 ? '#FF6347' : '#FF8C00';
      this.ctx.globalAlpha = (0.8 - i * 0.12) * flicker;
      
      this.ctx.beginPath();
      this.ctx.ellipse(0, trailLength * 0.3, trailWidth, trailLength, Math.PI/2, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.globalAlpha = 1;
    
    // Shockwave rings
    this.ctx.strokeStyle = '#FF0000';
    this.ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const waveRadius = size * (1.2 + i * 0.4 + Math.sin(time * 4) * 0.2);
      this.ctx.globalAlpha = 0.7 - i * 0.2;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, waveRadius, 0, Math.PI * 2);
      this.ctx.stroke();
    }
    this.ctx.globalAlpha = 1;
  }

  drawCrystalShard(obstacle, size, time) {
    // Rotating crystal shard with prismatic effects
    this.ctx.rotate(obstacle.rotation + time * 0.3);
    
    // Main crystal body with sharp edges
    const crystalGradient = this.ctx.createLinearGradient(-size, -size, size, size);
    crystalGradient.addColorStop(0, '#4169E1');
    crystalGradient.addColorStop(0.3, '#00BFFF');
    crystalGradient.addColorStop(0.7, '#87CEEB');
    crystalGradient.addColorStop(1, '#E0F6FF');
    
    this.ctx.fillStyle = crystalGradient;
    this.ctx.beginPath();
    
    // Create sharp crystal shape
    const points = 6;
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const sharpness = (i % 2 === 0) ? 1.0 : 0.6; // Alternating sharp/flat
      const radius = size * sharpness;
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
    
    // Crystal edge highlights
    this.ctx.strokeStyle = '#87CEEB';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    
    // Inner glow
    this.ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.sin(time * 4) * 0.3})`;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawPlasmaCore(obstacle, size, time) {
    // Pulsing plasma core with energy effects
    const pulseSize = size * (1 + Math.sin(time * 6) * 0.2);
    
    // Outer plasma field
    const plasmaGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, pulseSize);
    plasmaGradient.addColorStop(0, 'rgba(255, 0, 255, 0.9)');
    plasmaGradient.addColorStop(0.4, 'rgba(138, 43, 226, 0.7)');
    plasmaGradient.addColorStop(0.8, 'rgba(75, 0, 130, 0.5)');
    plasmaGradient.addColorStop(1, 'rgba(75, 0, 130, 0.1)');
    
    this.ctx.fillStyle = plasmaGradient;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, pulseSize, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Core sphere
    this.ctx.fillStyle = '#FF00FF';
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Energy arcs
    this.ctx.strokeStyle = `rgba(255, 255, 0, ${0.6 + Math.sin(time * 8) * 0.4})`;
    this.ctx.lineWidth = 3;
    
    for (let i = 0; i < 4; i++) {
      const arcAngle = (i / 4) * Math.PI * 2 + time * 2;
      const startRadius = size * 0.5;
      const endRadius = size * 0.8;
      
      const startX = Math.cos(arcAngle) * startRadius;
      const startY = Math.sin(arcAngle) * startRadius;
      const endX = Math.cos(arcAngle) * endRadius;
      const endY = Math.sin(arcAngle) * endRadius;
      
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.quadraticCurveTo(
        startX * 1.5 + Math.sin(time * 5 + i) * 10,
        startY * 1.5 + Math.cos(time * 5 + i) * 10,
        endX, endY
      );
      this.ctx.stroke();
    }
  }

  drawSpaceDebris(obstacle, size, time) {
    // Metallic space debris with dynamic pieces
    this.ctx.rotate(obstacle.rotation);
    
    // Main debris body
    const debrisGradient = this.ctx.createLinearGradient(-size, -size, size, size);
    debrisGradient.addColorStop(0, '#2F4F4F');
    debrisGradient.addColorStop(0.3, '#696969');
    debrisGradient.addColorStop(0.7, '#A9A9A9');
    debrisGradient.addColorStop(1, '#C0C0C0');
    
    this.ctx.fillStyle = debrisGradient;
    
    // Irregular debris shape
    this.ctx.beginPath();
    const debrisPoints = 7;
    for (let i = 0; i < debrisPoints; i++) {
      const angle = (i / debrisPoints) * Math.PI * 2;
      const variance = 0.6 + Math.sin(angle * 4 + time) * 0.4;
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
    
    // Metallic scratches and details
    this.ctx.strokeStyle = '#FFD700';
    this.ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const scratchAngle = (i / 3) * Math.PI * 2 + time * 0.1;
      const scratchLength = size * 0.6;
      
      this.ctx.beginPath();
      this.ctx.moveTo(
        Math.cos(scratchAngle) * -scratchLength * 0.5,
        Math.sin(scratchAngle) * -scratchLength * 0.5
      );
      this.ctx.lineTo(
        Math.cos(scratchAngle) * scratchLength * 0.5,
        Math.sin(scratchAngle) * scratchLength * 0.5
      );
      this.ctx.stroke();
    }
    
    // Warning lights
    this.ctx.fillStyle = `rgba(255, 0, 0, ${0.5 + Math.sin(time * 10) * 0.5})`;
    this.ctx.beginPath();
    this.ctx.arc(size * 0.3, size * 0.3, 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawEnergyAnomaly(obstacle, size, time) {
    // Swirling energy anomaly with particle effects
    const swirl = time * 3;
    
    // Background energy field
    const anomalyGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    anomalyGradient.addColorStop(0, 'rgba(0, 255, 255, 0.8)');
    anomalyGradient.addColorStop(0.5, 'rgba(0, 191, 255, 0.6)');
    anomalyGradient.addColorStop(1, 'rgba(0, 100, 200, 0.2)');
    
    this.ctx.fillStyle = anomalyGradient;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Swirling energy streams
    this.ctx.strokeStyle = `rgba(0, 255, 255, ${0.7 + Math.sin(time * 6) * 0.3})`;
    this.ctx.lineWidth = 2;
    
    for (let i = 0; i < 5; i++) {
      const streamAngle = swirl + (i / 5) * Math.PI * 2;
      const spiral = 4; // Number of spiral arms
      
      this.ctx.beginPath();
      for (let t = 0; t < Math.PI * 2; t += 0.2) {
        const r = (size * 0.8) * (1 - t / (Math.PI * 2));
        const a = streamAngle + t * spiral;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        
        if (t === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      this.ctx.stroke();
    }
    
    // Central anomaly core
    this.ctx.fillStyle = `rgba(255, 255, 255, ${0.8 + Math.sin(time * 12) * 0.2})`;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Particle effects around anomaly
    for (let i = 0; i < 6; i++) {
      const particleAngle = time * 4 + (i / 6) * Math.PI * 2;
      const particleRadius = size * 0.6 + Math.sin(time * 8 + i) * size * 0.2;
      const particleX = Math.cos(particleAngle) * particleRadius;
      const particleY = Math.sin(particleAngle) * particleRadius;
      
      this.ctx.fillStyle = `rgba(255, 255, 0, ${0.6 + Math.sin(time * 10 + i) * 0.4})`;
      this.ctx.beginPath();
      this.ctx.arc(particleX, particleY, 1.5, 0, Math.PI * 2);
      this.ctx.fill();
    }
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
    
    const time = Date.now() * 0.001;
    
    // Boss flashing when hit
    if (boss.invulnerable) {
      this.ctx.globalAlpha = 0.7 + Math.sin(time * 20) * 0.3;
    }
    
    // Advanced Phase-based visual system
    const phaseConfigs = {
      1: {
        bodyColor: '#4B0082', eyeColor: '#FF6B35', tentacleColor: '#8B008B',
        auraColor: '#9B59B6', size: 1.0, intensity: 0.3
      },
      2: {
        bodyColor: '#8B0000', eyeColor: '#FF4500', tentacleColor: '#B22222',
        auraColor: '#E74C3C', size: 1.1, intensity: 0.5
      },
      3: {
        bodyColor: '#000000', eyeColor: '#FF0000', tentacleColor: '#DC143C',
        auraColor: '#FF0000', size: 1.2, intensity: 0.8
      }
    };
    
    const config = phaseConfigs[boss.phase] || phaseConfigs[1];
    const breathe = Math.sin(time * 2) * 0.05 + 1;
    
    // Menacing aura with phase-based intensity
    this.ctx.save();
    const auraRadius = (boss.width / 2 + 30) * config.size * breathe;
    const auraGradient = this.ctx.createRadialGradient(0, 0, boss.width / 3, 0, 0, auraRadius);
    auraGradient.addColorStop(0, `${config.auraColor}00`);
    auraGradient.addColorStop(0.7, `${config.auraColor}${Math.floor(config.intensity * 100).toString(16).padStart(2, '0')}`);
    auraGradient.addColorStop(1, `${config.auraColor}00`);
    
    this.ctx.fillStyle = auraGradient;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, auraRadius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
    
    // Advanced multi-segmented body with organic texture
    this.ctx.fillStyle = config.bodyColor;
    this.ctx.strokeStyle = config.tentacleColor;
    this.ctx.lineWidth = 2;
    
    // Main thorax with breathing animation
    this.ctx.save();
    this.ctx.scale(breathe, breathe);
    const bodyGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, boss.width / 2);
    bodyGradient.addColorStop(0, config.bodyColor);
    bodyGradient.addColorStop(0.6, config.bodyColor + '80');
    bodyGradient.addColorStop(1, config.tentacleColor);
    
    this.ctx.fillStyle = bodyGradient;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, boss.width / 2.2, boss.height / 2.5, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.restore();
    
    // Upper abdomen segment
    this.ctx.fillStyle = config.bodyColor + 'CC';
    this.ctx.beginPath();
    this.ctx.ellipse(0, -boss.height * 0.25, boss.width / 2.8, boss.height / 3.5, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
    
    // Lower abdomen segment with spikes
    this.ctx.fillStyle = config.bodyColor + 'DD';
    this.ctx.beginPath();
    this.ctx.ellipse(0, boss.height * 0.2, boss.width / 3.2, boss.height / 4, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
    
    // Defensive spikes around body
    this.ctx.strokeStyle = config.tentacleColor;
    this.ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + time * 0.5;
      const innerRadius = boss.width / 2.5;
      const outerRadius = innerRadius + 15 + Math.sin(time * 3 + i) * 5;
      
      const startX = Math.cos(angle) * innerRadius;
      const startY = Math.sin(angle) * innerRadius * 0.8;
      const endX = Math.cos(angle) * outerRadius;
      const endY = Math.sin(angle) * outerRadius * 0.8;
      
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();
    }
    
    // Advanced compound eyes with hex patterns
    const eyeSize = 12 + boss.phase * 2;
    const eyeGlow = 5 + Math.sin(time * 4) * 3;
    
    this.ctx.shadowColor = config.eyeColor;
    this.ctx.shadowBlur = eyeGlow;
    
    for (let eye of [{x: -boss.width/3, y: -boss.height/3}, {x: boss.width/3, y: -boss.height/3}]) {
      // Outer eye glow
      this.ctx.fillStyle = config.eyeColor + '40';
      this.ctx.beginPath();
      this.ctx.arc(eye.x, eye.y, eyeSize + 4, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Main eye
      this.ctx.fillStyle = config.eyeColor;
      this.ctx.beginPath();
      this.ctx.arc(eye.x, eye.y, eyeSize, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Hexagonal compound eye pattern
      this.ctx.fillStyle = config.eyeColor + '80';
      for (let h = 0; h < 6; h++) {
        const hexAngle = (h / 6) * Math.PI * 2;
        const hexX = eye.x + Math.cos(hexAngle) * 4;
        const hexY = eye.y + Math.sin(hexAngle) * 4;
        
        this.ctx.beginPath();
        this.ctx.arc(hexX, hexY, 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      // Central pupil with tracking effect
      this.ctx.fillStyle = '#000000';
      this.ctx.beginPath();
      this.ctx.arc(eye.x, eye.y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // Dynamic organic tentacles with advanced animation
    this.ctx.shadowBlur = 0;
    this.ctx.lineWidth = 6;
    
    if (boss.tentacles) {
      boss.tentacles.forEach((tentacle, index) => {
        const wiggle1 = Math.sin(time * 3 + index * 0.5) * 0.4;
        const wiggle2 = Math.cos(time * 2 + index * 0.3) * 0.3;
        
        const baseX = Math.cos(tentacle.angle) * boss.width / 3.5;
        const baseY = Math.sin(tentacle.angle) * boss.height / 3.5;
        
        const segments = 4;
        let prevX = baseX;
        let prevY = baseY;
        
        // Create organic tentacle with multiple segments
        for (let seg = 1; seg <= segments; seg++) {
          const segmentProgress = seg / segments;
          const currentWiggle = wiggle1 * (1 - segmentProgress) + wiggle2 * segmentProgress;
          
          const segmentAngle = tentacle.angle + currentWiggle;
          const segmentLength = tentacle.length / segments;
          
          const segmentX = prevX + Math.cos(segmentAngle) * segmentLength;
          const segmentY = prevY + Math.sin(segmentAngle) * segmentLength;
          
          // Gradient color for tentacle depth
          const intensity = 1 - segmentProgress * 0.4;
          this.ctx.strokeStyle = config.tentacleColor + Math.floor(intensity * 255).toString(16).padStart(2, '0');
          this.ctx.lineWidth = 6 - segmentProgress * 2;
          
          this.ctx.beginPath();
          this.ctx.moveTo(prevX, prevY);
          this.ctx.lineTo(segmentX, segmentY);
          this.ctx.stroke();
          
          // Sucker details on tentacles
          if (seg % 2 === 0) {
            this.ctx.fillStyle = config.tentacleColor + '80';
            this.ctx.beginPath();
            this.ctx.arc(segmentX, segmentY, 2, 0, Math.PI * 2);
            this.ctx.fill();
          }
          
          prevX = segmentX;
          prevY = segmentY;
        }
      });
    }
    
    // Organic mandibles/chelicerae
    this.ctx.strokeStyle = config.tentacleColor;
    this.ctx.lineWidth = 4;
    const mandibleMove = Math.sin(time * 6) * 0.2;
    
    // Left mandible
    this.ctx.beginPath();
    this.ctx.arc(-boss.width/4, boss.height/4, 8, -Math.PI/4 + mandibleMove, Math.PI/4 + mandibleMove);
    this.ctx.stroke();
    
    // Right mandible
    this.ctx.beginPath();
    this.ctx.arc(boss.width/4, boss.height/4, 8, 3*Math.PI/4 - mandibleMove, 5*Math.PI/4 - mandibleMove);
    this.ctx.stroke();
    
    // Phase 3: Additional rage effects
    if (boss.phase >= 3) {
      // Electric/plasma aura
      this.ctx.strokeStyle = '#00FFFF';
      this.ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        const electricRadius = boss.width / 2 + 20 + i * 10;
        const electricOffset = time * (2 + i) + i * Math.PI * 0.7;
        
        this.ctx.beginPath();
        this.ctx.arc(
          Math.sin(electricOffset) * 5,
          Math.cos(electricOffset) * 5,
          electricRadius,
          0, Math.PI * 2
        );
        this.ctx.globalAlpha = 0.3 - i * 0.1;
        this.ctx.stroke();
      }
      this.ctx.globalAlpha = 1;
    }
    
    // Advanced health bar with phase transitions
    const barWidth = boss.width * 1.2;
    const barHeight = 10;
    const barY = -boss.height / 2 - 30;
    
    // Health bar background
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(-barWidth / 2, barY, barWidth, barHeight);
    
    // Health bar with gradient based on phase
    const healthPercent = boss.health / boss.maxHealth;
    const healthColors = [
      ['#00FF00', '#7FFF00'], // Phase 1: Green to Yellow-Green
      ['#FFFF00', '#FF8C00'], // Phase 2: Yellow to Orange  
      ['#FF4500', '#FF0000']  // Phase 3: Orange to Red
    ];
    
    const phaseColors = healthColors[boss.phase - 1] || healthColors[0];
    const healthGradient = this.ctx.createLinearGradient(-barWidth/2, 0, barWidth/2, 0);
    healthGradient.addColorStop(0, phaseColors[0]);
    healthGradient.addColorStop(1, phaseColors[1]);
    
    this.ctx.fillStyle = healthGradient;
    this.ctx.fillRect(-barWidth / 2, barY, barWidth * healthPercent, barHeight);
    
    // Health bar border
    this.ctx.strokeStyle = config.tentacleColor;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(-barWidth / 2, barY, barWidth, barHeight);
    
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
    
    // Health Bar
    if (gameEngine.player && gameEngine.player.health !== undefined) {
      const healthPercent = gameEngine.player.health / gameEngine.player.maxHealth;
      const barWidth = 150;
      const barHeight = 15;
      const barX = 20;
      const barY = 110;
      
      // Background
      this.ctx.fillStyle = '#333333';
      this.ctx.fillRect(barX, barY, barWidth, barHeight);
      
      // Health bar color based on health percentage
      let healthColor;
      if (healthPercent > 0.6) {
        healthColor = '#00FF00'; // Green
      } else if (healthPercent > 0.3) {
        healthColor = '#FFFF00'; // Yellow
      } else {
        healthColor = '#FF0000'; // Red
      }
      
      this.ctx.fillStyle = healthColor;
      this.ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
      
      // Border
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(barX, barY, barWidth, barHeight);
      
      // Health text
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`Health: ${gameEngine.player.health}/${gameEngine.player.maxHealth}`, 
                        barX + barWidth / 2, barY - 5);
    }
    
    // Level progress (for non-boss levels)
    if (!gameEngine.isBossLevel) {
      const progress = gameEngine.levelTime / gameEngine.levelDuration;
      const barWidth = 200;
      const barHeight = 10;
      const barX = this.canvas.width - barWidth - 20;
      const barY = 50; // Moved down to account for health bar
      
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

  drawEnhancedPowerUp(powerUp) {
    this.ctx.save();
    this.ctx.translate(powerUp.x, powerUp.y);
    
    const time = Date.now() * 0.003;
    
    // Floating animation
    const float = Math.sin(time * 4 + powerUp.x * 0.01) * 3;
    this.ctx.translate(0, float);
    
    // Rotation animation
    this.ctx.rotate(time * 2);
    
    // Enhanced glow effect
    const glowIntensity = 15 + Math.sin(time * 6) * 5;
    this.ctx.shadowColor = this.getPowerUpColor(powerUp.type);
    this.ctx.shadowBlur = glowIntensity;
    
    // Pulsing scale
    const pulseScale = 1 + Math.sin(time * 8) * 0.2;
    this.ctx.scale(pulseScale, pulseScale);
    
    // Main power-up body with gradient
    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, powerUp.width / 2);
    gradient.addColorStop(0, '#FFFFFF');
    gradient.addColorStop(0.3, this.getPowerUpColor(powerUp.type));
    gradient.addColorStop(1, this.getPowerUpColor(powerUp.type) + '80');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, powerUp.width / 2, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Sparkling particles around power-up
    for (let i = 0; i < 6; i++) {
      const sparkleAngle = time * 3 + (i / 6) * Math.PI * 2;
      const sparkleRadius = powerUp.width / 2 + 8;
      const sparkleX = Math.cos(sparkleAngle) * sparkleRadius;
      const sparkleY = Math.sin(sparkleAngle) * sparkleRadius;
      
      this.ctx.fillStyle = `rgba(255, 255, 255, ${0.7 + Math.sin(time * 10 + i) * 0.3})`;
      this.ctx.beginPath();
      this.ctx.arc(sparkleX, sparkleY, 1.5, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // Power-up symbol with enhanced styling
    this.ctx.shadowBlur = 3;
    this.ctx.shadowColor = '#000000';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 14px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 2;
    
    const symbol = this.getPowerUpSymbol(powerUp.type);
    this.ctx.strokeText(symbol, 0, 4);
    this.ctx.fillText(symbol, 0, 4);
    
    this.ctx.restore();
  }

  renderPerformanceStats(gameEngine) {
    // Performance statistics overlay
    this.ctx.save();
    
    // Semi-transparent background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(this.canvas.width - 180, 10, 170, 120);
    
    // Stats text
    this.ctx.fillStyle = '#00FF00';
    this.ctx.font = '12px monospace';
    this.ctx.textAlign = 'left';
    
    let y = 30;
    const stats = [
      `FPS: ${gameEngine.fps || 'N/A'}`,
      `Particles: ${gameEngine.particleSystem ? gameEngine.particleSystem.particles.length : 0}`,
      `Obstacles: ${gameEngine.obstacles.length}`,
      `Power-ups: ${gameEngine.powerUps.length}`,
      `Projectiles: ${gameEngine.projectiles.length}`,
      `Level: ${gameEngine.currentLevel}/15`,
      `Score: ${gameEngine.score}`,
      `Health: ${gameEngine.player ? gameEngine.player.health : 'N/A'}/${gameEngine.player ? gameEngine.player.maxHealth : 'N/A'}`
    ];
    
    stats.forEach(stat => {
      this.ctx.fillText(stat, this.canvas.width - 175, y);
      y += 14;
    });
    
    this.ctx.restore();
  }
};