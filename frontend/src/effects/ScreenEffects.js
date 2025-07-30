class ScreenEffects {
  constructor() {
    // Screen shake properties
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
    this.shakeX = 0;
    this.shakeY = 0;
    this.originalShakeIntensity = 0;
    
    // Flash effects
    this.flashAlpha = 0;
    this.flashColor = '#ffffff';
    this.flashDecay = 0;
    
    // Screen tint effects
    this.tintAlpha = 0;
    this.tintColor = '#ff0000';
    this.tintDecay = 0;
    
    // Performance optimization
    this.lastFrameTime = 0;
    this.targetFPS = 60;
    this.frameInterval = 1000 / this.targetFPS;
  }

  // Trigger screen shake (intensity: 1-10, duration in milliseconds)
  shake(intensity = 5, duration = 300) {
    this.shakeIntensity = Math.min(intensity, 10); // Cap at 10 for mobile comfort
    this.shakeDuration = duration;
    this.originalShakeIntensity = this.shakeIntensity;
  }

  // Trigger screen flash (color, intensity 0-1, duration in milliseconds)
  flash(color = '#ffffff', intensity = 0.3, duration = 150) {
    this.flashColor = color;
    this.flashAlpha = Math.min(intensity, 1);
    this.flashDecay = this.flashAlpha / (duration / 16.67); // Assuming 60 FPS
  }

  // Trigger screen tint (for health/damage indication)
  tint(color = '#ff0000', intensity = 0.2, duration = 200) {
    this.tintColor = color;
    this.tintAlpha = Math.min(intensity, 1);
    this.tintDecay = this.tintAlpha / (duration / 16.67);
  }

  // Special effect combinations
  hitEffect() {
    this.shake(3, 200); // Mild shake
    this.flash('#ff4444', 0.2, 100); // Red flash
    this.tint('#ff0000', 0.15, 300); // Red tint
  }

  powerUpEffect() {
    this.shake(2, 150); // Gentle shake
    this.flash('#ffd700', 0.3, 200); // Golden flash
  }

  bossHitEffect() {
    this.shake(6, 400); // Strong shake
    this.flash('#ff6b6b', 0.4, 250); // Strong red flash
  }

  levelCompleteEffect() {
    this.shake(4, 300); // Victory shake
    this.flash('#00ff88', 0.3, 300); // Green flash
  }

  // Update effects (call every frame)
  update(deltaTime = 16.67) {
    // Optimize updates for mobile performance
    const now = performance.now();
    if (now - this.lastFrameTime < this.frameInterval) {
      return; // Skip frame if running too fast
    }
    this.lastFrameTime = now;

    // Update screen shake
    if (this.shakeDuration > 0) {
      this.shakeDuration -= deltaTime;
      
      // Calculate shake intensity with decay
      const progress = Math.max(0, this.shakeDuration / 300); // Normalize to 300ms
      this.shakeIntensity = this.originalShakeIntensity * progress;
      
      // Generate shake offset
      this.shakeX = (Math.random() - 0.5) * this.shakeIntensity * 2;
      this.shakeY = (Math.random() - 0.5) * this.shakeIntensity * 2;
      
      if (this.shakeDuration <= 0) {
        this.shakeIntensity = 0;
        this.shakeX = 0;
        this.shakeY = 0;
      }
    }

    // Update flash effect
    if (this.flashAlpha > 0) {
      this.flashAlpha = Math.max(0, this.flashAlpha - this.flashDecay);
    }

    // Update tint effect
    if (this.tintAlpha > 0) {
      this.tintAlpha = Math.max(0, this.tintAlpha - this.tintDecay);
    }
  }

  // Apply screen shake to canvas context
  applyShake(ctx) {
    if (this.shakeIntensity > 0) {
      ctx.translate(this.shakeX, this.shakeY);
    }
  }

  // Render screen effects (call after main game render)
  renderEffects(ctx, canvas) {
    // Flash effect
    if (this.flashAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = this.flashAlpha;
      ctx.fillStyle = this.flashColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    // Tint effect
    if (this.tintAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = this.tintAlpha;
      ctx.fillStyle = this.tintColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
  }

  // Health-based tint (0-100 health)
  updateHealthTint(health, maxHealth = 100) {
    const healthPercent = Math.max(0, Math.min(1, health / maxHealth));
    
    if (healthPercent < 0.3) {
      // Critical health - strong red tint
      this.tint('#ff0000', 0.3 * (1 - healthPercent / 0.3), 100);
    } else if (healthPercent < 0.6) {
      // Low health - mild red tint
      this.tint('#ff4444', 0.15 * (1 - (healthPercent - 0.3) / 0.3), 100);
    }
  }

  // Smooth camera effects for enhanced visuals
  createImpactEffect(x, y, canvas) {
    // Calculate screen-relative position for directional effects
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const deltaX = x - centerX;
    const deltaY = y - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Directional shake based on impact location
    if (distance > 0) {
      const directionX = deltaX / distance;
      const directionY = deltaY / distance;
      
      // Apply directional shake
      this.shakeX += directionX * this.shakeIntensity * 0.5;
      this.shakeY += directionY * this.shakeIntensity * 0.5;
    }
  }

  // Performance monitoring
  getEffectIntensity() {
    return {
      shake: this.shakeIntensity,
      flash: this.flashAlpha,
      tint: this.tintAlpha
    };
  }

  // Disable effects for low-end devices
  disableEffects() {
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
    this.flashAlpha = 0;
    this.tintAlpha = 0;
  }

  // Check if any effects are active
  hasActiveEffects() {
    return this.shakeIntensity > 0 || this.flashAlpha > 0 || this.tintAlpha > 0;
  }
}

export default ScreenEffects;