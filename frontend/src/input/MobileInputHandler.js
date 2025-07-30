class MobileInputHandler {
  constructor(canvas) {
    this.canvas = canvas;
    this.isTouch = 'ontouchstart' in window;
    this.touches = new Map();
    this.smoothedInput = { x: 0, y: 0 };
    this.inputHistory = [];
    this.maxHistoryLength = 5;
    
    // Touch sensitivity settings
    this.touchSensitivity = 1.0;
    this.deadZone = 10; // Minimum movement to register
    this.smoothingFactor = 0.7; // Higher = more smoothing
    
    // Visual feedback
    this.touchIndicator = {
      x: 0,
      y: 0,
      visible: false,
      size: 0,
      targetSize: 30,
      alpha: 0
    };

    // Performance optimization
    this.lastUpdateTime = 0;
    this.updateThrottle = 8; // ms between updates (120 fps max)
    
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Touch events for mobile
    if (this.isTouch) {
      this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
      this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
      this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
      this.canvas.addEventListener('touchcancel', this.handleTouchEnd.bind(this), { passive: false });
    }

    // Mouse events for desktop (with mobile-like behavior)
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));

    // Prevent context menu on mobile
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  handleTouchStart(event) {
    event.preventDefault();
    
    for (const touch of event.changedTouches) {
      const rect = this.canvas.getBoundingClientRect();
      const x = (touch.clientX - rect.left) * (this.canvas.width / rect.width);
      const y = (touch.clientY - rect.top) * (this.canvas.height / rect.height);
      
      this.touches.set(touch.identifier, { x, y, startX: x, startY: y });
      this.updateTouchIndicator(x, y, true);
    }
  }

  handleTouchMove(event) {
    event.preventDefault();
    
    const now = performance.now();
    if (now - this.lastUpdateTime < this.updateThrottle) {
      return; // Throttle for performance
    }
    this.lastUpdateTime = now;
    
    for (const touch of event.changedTouches) {
      if (this.touches.has(touch.identifier)) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (touch.clientX - rect.left) * (this.canvas.width / rect.width);
        const y = (touch.clientY - rect.top) * (this.canvas.height / rect.height);
        
        const touchData = this.touches.get(touch.identifier);
        touchData.x = x;
        touchData.y = y;
        
        this.updateTouchIndicator(x, y, true);
        this.updateSmoothedInput(x, y);
      }
    }
  }

  handleTouchEnd(event) {
    event.preventDefault();
    
    for (const touch of event.changedTouches) {
      this.touches.delete(touch.identifier);
    }
    
    if (this.touches.size === 0) {
      this.updateTouchIndicator(0, 0, false);
    }
  }

  handleMouseDown(event) {
    if (this.isTouch) return; // Don't handle mouse if touch is available
    
    const rect = this.canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (this.canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (this.canvas.height / rect.height);
    
    this.touches.set('mouse', { x, y, startX: x, startY: y });
    this.updateTouchIndicator(x, y, true);
  }

  handleMouseMove(event) {
    if (this.isTouch || !this.touches.has('mouse')) return;
    
    const now = performance.now();
    if (now - this.lastUpdateTime < this.updateThrottle) {
      return;
    }
    this.lastUpdateTime = now;
    
    const rect = this.canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (this.canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (this.canvas.height / rect.height);
    
    const touchData = this.touches.get('mouse');
    touchData.x = x;
    touchData.y = y;
    
    this.updateTouchIndicator(x, y, true);
    this.updateSmoothedInput(x, y);
  }

  handleMouseUp(event) {
    if (this.isTouch) return;
    
    this.touches.delete('mouse');
    this.updateTouchIndicator(0, 0, false);
  }

  updateSmoothedInput(rawX, rawY) {
    // Add to input history for smoothing
    this.inputHistory.push({ x: rawX, y: rawY, time: performance.now() });
    
    // Limit history length
    if (this.inputHistory.length > this.maxHistoryLength) {
      this.inputHistory.shift();
    }
    
    // Calculate smoothed input using weighted average
    let weightedX = 0;
    let weightedY = 0;
    let totalWeight = 0;
    
    for (let i = 0; i < this.inputHistory.length; i++) {
      const weight = (i + 1) / this.inputHistory.length; // Recent inputs have more weight
      weightedX += this.inputHistory[i].x * weight;
      weightedY += this.inputHistory[i].y * weight;
      totalWeight += weight;
    }
    
    if (totalWeight > 0) {
      const targetX = weightedX / totalWeight;
      const targetY = weightedY / totalWeight;
      
      // Apply smoothing
      this.smoothedInput.x = this.smoothedInput.x * this.smoothingFactor + 
                            targetX * (1 - this.smoothingFactor);
      this.smoothedInput.y = this.smoothedInput.y * this.smoothingFactor + 
                            targetY * (1 - this.smoothingFactor);
    }
  }

  updateTouchIndicator(x, y, visible) {
    this.touchIndicator.x = x;
    this.touchIndicator.y = y;
    this.touchIndicator.visible = visible;
    
    if (visible) {
      this.touchIndicator.targetSize = 40;
      this.touchIndicator.alpha = Math.min(1, this.touchIndicator.alpha + 0.1);
    } else {
      this.touchIndicator.targetSize = 20;
      this.touchIndicator.alpha = Math.max(0, this.touchIndicator.alpha - 0.05);
    }
  }

  // Get current input position with smoothing
  getInput() {
    if (this.touches.size === 0) {
      return null;
    }
    
    // Return smoothed input for better control
    return {
      x: this.smoothedInput.x,
      y: this.smoothedInput.y,
      raw: this.getRawInput()
    };
  }

  // Get raw input without smoothing
  getRawInput() {
    if (this.touches.size === 0) {
      return null;
    }
    
    // Use first touch for simplicity
    const firstTouch = this.touches.values().next().value;
    return { x: firstTouch.x, y: firstTouch.y };
  }

  // Check if currently touching
  isActive() {
    return this.touches.size > 0;
  }

  // Get touch velocity for gesture recognition
  getTouchVelocity() {
    if (this.inputHistory.length < 2) {
      return { vx: 0, vy: 0 };
    }
    
    const recent = this.inputHistory[this.inputHistory.length - 1];
    const previous = this.inputHistory[this.inputHistory.length - 2];
    const deltaTime = recent.time - previous.time;
    
    if (deltaTime === 0) {
      return { vx: 0, vy: 0 };
    }
    
    return {
      vx: (recent.x - previous.x) / deltaTime * 1000, // pixels per second
      vy: (recent.y - previous.y) / deltaTime * 1000
    };
  }

  // Update touch indicator animation
  updateTouchIndicator() {
    // Animate size
    const sizeDiff = this.touchIndicator.targetSize - this.touchIndicator.size;
    this.touchIndicator.size += sizeDiff * 0.2;
  }

  // Render touch indicator
  renderTouchIndicator(ctx) {
    if (!this.touchIndicator.visible || this.touchIndicator.alpha <= 0) {
      return;
    }
    
    this.updateTouchIndicator();
    
    ctx.save();
    ctx.globalAlpha = this.touchIndicator.alpha * 0.3;
    
    // Outer ring
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.touchIndicator.x, this.touchIndicator.y, this.touchIndicator.size, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner dot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.touchIndicator.x, this.touchIndicator.y, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  // Adjust sensitivity for different screen sizes
  adjustSensitivity(screenSize) {
    if (screenSize === 'small') {
      this.touchSensitivity = 1.2;
      this.smoothingFactor = 0.8;
    } else if (screenSize === 'large') {
      this.touchSensitivity = 0.8;
      this.smoothingFactor = 0.6;
    } else {
      this.touchSensitivity = 1.0;
      this.smoothingFactor = 0.7;
    }
  }

  // Performance optimization methods
  optimizeForPerformance() {
    this.updateThrottle = 16; // Reduce to 60fps
    this.maxHistoryLength = 3; // Reduce history
    this.smoothingFactor = 0.5; // Less smoothing
  }

  // Cleanup
  destroy() {
    // Remove all event listeners
    this.canvas.removeEventListener('touchstart', this.handleTouchStart);
    this.canvas.removeEventListener('touchmove', this.handleTouchMove);
    this.canvas.removeEventListener('touchend', this.handleTouchEnd);
    this.canvas.removeEventListener('touchcancel', this.handleTouchEnd);
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mouseup', this.handleMouseUp);
    this.canvas.removeEventListener('mouseleave', this.handleMouseUp);
    this.canvas.removeEventListener('contextmenu', (e) => e.preventDefault());
  }
}

export default MobileInputHandler;