class ParticleSystem {
  constructor() {
    this.particles = [];
    this.maxParticles = 500; // Optimized for mobile performance
  }

  // Create explosion particles when hitting obstacles
  createExplosion(x, y, color = '#ff6b6b', particleCount = 15) {
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const speed = 2 + Math.random() * 4;
      const size = 2 + Math.random() * 4;
      
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: size,
        color: color,
        life: 1.0,
        decay: 0.02 + Math.random() * 0.02,
        type: 'explosion'
      });
    }
  }

  // Create sparkle particles for power-up collection
  createSparkles(x, y, color = '#ffd700', particleCount = 20) {
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      const size = 1 + Math.random() * 3;
      
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: size,
        color: color,
        life: 1.0,
        decay: 0.015 + Math.random() * 0.015,
        type: 'sparkle',
        twinkle: Math.random() * Math.PI * 2
      });
    }
  }

  // Create butterfly trail particles
  createButterflyTrail(x, y, color = '#ff69b4') {
    // Add trail particles less frequently for performance
    if (Math.random() < 0.3) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 0.5 + Math.random() * 0.5,
        size: 1 + Math.random() * 2,
        color: color,
        life: 1.0,
        decay: 0.01,
        type: 'trail'
      });
    }
  }

  // Create background star particles
  createStarField(canvasWidth, canvasHeight, starCount = 100) {
    for (let i = 0; i < starCount; i++) {
      this.particles.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        vx: 0,
        vy: 0.2 + Math.random() * 0.5, // Slow downward movement
        size: 0.5 + Math.random() * 1.5,
        color: '#ffffff',
        life: 1.0,
        decay: 0, // Stars don't fade
        type: 'star',
        brightness: 0.3 + Math.random() * 0.7
      });
    }
  }

  // Create boss explosion particles
  createBossExplosion(x, y) {
    // Large dramatic explosion
    for (let i = 0; i < 40; i++) {
      const angle = (Math.PI * 2 * i) / 40 + Math.random() * 0.5;
      const speed = 3 + Math.random() * 6;
      const size = 3 + Math.random() * 8;
      
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: size,
        color: ['#ff6b6b', '#ffd700', '#ff8c42', '#ff69b4'][Math.floor(Math.random() * 4)],
        life: 1.0,
        decay: 0.008 + Math.random() * 0.01,
        type: 'boss_explosion'
      });
    }
  }

  // Update all particles
  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Update life
      particle.life -= particle.decay;
      
      // Special behaviors based on type
      switch (particle.type) {
        case 'sparkle':
          particle.twinkle += 0.2;
          particle.size *= 0.98; // Shrink over time
          break;
        case 'trail':
          particle.vy += 0.05; // Gravity effect
          particle.vx *= 0.98; // Air resistance
          break;
        case 'star':
          // Reset stars that go off screen
          if (particle.y > window.innerHeight + 10) {
            particle.y = -10;
            particle.x = Math.random() * window.innerWidth;
          }
          break;
        case 'explosion':
          particle.vy += 0.05; // Gravity
          particle.vx *= 0.95; // Air resistance
          break;
        case 'boss_explosion':
          particle.vy += 0.03; // Light gravity
          particle.vx *= 0.98;
          break;
      }
      
      // Remove dead particles
      if (particle.life <= 0 && particle.type !== 'star') {
        this.particles.splice(i, 1);
      }
    }
    
    // Limit particles for performance
    if (this.particles.length > this.maxParticles) {
      this.particles.splice(0, this.particles.length - this.maxParticles);
    }
  }

  // Render all particles
  render(ctx) {
    ctx.save();
    
    for (const particle of this.particles) {
      const alpha = particle.type === 'star' ? particle.brightness : particle.life;
      
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      
      // Special rendering for different particle types
      switch (particle.type) {
        case 'sparkle':
          // Twinkling star effect
          const twinkleSize = particle.size * (1 + Math.sin(particle.twinkle) * 0.3);
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, twinkleSize, 0, Math.PI * 2);
          ctx.fill();
          // Add cross sparkle
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x - twinkleSize * 2, particle.y);
          ctx.lineTo(particle.x + twinkleSize * 2, particle.y);
          ctx.moveTo(particle.x, particle.y - twinkleSize * 2);
          ctx.lineTo(particle.x, particle.y + twinkleSize * 2);
          ctx.stroke();
          break;
          
        case 'star':
          // Simple star
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          break;
          
        case 'trail':
          // Glowing trail particle
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 2
          );
          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
          ctx.fill();
          break;
          
        default:
          // Standard circular particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          break;
      }
    }
    
    ctx.restore();
  }

  // Clear all particles (useful for level transitions)
  clear() {
    this.particles = [];
  }

  // Get particle count for performance monitoring
  getParticleCount() {
    return this.particles.length;
  }

  // Reduce particles for performance if needed
  optimizePerformance() {
    if (this.particles.length > this.maxParticles * 0.8) {
      // Remove oldest non-star particles
      const nonStars = this.particles.filter(p => p.type !== 'star');
      const stars = this.particles.filter(p => p.type === 'star');
      
      // Keep newest particles
      const keepAmount = Math.floor(this.maxParticles * 0.6);
      this.particles = [
        ...stars,
        ...nonStars.slice(-keepAmount)
      ];
    }
  }
}

export default ParticleSystem;