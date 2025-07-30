import React, { useEffect, useRef } from 'react';

// Enhanced Game Renderer with premium visual effects
class EnhancedGameRenderer {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.nebulaOffset = 0;
    this.starField = this.generateEnhancedStarField();
    this.nebulaClouds = this.generateNebulaClouds();
    this.particleSystem = new ParticleSystem(ctx);
  }
  
  generateEnhancedStarField() {
    const stars = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 3 + 0.5,
        brightness: Math.random() * 0.9 + 0.1,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.03,
        color: this.getStarColor()
      });
    }
    return stars;
  }
  
  getStarColor() {
    const colors = [
      '#FFFFFF', '#FFE4B5', '#F0F8FF', '#E6E6FA', 
      '#98FB98', '#FFB6C1', '#87CEEB', '#DDA0DD'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  generateNebulaClouds() {
    const clouds = [];
    for (let i = 0; i < 8; i++) {
      clouds.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: 50 + Math.random() * 100,
        opacity: 0.1 + Math.random() * 0.3,
        drift: Math.random() * 2 - 1,
        color: this.getNebulaColor(),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01
      });
    }
    return clouds;
  }
  
  getNebulaColor() {
    const colors = [
      '#4B0082', '#8B008B', '#FF1493', '#00CED1', 
      '#9370DB', '#FF6347', '#32CD32', '#FFD700'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  renderEnhancedBackground(level) {
    // Level-specific premium backgrounds
    const backgroundConfig = this.getLevelBackgroundConfig(level);
    
    // Create complex gradient
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    backgroundConfig.gradientStops.forEach((stop, index) => {
      gradient.addColorStop(index / (backgroundConfig.gradientStops.length - 1), stop);
    });
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render nebula clouds with enhanced effects
    this.renderNebulaClouds(backgroundConfig);
    
    // Render enhanced star field
    this.renderEnhancedStars();
    
    // Add level-specific effects
    this.renderLevelEffects(level, backgroundConfig);
  }
  
  getLevelBackgroundConfig(level) {
    const configs = {
      1: {
        name: 'Starry Genesis',
        gradientStops: ['#0B1426', '#1B2951', '#2A3F7A', '#4A5F9A'],
        effects: ['twinkling_stars', 'gentle_drift'],
        music: 'orchestral_beginning'
      },
      5: {
        name: 'Colorful Nebula',
        gradientStops: ['#2D1B69', '#8B2986', '#E94560', '#F2CC8F'],
        effects: ['nebula_swirls', 'color_transitions'],
        music: 'orchestral_wonder'
      },
      10: {
        name: 'Galactic Core',
        gradientStops: ['#4A1A4A', '#7A2A7A', '#AA3AAA', '#DA4ADA'],
        effects: ['core_pulsation', 'energy_streams'],
        music: 'electronic_core'
      },
      15: {
        name: 'Boss Arena',
        gradientStops: ['#4B0082', '#8B008B', '#FF1493', '#FF69B4'],
        effects: ['boss_aura', 'energy_tendrils', 'ominous_glow'],
        music: 'epic_boss_battle'
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
  
  renderNebulaClouds(config) {
    this.nebulaClouds.forEach(cloud => {
      this.ctx.save();
      
      // Update cloud movement
      cloud.x += cloud.drift;
      cloud.rotation += cloud.rotationSpeed;
      
      // Wrap around screen
      if (cloud.x > this.canvas.width + cloud.size) cloud.x = -cloud.size;
      if (cloud.x < -cloud.size) cloud.x = this.canvas.width + cloud.size;
      
      // Create radial gradient for cloud
      const gradient = this.ctx.createRadialGradient(
        cloud.x, cloud.y, 0,
        cloud.x, cloud.y, cloud.size
      );
      gradient.addColorStop(0, `${cloud.color}${Math.floor(cloud.opacity * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(0.6, `${cloud.color}${Math.floor(cloud.opacity * 128).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = gradient;
      this.ctx.translate(cloud.x, cloud.y);
      this.ctx.rotate(cloud.rotation);
      this.ctx.fillRect(-cloud.size/2, -cloud.size/2, cloud.size, cloud.size);
      
      this.ctx.restore();
    });
  }
  
  renderEnhancedStars() {
    this.starField.forEach(star => {
      // Update star position and twinkling
      star.y += star.speed;
      star.twinkle += star.twinkleSpeed;
      
      if (star.y > this.canvas.height + 10) {
        star.y = -10;
        star.x = Math.random() * this.canvas.width;
      }
      
      // Calculate twinkling brightness
      const twinkleBrightness = star.brightness * (0.7 + 0.3 * Math.sin(star.twinkle));
      
      this.ctx.save();
      this.ctx.globalAlpha = twinkleBrightness;
      this.ctx.fillStyle = star.color;
      
      // Render star with glow effect
      this.ctx.shadowColor = star.color;
      this.ctx.shadowBlur = star.size * 2;
      
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.restore();
    });
  }
  
  renderLevelEffects(level, config) {
    switch (level) {
      case 1:
      case 2:
      case 3:
        this.renderTwinklingEffect();
        break;
      case 5:
      case 6:
      case 7:
        this.renderNebulaSwirls();
        break;
      case 10:
      case 11:
      case 12:
        this.renderEnergyStreams();
        break;
      case 15:
        this.renderBossAura();
        break;
    }
  }
  
  renderTwinklingEffect() {
    // Add extra twinkling particles
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const alpha = Math.sin(Date.now() * 0.01 + i) * 0.5 + 0.5;
      
      this.ctx.save();
      this.ctx.globalAlpha = alpha * 0.3;
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 1, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }
  
  renderNebulaSwirls() {
    const time = Date.now() * 0.001;
    
    for (let i = 0; i < 5; i++) {
      const centerX = this.canvas.width * (0.2 + i * 0.15);
      const centerY = this.canvas.height * 0.5;
      const radius = 30 + Math.sin(time + i) * 10;
      
      this.ctx.save();
      this.ctx.translate(centerX, centerY);
      this.ctx.rotate(time * 0.5 + i);
      
      const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      gradient.addColorStop(0, 'rgba(139, 41, 134, 0.3)');
      gradient.addColorStop(0.7, 'rgba(233, 69, 96, 0.1)');
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
      
      this.ctx.restore();
    }
  }
  
  renderEnergyStreams() {
    const time = Date.now() * 0.003;
    
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(170, 58, 170, 0.4)';
    this.ctx.lineWidth = 2;
    this.ctx.shadowColor = '#AA3AAA';
    this.ctx.shadowBlur = 8;
    
    for (let i = 0; i < 8; i++) {
      const startX = (i * this.canvas.width / 8) + Math.sin(time + i) * 20;
      const startY = 0;
      const endX = startX + Math.cos(time * 0.7 + i) * 30;
      const endY = this.canvas.height;
      
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.quadraticCurveTo(
        startX + Math.sin(time * 2 + i) * 50, 
        this.canvas.height / 2,
        endX, 
        endY
      );
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }
  
  renderBossAura() {
    const time = Date.now() * 0.002;
    const centerX = this.canvas.width / 2;
    const centerY = 100;
    const maxRadius = 150;
    
    // Pulsating aura effect
    for (let i = 0; i < 3; i++) {
      const radius = (maxRadius * (i + 1) / 3) * (0.8 + 0.2 * Math.sin(time * 2 + i));
      const alpha = 0.1 - (i * 0.03);
      
      const gradient = this.ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );
      gradient.addColorStop(0, `rgba(255, 20, 147, ${alpha})`);
      gradient.addColorStop(0.7, `rgba(139, 0, 139, ${alpha * 0.5})`);
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  // Enhanced butterfly rendering with premium effects
  renderPremiumButterfly(x, y, flutterer, effects = {}) {
    this.ctx.save();
    this.ctx.translate(x, y);
    
    const colors = flutterer?.colors || {
      body: '#8B4513',
      wing1: '#FF6B9D',
      wing2: '#FF8FA3',
      accent: '#FFFFFF'
    };
    
    // Legendary glow effect
    if (flutterer?.rarity === 'legendary') {
      const glowRadius = 40;
      const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius);
      gradient.addColorStop(0, `${flutterer.colors.glow || '#FFD700'}40`);
      gradient.addColorStop(0.5, `${flutterer.colors.glow || '#FFD700'}20`);
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // Wing flutter animation
    const flutterOffset = Math.sin(Date.now() * 0.02) * 0.1;
    
    // Enhanced wing rendering with gradients
    this.renderPremiumWings(colors, flutterOffset);
    
    // Enhanced body with shading
    this.renderPremiumBody(colors);
    
    // Special effects for different flutterer abilities
    this.renderFluttererEffects(flutterer, effects);
    
    // Shield effect
    if (effects.hasShield) {
      this.renderShieldEffect();
    }
    
    // Trail effects for special flutterers
    if (flutterer?.skills?.special === 'trail_sparkles') {
      this.renderSparkleTrail();
    }
    
    this.ctx.restore();
  }
  
  renderPremiumWings(colors, flutterOffset) {
    const wingGradient1 = this.ctx.createRadialGradient(-8, -6, 0, -8, -6, 12);
    wingGradient1.addColorStop(0, colors.wing1);
    wingGradient1.addColorStop(0.7, colors.wing2);
    wingGradient1.addColorStop(1, `${colors.wing1}80`);
    
    const wingGradient2 = this.ctx.createRadialGradient(8, -6, 0, 8, -6, 12);
    wingGradient2.addColorStop(0, colors.wing1);
    wingGradient2.addColorStop(0.7, colors.wing2);
    wingGradient2.addColorStop(1, `${colors.wing1}80`);
    
    // Upper wings with flutter animation
    this.ctx.save();
    this.ctx.rotate(flutterOffset);
    this.ctx.fillStyle = wingGradient1;
    this.ctx.beginPath();
    this.ctx.ellipse(-10, -8, 8, 12, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
    
    this.ctx.save();
    this.ctx.rotate(-flutterOffset);
    this.ctx.fillStyle = wingGradient2;
    this.ctx.beginPath();
    this.ctx.ellipse(10, -8, 8, 12, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
    
    // Lower wings
    this.ctx.fillStyle = colors.wing2;
    this.ctx.beginPath();
    this.ctx.ellipse(-8, 5, 6, 8, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(8, 5, 6, 8, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Wing patterns with enhanced details
    this.ctx.fillStyle = colors.accent;
    this.ctx.beginPath();
    this.ctx.arc(-10, -8, 3, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.arc(10, -8, 3, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Add wing shine effect
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.beginPath();
    this.ctx.ellipse(-12, -10, 2, 4, -0.5, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(12, -10, 2, 4, 0.5, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  renderPremiumBody(colors) {
    // Body gradient
    const bodyGradient = this.ctx.createLinearGradient(-2, -15, 2, 15);
    bodyGradient.addColorStop(0, colors.body);
    bodyGradient.addColorStop(0.5, `${colors.body}CC`);
    bodyGradient.addColorStop(1, `${colors.body}88`);
    
    this.ctx.fillStyle = bodyGradient;
    this.ctx.fillRect(-2, -15, 4, 30);
    
    // Add body segments
    this.ctx.fillStyle = `${colors.body}66`;
    for (let i = 0; i < 5; i++) {
      this.ctx.fillRect(-1.5, -12 + i * 5, 3, 1);
    }
  }
  
  renderFluttererEffects(flutterer, effects) {
    if (!flutterer?.skills?.special) return;
    
    switch (flutterer.skills.special) {
      case 'energy_barrier':
        this.renderEnergyBarrier();
        break;
      case 'speed_master':
        this.renderSpeedTrail();
        break;
      case 'plasma_burst':
        this.renderPlasmaEffect();
        break;
    }
  }
  
  renderShieldEffect() {
    const time = Date.now() * 0.005;
    const radius = 25 + Math.sin(time) * 2;
    
    this.ctx.strokeStyle = '#00FFFF';
    this.ctx.lineWidth = 3;
    this.ctx.shadowColor = '#00FFFF';
    this.ctx.shadowBlur = 8;
    
    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
    this.ctx.stroke();
    
    // Shield particles
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + time;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      this.ctx.fillStyle = '#00FFFF80';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  renderSparkleTrail() {
    const time = Date.now() * 0.01;
    
    for (let i = 0; i < 5; i++) {
      const offset = i * 8;
      const x = Math.sin(time + i) * 3;
      const y = offset + Math.cos(time + i) * 2;
      const alpha = 1 - (i / 5);
      
      this.ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 2 - i * 0.3, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  renderEnergyBarrier() {
    const time = Date.now() * 0.003;
    
    this.ctx.strokeStyle = 'rgba(20, 184, 166, 0.6)';
    this.ctx.lineWidth = 2;
    this.ctx.shadowColor = '#14B8A6';
    this.ctx.shadowBlur = 6;
    
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + time;
      const innerRadius = 20;
      const outerRadius = 30;
      
      const x1 = Math.cos(angle) * innerRadius;
      const y1 = Math.sin(angle) * innerRadius;
      const x2 = Math.cos(angle) * outerRadius;
      const y2 = Math.sin(angle) * outerRadius;
      
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    }
  }
  
  renderSpeedTrail() {
    const time = Date.now() * 0.02;
    
    for (let i = 0; i < 8; i++) {
      const offset = i * 5;
      const alpha = 1 - (i / 8);
      const width = 6 - i * 0.5;
      
      this.ctx.fillStyle = `rgba(220, 38, 127, ${alpha * 0.6})`;
      this.ctx.fillRect(-width/2, offset, width, 3);
    }
  }
  
  renderPlasmaEffect() {
    const time = Date.now() * 0.008;
    
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + time;
      const radius = 15 + Math.sin(time * 2 + i) * 3;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      this.ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
      this.ctx.shadowColor = '#EF4444';
      this.ctx.shadowBlur = 4;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
}

// Particle System for enhanced effects
class ParticleSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.particles = [];
  }
  
  createPowerUpExplosion(x, y, color) {
    for (let i = 0; i < 15; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        color: color,
        life: 1500,
        maxLife: 1500,
        size: 2 + Math.random() * 4,
        gravity: 0.1,
        alpha: 1
      });
    }
  }
  
  createBossExplosion(x, y) {
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20,
        color: ['#FF0000', '#FF6600', '#FFFF00', '#FFFFFF'][Math.floor(Math.random() * 4)],
        life: 2500,
        maxLife: 2500,
        size: 3 + Math.random() * 8,
        gravity: 0.05,
        alpha: 1
      });
    }
  }
  
  update(deltaTime) {
    this.particles = this.particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += particle.gravity;
      particle.life -= deltaTime;
      particle.alpha = particle.life / particle.maxLife;
      
      return particle.life > 0;
    });
  }
  
  render() {
    this.particles.forEach(particle => {
      this.ctx.save();
      this.ctx.globalAlpha = particle.alpha;
      this.ctx.fillStyle = particle.color;
      this.ctx.shadowColor = particle.color;
      this.ctx.shadowBlur = particle.size;
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.restore();
    });
  }
}

export default EnhancedGameRenderer;