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

  // Fallback procedural music generation with HIGH-QUALITY orchestral/electronic sounds
  playFallbackMusic(level) {
    if (!this.audioContext) return;
    
    // Stop any existing music cleanly
    if (this.currentMusicNodes.length > 0) {
      this.currentMusicNodes.forEach(node => {
        try { 
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch(e) {}
      });
      this.currentMusicNodes = [];
    }

    console.log(`🎼 Creating HIGH-QUALITY orchestral/electronic music for level ${level}`);
    
    const musicConfig = this.getHighQualityMusicConfig(level);
    
    // Create rich harmonic foundation with proper orchestral voicing
    this.createOrchestralHarmony(musicConfig);
    
    // Add electronic elements for space atmosphere
    this.createElectronicPad(musicConfig);
    
    // Create melodic content based on level theme
    this.createDynamicMelody(musicConfig);
    
    // Add rhythmic elements for energy
    if (musicConfig.hasRhythm) {
      this.createRhythmSection(musicConfig);
    }
  }

  getHighQualityMusicConfig(level) {
    const configs = {
      menu: { 
        name: 'Cosmic Welcome',
        mood: 'ambient_welcome',
        key: 'C',
        harmony: [261.63, 329.63, 392.00], // C4, E4, G4 - C Major
        bassline: [130.81, 164.81, 196.00], // C3, E3, G3
        melody: [523.25, 659.25, 783.99, 659.25, 523.25, 392.00, 329.63],
        tempo: 1500,
        atmosphere: 'ambient',
        hasRhythm: false,
        electronic: true
      },
      1: { 
        name: 'Starry Awakening',
        mood: 'upbeat_orchestral',
        key: 'C',
        harmony: [261.63, 329.63, 392.00], // C4, E4, G4 - C Major
        bassline: [130.81, 164.81, 196.00], // C3, E3, G3
        melody: [523.25, 659.25, 783.99, 659.25, 523.25, 392.00, 329.63],
        tempo: 1200,
        atmosphere: 'bright',
        hasRhythm: true,
        electronic: true
      },
      2: { 
        name: 'Aurora Dance',
        mood: 'energetic_electronic',
        key: 'D',
        harmony: [293.66, 369.99, 440.00], // D4, F#4, A4 - D Major
        bassline: [146.83, 185.00, 220.00],
        melody: [587.33, 739.99, 880.00, 739.99, 587.33, 440.00, 369.99],
        tempo: 1000,
        atmosphere: 'energetic',
        hasRhythm: true,
        electronic: true
      },
      3: { 
        name: 'Nebula Drift',
        mood: 'ambient_wonder',
        key: 'Am',
        harmony: [220.00, 261.63, 329.63], // A3, C4, E4 - A Minor
        bassline: [110.00, 130.81, 164.81],
        melody: [440.00, 523.25, 659.25, 523.25, 440.00, 329.63, 261.63],
        tempo: 1800,
        atmosphere: 'mysterious',
        hasRhythm: false,
        electronic: true
      },
      10: {
        name: 'Void Tension',
        mood: 'tense_void',
        key: 'Fm',
        harmony: [174.61, 220.00, 277.18], // F3, A3, C#4 - F Minor
        bassline: [87.31, 110.00, 138.59],
        melody: [349.23, 440.00, 554.37, 440.00, 349.23, 277.18, 220.00],
        tempo: 2000,
        atmosphere: 'tense',
        hasRhythm: false,
        electronic: true
      },
      15: {
        name: 'Mother Insect Battle',
        mood: 'epic_boss_battle',
        key: 'Dm',
        harmony: [146.83, 174.61, 220.00], // D3, F3, A3 - D Minor
        bassline: [73.42, 87.31, 110.00],
        melody: [293.66, 349.23, 440.00, 523.25, 440.00, 349.23, 293.66],
        tempo: 800,
        atmosphere: 'epic',
        hasRhythm: true,
        electronic: true
      }
    };
    
    // Enterprise-grade fallback system
    const defaultConfig = {
      name: 'Cosmic Default',
      mood: 'ambient_safe',
      key: 'C',
      harmony: [261.63, 329.63, 392.00],
      bassline: [130.81, 164.81, 196.00],
      melody: [523.25, 659.25, 783.99],
      tempo: 1500,
      atmosphere: 'ambient',
      hasRhythm: false,
      electronic: true
    };
    
    const config = configs[level] || configs[Math.min(Math.max(level, 1), 15)] || defaultConfig;
    
    // Validate config integrity
    if (!config.harmony || !config.bassline || !config.melody) {
      console.warn(`⚠️ Invalid music config for level ${level}, using default`);
      return defaultConfig;
    }
    
    return config;
  }

  createOrchestralHarmony(config) {
    // Create rich orchestral harmony using multiple oscillator types
    config.harmony.forEach((freq, index) => {
      // String section simulation
      const stringOsc = this.audioContext.createOscillator();
      const stringGain = this.audioContext.createGain();
      const stringFilter = this.audioContext.createBiquadFilter();
      
      // Use sawtooth for rich harmonic content
      stringOsc.type = 'sawtooth';
      stringOsc.frequency.value = freq;
      
      // Low-pass filter for orchestral warmth
      stringFilter.type = 'lowpass';
      stringFilter.frequency.value = 2000 - (index * 200);
      stringFilter.Q.value = 1;
      
      stringOsc.connect(stringFilter);
      stringFilter.connect(stringGain);
      stringGain.connect(this.musicGain);
      
      // Subtle volume for orchestral blend
      stringGain.gain.value = 0.015 + (index * 0.005);
      
      stringOsc.start();
      this.currentMusicNodes.push(stringOsc);
      
      // Add bassline for foundation
      if (config.bassline && config.bassline[index]) {
        const bassOsc = this.audioContext.createOscillator();
        const bassGain = this.audioContext.createGain();
        const bassFilter = this.audioContext.createBiquadFilter();
        
        bassOsc.type = 'sine';
        bassOsc.frequency.value = config.bassline[index];
        
        bassFilter.type = 'lowpass';
        bassFilter.frequency.value = 300;
        
        bassOsc.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(this.musicGain);
        
        bassGain.gain.value = 0.02;
        
        bassOsc.start();
        this.currentMusicNodes.push(bassOsc);
      }
    });
  }

  createElectronicPad(config) {
    if (!config.electronic) return;
    
    // Add electronic pad for space atmosphere
    config.harmony.forEach((freq, index) => {
      const padOsc = this.audioContext.createOscillator();
      const padGain = this.audioContext.createGain();
      const padFilter = this.audioContext.createBiquadFilter();
      
      // Use triangle for smooth electronic sound
      padOsc.type = 'triangle';
      padOsc.frequency.value = freq * 2; // Octave higher
      
      // Band-pass filter for electronic character
      padFilter.type = 'bandpass';
      padFilter.frequency.value = 800 + (index * 200);
      padFilter.Q.value = 2;
      
      padOsc.connect(padFilter);
      padFilter.connect(padGain);
      padGain.connect(this.musicGain);
      
      // Subtle electronic layer
      padGain.gain.value = 0.008;
      
      padOsc.start();
      this.currentMusicNodes.push(padOsc);
    });
  }

  createDynamicMelody(config) {
    let melodyIndex = 0;
    let melodyOscillator = null;
    
    const playMelodyNote = () => {
      if (this.isMuted || !this.audioContext || !this.currentMusic) return;
      
      // Clean up previous note
      if (melodyOscillator) {
        try { melodyOscillator.stop(); } catch(e) {}
      }
      
      melodyOscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      melodyOscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.musicGain);
      
      // Choose oscillator type based on atmosphere
      switch(config.atmosphere) {
        case 'bright':
          melodyOscillator.type = 'triangle';
          break;
        case 'energetic':
          melodyOscillator.type = 'square';
          break;
        case 'mysterious':
          melodyOscillator.type = 'sine';
          break;
        case 'tense':
          melodyOscillator.type = 'sawtooth';
          break;
        case 'epic':
          melodyOscillator.type = 'triangle';
          break;
        default:
          melodyOscillator.type = 'sine';
      }
      
      melodyOscillator.frequency.value = config.melody[melodyIndex % config.melody.length];
      
      // Filter based on atmosphere
      if (config.atmosphere === 'bright' || config.atmosphere === 'energetic') {
        filter.type = 'bandpass';
        filter.frequency.value = 1500;
        filter.Q.value = 3;
      } else {
        filter.type = 'lowpass';
        filter.frequency.value = 1200;
        filter.Q.value = 1;
      }
      
      const noteLength = config.tempo * 0.0007;
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.025, this.audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + noteLength);
      
      melodyOscillator.start(this.audioContext.currentTime);
      melodyOscillator.stop(this.audioContext.currentTime + noteLength);
      
      melodyIndex++;
      
      // Schedule next note with slight musical variation
      const variation = (Math.random() - 0.5) * (config.tempo * 0.1);
      this.melodyTimeout = setTimeout(playMelodyNote, config.tempo + variation);
    };
    
    // Start melody after a brief delay
    this.melodyTimeout = setTimeout(playMelodyNote, 800);
  }

  createRhythmSection(config) {
    if (!config.hasRhythm) return;
    
    // Add subtle rhythmic element
    const createRhythmPulse = () => {
      if (this.isMuted || !this.audioContext || !this.currentMusic) return;
      
      const pulseOsc = this.audioContext.createOscillator();
      const pulseGain = this.audioContext.createGain();
      const pulseFilter = this.audioContext.createBiquadFilter();
      
      pulseOsc.type = 'square';
      pulseOsc.frequency.value = config.bassline[0] * 0.5; // Sub-bass
      
      pulseFilter.type = 'lowpass';
      pulseFilter.frequency.value = 120;
      
      pulseOsc.connect(pulseFilter);
      pulseFilter.connect(pulseGain);
      pulseGain.connect(this.musicGain);
      
      pulseGain.gain.setValueAtTime(0, this.audioContext.currentTime);
      pulseGain.gain.linearRampToValueAtTime(0.03, this.audioContext.currentTime + 0.01);
      pulseGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
      
      pulseOsc.start(this.audioContext.currentTime);
      pulseOsc.stop(this.audioContext.currentTime + 0.1);
      
      // Schedule next pulse
      setTimeout(createRhythmPulse, config.tempo / 2);
    };
    
    // Start rhythm section
    setTimeout(createRhythmPulse, 1000);
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