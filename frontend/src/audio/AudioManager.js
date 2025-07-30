class AudioManager {
  constructor() {
    this.audioContext = null;
    this.masterVolume = 0.7; 
    this.musicVolume = 0.0; // MUSIC DISABLED BY DEFAULT
    this.sfxVolume = 0.8; 
    this.currentMusic = null;
    this.currentMusicAudio = null;
    this.musicTracks = {};
    this.soundEffects = {};
    this.isMuted = false;
    this.musicDisabled = true; // MUSIC COMPLETELY DISABLED
    this.currentMusicNodes = [];
    
    this.initializeAudio();
    this.loadBasicAudioAssets();
  }
  
  initializeAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = this.masterVolume;
      
      this.musicGain = this.audioContext.createGain();
      this.musicGain.connect(this.masterGain);
      this.musicGain.gain.value = 0; // MUSIC DISABLED
      
      this.sfxGain = this.audioContext.createGain();
      this.sfxGain.connect(this.masterGain);
      this.sfxGain.gain.value = this.sfxVolume;
      
      console.log('🎼 Minimal AudioManager initialized (Music DISABLED)');
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
      this.useHTMLAudio = true;
    }
  }
  
  loadBasicAudioAssets() {
    // Minimal sound effects only - no music files needed
    this.soundEffects = {
      power_up_collect: { 
        name: 'Power-Up Collect', 
        src: '/sounds/sfx/powerup_collect.wav',
        fallback: { type: 'square', freq: 800, duration: 0.3 }
      },
      player_hit: { 
        name: 'Player Hit', 
        src: '/sounds/sfx/player_hit.wav',
        fallback: { type: 'sawtooth', freq: 150, duration: 0.2 }
      },
      blaster_shot: { 
        name: 'Blaster Shot', 
        src: '/sounds/sfx/blaster_shot.wav',
        fallback: { type: 'square', freq: 400, duration: 0.1 }
      },
      enemy_explosion: { 
        name: 'Enemy Explosion', 
        src: '/sounds/sfx/enemy_explosion.wav',
        fallback: { type: 'noise', freq: 200, duration: 0.4 }
      },
      boss_roar: { 
        name: 'Boss Roar', 
        src: '/sounds/sfx/boss_roar.wav',
        fallback: { type: 'sawtooth', freq: 80, duration: 1.0 }
      }
    };
    
    console.log('🔊 Minimal audio system loaded - MUSIC DISABLED');
    console.log(`🔊 ${Object.keys(this.soundEffects).length} basic sound effects available`);
  }

  // Music playback - DISABLED FOR NOW
  playMusic(level) {
    if (this.musicDisabled) {
      console.log('🔇 Music is disabled - no music will play');
      return;
    }
    
    if (this.isMuted) {
      console.log('🔇 Music muted - not playing');
      return;
    }
    
    // If music is enabled in the future, we can add simple HTML5 audio here
    console.log(`🎵 Music for level ${level} would play here (currently disabled)`);
  }

  // Simple sound effects with basic fallback
  playSound(soundName, options = {}) {
    if (this.isMuted) return;
    
    const sound = this.soundEffects[soundName];
    if (!sound) {
      console.warn(`🔊 Sound not found: ${soundName}`);
      return;
    }
    
    // Try HTML5 audio first
    const audio = new Audio();
    audio.src = sound.src;
    audio.volume = (options.volume || 1.0) * this.sfxVolume;
    
    audio.addEventListener('canplaythrough', () => {
      audio.play().catch(() => {
        console.log(`🔊 Using fallback audio for: ${soundName}`);
        this.playFallbackSound(soundName, options);
      });
    });
    
    audio.addEventListener('error', () => {
      console.log(`🔊 Audio file not found, using fallback for: ${soundName}`);
      this.playFallbackSound(soundName, options);
    });
    
    audio.load();
  }

  // Simple fallback sound generation
  playFallbackSound(soundName, options = {}) {
    if (!this.audioContext) return;
    
    try {
      const sound = this.soundEffects[soundName];
      if (!sound || !sound.fallback) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.sfxGain);
      
      const profile = sound.fallback;
      oscillator.type = profile.type;
      oscillator.frequency.value = profile.freq;
      
      gainNode.gain.setValueAtTime(0.3 * this.sfxVolume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + profile.duration);
      
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + profile.duration);
      
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }

  // Volume controls
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.value = this.masterVolume;
    }
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGain) {
      this.musicGain.gain.value = this.musicVolume;
    }
    if (this.currentMusicAudio) {
      this.currentMusicAudio.volume = this.musicVolume;
    }
  }

  setSfxVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.sfxVolume;
    }
  }

  // Mute/unmute controls
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      if (this.currentMusicAudio) {
        this.currentMusicAudio.pause();
      }
      if (this.masterGain) {
        this.masterGain.gain.value = 0;
      }
      console.log('🔇 Audio muted');
    } else {
      if (this.currentMusicAudio) {
        this.currentMusicAudio.play();
      }
      if (this.masterGain) {
        this.masterGain.gain.value = this.masterVolume;
      }
      console.log('🔊 Audio unmuted');
    }
    
    return this.isMuted;
  }

  // Individual mute/unmute methods for game compatibility
  mute() {
    if (!this.isMuted) {
      this.toggleMute();
    }
  }

  unmute() {
    if (this.isMuted) {
      this.toggleMute();
    }
  }

  // Alias for playSound to match game expectations
  playSFX(soundName, options = {}) {
    return this.playSound(soundName, options);
  }

  // Power-up specific sound method
  playPowerUpSound(powerUpType = 'default') {
    const powerUpSounds = {
      speed: 'speed_boost',
      shield: 'shield_activate', 
      blaster: 'blaster_unlock',
      default: 'power_up_collect'
    };
    
    const soundName = powerUpSounds[powerUpType] || powerUpSounds.default;
    this.playSound(soundName);
  }

  // Audio quality setting (for mobile optimization)
  setAudioQuality(quality) {
    console.log(`🎼 Audio quality set to: ${quality}`);
    // In a real implementation, this would adjust audio parameters
    // For now, we'll just log it since our fallback system is already optimized
  }

  // Resume audio context for auto-play policies
  resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().then(() => {
        console.log('🎵 Audio context resumed');
      });
    }
  }

  // Stop all audio
  stopAllAudio() {
    if (this.currentMusicAudio) {
      this.currentMusicAudio.pause();
      this.currentMusicAudio = null;
    }
    
    this.currentMusicNodes.forEach(node => {
      try { node.stop(); } catch(e) {}
    });
    this.currentMusicNodes = [];
    
    this.currentMusic = null;
    console.log('🔇 All audio stopped');
  }
}

// Export the class directly (not instance) so it can be instantiated
export default AudioManager;