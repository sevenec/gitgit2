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
    
    // Render background
    this.renderBackground(gameEngine.currentLevel);
    
    switch (gameEngine.gameState) {
      case 'menu':
        this.renderMenu();
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
    // Render player
    if (gameEngine.player) {
      this.drawButterfly(
        gameEngine.player.x, 
        gameEngine.player.y, 
        0,
        1,
        gameEngine.player.hasShield
      );
    }
    
    // Render obstacles
    gameEngine.obstacles.forEach(obstacle => {
      if (obstacle.type === 'boss_projectile') {
        this.drawBossProjectile(obstacle);
      } else {
        this.drawObstacle(obstacle);
      }
    });
    
    // Render power-ups
    gameEngine.powerUps.forEach(powerUp => {
      this.drawPowerUp(powerUp);
    });
    
    // Render particles
    gameEngine.particles.forEach(particle => {
      this.ctx.globalAlpha = particle.alpha;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    this.ctx.globalAlpha = 1;
    
    // Render boss
    if (gameEngine.boss) {
      this.drawBoss(gameEngine.boss);
    }
    
    // Render UI
    this.renderUI(gameEngine);
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
  
  drawBoss(boss) {
    this.ctx.save();
    this.ctx.translate(boss.x, boss.y);
    
    // Boss body (large menacing insect)
    this.ctx.fillStyle = '#4B0082';
    this.ctx.strokeStyle = '#8B008B';
    this.ctx.lineWidth = 3;
    
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, boss.width / 2, boss.height / 2, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
    
    // Boss eyes
    this.ctx.fillStyle = '#FF0000';
    this.ctx.beginPath();
    this.ctx.arc(-boss.width/4, -boss.height/4, 8, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.arc(boss.width/4, -boss.height/4, 8, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Boss tentacles/appendages
    this.ctx.strokeStyle = '#8B008B';
    this.ctx.lineWidth = 4;
    
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const startX = Math.cos(angle) * boss.width / 3;
      const startY = Math.sin(angle) * boss.height / 3;
      const endX = Math.cos(angle) * boss.width / 2;
      const endY = Math.sin(angle) * boss.height / 2;
      
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();
    }
    
    // Boss health bar
    const barWidth = boss.width;
    const barHeight = 8;
    const barY = -boss.height / 2 - 20;
    
    this.ctx.fillStyle = '#FF0000';
    this.ctx.fillRect(-barWidth / 2, barY, barWidth, barHeight);
    
    this.ctx.fillStyle = '#00FF00';
    const healthPercent = boss.health / boss.maxHealth;
    this.ctx.fillRect(-barWidth / 2, barY, barWidth * healthPercent, barHeight);
    
    this.ctx.strokeStyle = '#FFFFFF';
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
}