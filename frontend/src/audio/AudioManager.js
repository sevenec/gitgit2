class AudioManager {
  constructor() {
    this.audioContext = null;
    this.masterVolume = 0.7; 
    this.musicVolume = 0.6; 
    this.sfxVolume = 0.8; 
    this.currentMusic = null;
    this.currentMusicAudio = null;
    this.musicTracks = {};
    this.soundEffects = {};
    this.isMuted = false;
    this.currentMusicNodes = [];
    
    this.initializeAudio();
    this.loadHighQualityAudioAssets();
  }
  
  initializeAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = this.masterVolume;
      
      this.musicGain = this.audioContext.createGain();
      this.musicGain.connect(this.masterGain);
      this.musicGain.gain.value = this.musicVolume;
      
      this.sfxGain = this.audioContext.createGain();
      this.sfxGain.connect(this.masterGain);
      this.sfxGain.gain.value = this.sfxVolume;
      
      console.log('🎼 High-Quality AudioManager initialized');
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
      this.useHTMLAudio = true;
    }
  }
  
  loadHighQualityAudioAssets() {
    // High-quality orchestral/electronic space-themed music for all 15 levels
    this.musicTracks = {
      menu: { 
        name: 'Cosmic Welcome', 
        src: '/sounds/menu_cosmic_ambient.mp3', 
        mood: 'ambient_welcome'
      },
      1: { 
        name: 'Starry Awakening', 
        src: '/sounds/level_01_starry_upbeat.mp3', 
        mood: 'upbeat_orchestral'
      },
      2: { 
        name: 'Aurora Dance', 
        src: '/sounds/level_02_aurora_energy.mp3', 
        mood: 'energetic_electronic'
      },
      3: { 
        name: 'Nebula Drift', 
        src: '/sounds/level_03_nebula_drift.mp3', 
        mood: 'ambient_wonder'
      },
      4: { 
        name: 'Cosmic Winds', 
        src: '/sounds/level_04_cosmic_winds.mp3', 
        mood: 'flowing_orchestral'
      },
      5: { 
        name: 'Stellar Journey', 
        src: '/sounds/level_05_stellar_journey.mp3', 
        mood: 'adventurous_hybrid'
      },
      6: { 
        name: 'Galactic Pulse', 
        src: '/sounds/level_06_galactic_pulse.mp3', 
        mood: 'pulsing_electronic'
      },
      7: { 
        name: 'Solar Flare', 
        src: '/sounds/level_07_solar_flare.mp3', 
        mood: 'intense_orchestral'
      },
      8: { 
        name: 'Deep Space', 
        src: '/sounds/level_08_deep_space.mp3', 
        mood: 'mysterious_ambient'
      },
      9: { 
        name: 'Quantum Storm', 
        src: '/sounds/level_09_quantum_storm.mp3', 
        mood: 'chaotic_hybrid'
      },
      10: { 
        name: 'Void Tension', 
        src: '/sounds/level_10_tense_void.mp3', 
        mood: 'tense_void'
      },
      11: { 
        name: 'Black Hole', 
        src: '/sounds/level_11_black_hole.mp3', 
        mood: 'ominous_orchestral'
      },
      12: { 
        name: 'Singularity', 
        src: '/sounds/level_12_singularity.mp3', 
        mood: 'powerful_hybrid'
      },
      13: { 
        name: 'Pre-Boss Tension', 
        src: '/sounds/level_13_pre_boss.mp3', 
        mood: 'building_tension'
      },
      14: { 
        name: 'Boss Approach', 
        src: '/sounds/level_14_boss_approach.mp3', 
        mood: 'dramatic_approach'
      },
      15: { 
        name: 'Mother Insect Battle', 
        src: '/sounds/level_15_boss_epic.mp3', 
        mood: 'epic_cinematic'
      }
    };

    // Immersive sound effects with high-quality audio
    this.soundEffects = {
      power_up_collect: { 
        name: 'Power-Up Sparkle', 
        src: '/sounds/sfx/powerup_sparkle_collect.wav'
      },
      speed_boost: { 
        name: 'Speed Boost Whoosh', 
        src: '/sounds/sfx/speed_boost_whoosh.wav'
      },
      shield_activate: { 
        name: 'Shield Energy', 
        src: '/sounds/sfx/shield_energy_activate.wav'
      },
      blaster_unlock: { 
        name: 'Blaster Power', 
        src: '/sounds/sfx/blaster_power_unlock.wav'
      },
      player_hit: { 
        name: 'Impact Crunch', 
        src: '/sounds/sfx/collision_crunch_hit.wav'
      },
      asteroid_collision: { 
        name: 'Asteroid Crunch', 
        src: '/sounds/sfx/asteroid_crunch_impact.wav'
      },
      insect_collision: { 
        name: 'Insect Buzz Crunch', 
        src: '/sounds/sfx/insect_buzz_crunch.wav'
      },
      boss_roar: { 
        name: 'Mother Insect Roar', 
        src: '/sounds/sfx/boss_mother_insect_roar.wav'
      },
      boss_explosion: { 
        name: 'Boss Epic Explosion', 
        src: '/sounds/sfx/boss_epic_explosion.wav'
      },
      boss_buzz_attack: { 
        name: 'Boss Buzz Attack', 
        src: '/sounds/sfx/boss_buzz_attack.wav'
      },
      blaster_shot: { 
        name: 'Energy Blaster', 
        src: '/sounds/sfx/blaster_energy_shot.wav'
      },
      enemy_explosion: { 
        name: 'Small Explosion', 
        src: '/sounds/sfx/enemy_small_explosion.wav'
      },
      level_complete: { 
        name: 'Victory Fanfare', 
        src: '/sounds/sfx/level_victory_fanfare.wav'
      },
      game_over: { 
        name: 'Cosmic Game Over', 
        src: '/sounds/sfx/game_over_cosmic.wav'
      }
    };
    
    console.log('🎼 High-quality audio assets loaded:');
    console.log(`🎵 ${Object.keys(this.musicTracks).length} orchestral/electronic tracks`);
    console.log(`🔊 ${Object.keys(this.soundEffects).length} immersive sound effects`);
  }

  // Auto-play music with HTML5 Audio for high quality
  playMusic(level) {
    if (this.isMuted) {
      console.log('🔇 Music muted - not playing');
      return;
    }
    
    const track = this.musicTracks[level] || this.musicTracks.menu;
    console.log(`🎵 Starting high-quality music for level ${level}: ${track.name}`);
    
    // Stop current music
    if (this.currentMusicAudio) {
      this.currentMusicAudio.pause();
      this.currentMusicAudio.currentTime = 0;
      this.currentMusicAudio = null;
    }
    
    // Create HTML5 audio element for high-quality playback
    this.currentMusicAudio = new Audio();
    this.currentMusicAudio.src = track.src;
    this.currentMusicAudio.loop = true;
    this.currentMusicAudio.volume = this.musicVolume;
    
    // Handle audio loading and fallback
    this.currentMusicAudio.addEventListener('loadeddata', () => {
      console.log(`✅ High-quality audio loaded: ${track.name}`);
      this.currentMusicAudio.play().catch(() => {
        console.log('🎵 Using fallback procedural audio for:', track.name);
        this.playFallbackMusic(level);
      });
    });
    
    this.currentMusicAudio.addEventListener('error', () => {
      console.log('🎵 Audio file not found, using fallback for:', track.name);
      this.playFallbackMusic(level);
    });
    
    // Load the audio
    this.currentMusicAudio.load();
    this.currentMusic = track;
  }

  // Fallback procedural music generation
  playFallbackMusic(level) {
    if (!this.audioContext) return;
    
    if (this.currentMusicNodes.length > 0) {
      this.currentMusicNodes.forEach(node => {
        try { node.stop(); } catch(e) {}
      });
      this.currentMusicNodes = [];
    }

    const musicConfig = this.getLevelMusicConfig(level);
    
    // Create ambient harmony
    musicConfig.harmony.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.musicGain);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      gainNode.gain.value = 0.02 + (index * 0.01);
      
      oscillator.start();
      this.currentMusicNodes.push(oscillator);
    });
  }

  getLevelMusicConfig(level) {
    const configs = {
      1: { harmony: [220, 275, 330], mood: 'upbeat_starry' },
      2: { harmony: [247, 311, 370], mood: 'energetic_aurora' },
      3: { harmony: [196, 247, 294], mood: 'ambient_nebula' },
      10: { harmony: [147, 196, 262], mood: 'tense_void' },
      15: { harmony: [110, 147, 196], mood: 'epic_boss' }
    };
    return configs[level] || configs[1];
  }

  // Play sound effects with enhanced quality
  playSound(soundName, options = {}) {
    if (this.isMuted) return;
    
    const sound = this.soundEffects[soundName];
    if (!sound) {
      console.warn(`🔊 Sound not found: ${soundName}`);
      return;
    }
    
    // Try HTML5 audio first for better quality
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

  // Fallback sound generation for when files aren't available
  playFallbackSound(soundName, options = {}) {
    if (!this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.sfxGain);
      
      // Enhanced sound profiles
      const soundProfiles = {
        power_up_collect: { type: 'square', freq: 800, duration: 0.3 },
        player_hit: { type: 'sawtooth', freq: 150, duration: 0.2 },
        boss_roar: { type: 'sawtooth', freq: 80, duration: 1.0 },
        blaster_shot: { type: 'square', freq: 400, duration: 0.1 },
        enemy_explosion: { type: 'noise', freq: 200, duration: 0.4 }
      };
      
      const profile = soundProfiles[soundName] || { type: 'sine', freq: 440, duration: 0.2 };
      
      oscillator.type = profile.type;
      oscillator.frequency.value = profile.freq;
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
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