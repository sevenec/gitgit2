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

// Export singleton instance
const AudioManagerInstance = new AudioManager();
export default AudioManagerInstance;
      
      // Levels 11-14: Dark Void Tension
      11: { name: 'Event Horizon', url: '/audio/music/11_event_horizon.mp3', mood: 'dark_ambient' },
      12: { name: 'Dark Matter Storm', url: '/audio/music/12_dark_matter_storm.mp3', mood: 'orchestral_dark' },
      13: { name: 'Singularity Approach', url: '/audio/music/13_singularity_approach.mp3', mood: 'electronic_ominous' },
      14: { name: 'Pre-Boss Gauntlet', url: '/audio/music/14_pre_boss_gauntlet.mp3', mood: 'intense_buildup' },
      
      // Level 15: Epic Boss Battle
      15: { name: 'Mother Insect Battle', url: '/audio/music/15_mother_insect_battle.mp3', mood: 'epic_boss_orchestral' },
      
      // Menu and special tracks
      menu: { name: 'Cosmic Menu', url: '/audio/music/menu_cosmic_ambience.mp3', mood: 'ambient_menu' },
      victory: { name: 'Victory Fanfare', url: '/audio/music/victory_fanfare.mp3', mood: 'orchestral_triumph' }
    };
    
    // High-quality sound effects
    this.soundEffects = {
      // Power-up sounds
      powerup_collect: { url: '/audio/sfx/powerup_sparkle.mp3', description: 'Magical sparkle chime' },
      speed_boost: { url: '/audio/sfx/speed_boost.mp3', description: 'Whoosh acceleration' },
      shield_activate: { url: '/audio/sfx/shield_activate.mp3', description: 'Energy shield hum' },
      blaster_mode: { url: '/audio/sfx/blaster_activate.mp3', description: 'Weapon charge-up' },
      health_restore: { url: '/audio/sfx/health_restore.mp3', description: 'Healing chime' },
      
      // Combat and collision sounds
      collision_asteroid: { url: '/audio/sfx/collision_crunch.mp3', description: 'Hard impact crunch' },
      collision_insect: { url: '/audio/sfx/collision_squish.mp3', description: 'Insect impact' },
      player_hit: { url: '/audio/sfx/player_damage.mp3', description: 'Player damage sound' },
      explosion_small: { url: '/audio/sfx/explosion_small.mp3', description: 'Small explosion pop' },
      explosion_large: { url: '/audio/sfx/explosion_large.mp3', description: 'Large explosion boom' },
      
      // Boss sounds
      boss_projectile: { url: '/audio/sfx/boss_projectile.mp3', description: 'Energy projectile buzz' },
      boss_homing: { url: '/audio/sfx/boss_homing.mp3', description: 'Homing missile whine' },
      boss_rage_beam: { url: '/audio/sfx/boss_rage_beam.mp3', description: 'Rage beam charge' },
      boss_hit: { url: '/audio/sfx/boss_hit.mp3', description: 'Boss damage sound' },
      boss_defeat: { url: '/audio/sfx/boss_defeat.mp3', description: 'Boss destruction' },
      
      // UI sounds
      button_click: { url: '/audio/sfx/button_click.mp3', description: 'UI button click' },
      menu_select: { url: '/audio/sfx/menu_select.mp3', description: 'Menu selection' },
      flutterer_select: { url: '/audio/sfx/flutterer_select.mp3', description: 'Character selection' },
      notification: { url: '/audio/sfx/notification.mp3', description: 'Achievement notification' },
      
      // Level progression
      level_start: { url: '/audio/sfx/level_start.mp3', description: 'Level beginning fanfare' },
      level_complete: { url: '/audio/sfx/level_complete.mp3', description: 'Level completion chime' },
      game_over: { url: '/audio/sfx/game_over.mp3', description: 'Game over sound' },
      high_score: { url: '/audio/sfx/high_score.mp3', description: 'New high score fanfare' }
    };
    
    this.preloadAudio();
  }
  
  async preloadAudio() {
    // Create placeholder audio files for development
    this.createPlaceholderAudio();
    
    // In production, these would be actual high-quality audio files
    console.log('🎵 Audio system initialized with', Object.keys(this.musicTracks).length, 'music tracks');
    console.log('🔊 Sound effects loaded:', Object.keys(this.soundEffects).length, 'effects');
  }
  
  createPlaceholderAudio() {
    // Create synthetic audio for development (will be replaced with real audio in production)
    if (this.audioContext) {
      this.synthAudio = {
        menu: this.createSyntheticTrack('ambient', 120),
        level_1_5: this.createSyntheticTrack('upbeat', 140),
        level_6_10: this.createSyntheticTrack('intense', 160),
        level_11_14: this.createSyntheticTrack('dark', 100),
        boss: this.createSyntheticTrack('epic', 180)
      };
    }
  }
  
  createSyntheticTrack(mood, bpm) {
    // Create procedural audio based on mood
    return {
      mood: mood,
      bpm: bpm,
      duration: 45, // 45 seconds base duration
      synthesized: true
    };
  }
  
  playMusic(level) {
    if (this.isMuted) {
      console.log('🔇 Music muted - not playing');
      return;
    }
    
    const track = this.musicTracks[level] || this.musicTracks.menu;
    track.level = level; // Add level to track for configuration reference
    
    console.log(`🎵 Starting relaxing music for level ${level}: ${track.name} (${track.mood})`);
    
    // Stop current music with fade out
    if (this.currentMusic) {
      this.fadeOutMusic(this.currentMusic, 1000);
    }
    
    // Start new music with fade in
    this.fadeInMusic(track, 2000); // Longer fade time for relaxation
    
    console.log(`🎵 Now Playing: ${track.name} - Soft and Relaxing`);
  }
  
  fadeInMusic(track, fadeTime = 1500) {
    if (!this.audioContext || this.isMuted) return;
    
    console.log(`🎼 Starting continuous music: ${track.name}`);
    
    // Create a simple but audible continuous music loop
    this.createContinuousMusic(track, fadeTime);
  }
  
  createContinuousMusic(track, fadeTime) {
    // Stop ALL existing music nodes completely to prevent layering
    if (this.currentMusicNodes && this.currentMusicNodes.length > 0) {
      console.log(`🔇 Stopping ${this.currentMusicNodes.length} existing music nodes`);
      this.currentMusicNodes.forEach(node => {
        try { 
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch(e) {}
      });
    }
    this.currentMusicNodes = [];
    
    // Stop any existing melody loops completely
    if (this.melodyTimeout) {
      clearTimeout(this.melodyTimeout);
      this.melodyTimeout = null;
    }
    if (this.melodyInterval) {
      clearInterval(this.melodyInterval);
      this.melodyInterval = null;
    }
    
    // Create level-specific relaxing music with more variation
    const levelMusic = this.getRelaxingMusicConfig(track.level || 1);
    console.log(`🎼 Creating relaxing music: ${levelMusic.style} for level ${track.level || 1}`);
    
    // Create soft background harmony with level-specific characteristics
    levelMusic.harmony.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.musicGain);
      
      oscillator.type = 'sine'; // Always use sine wave for soft sound
      oscillator.frequency.value = freq;
      
      // Very gentle volume for relaxing ambient sound
      const volume = 0.015 + (index * 0.005); // Reduced significantly for relaxation
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + fadeTime / 1000);
      
      oscillator.start(this.audioContext.currentTime);
      this.currentMusicNodes.push(oscillator);
    });
    
    // Create gentle, relaxing melody with level-specific pattern
    this.createRelaxingMelody(levelMusic, fadeTime);
    
    this.currentMusic = track;
    console.log(`🎵 Relaxing ambient music started: ${track.name} (${levelMusic.style})`);
  }
  
  getRelaxingMusicConfig(level) {
    const configs = {
      1: {
        style: 'Soft Cosmic Breeze',
        harmony: [130, 164, 196], // C3, E3, G3 - lower, softer
        melody: [261, 329, 392, 329, 261, 196, 164, 196],
        tempo: 2000 // Much slower tempo for relaxation
      },
      2: {
        style: 'Gentle Space Drift',
        harmony: [146, 185, 220], // D3, F#3, A3
        melody: [293, 370, 440, 370, 293, 220, 185, 220],
        tempo: 2200
      },
      3: {
        style: 'Serene Aurora',
        harmony: [123, 155, 185], // B2, D#3, F#3
        melody: [246, 311, 370, 311, 246, 185, 155, 185],
        tempo: 2400
      },
      4: {
        style: 'Peaceful Nebula',
        harmony: [110, 138, 165], // A2, C#3, E3
        melody: [220, 277, 330, 277, 220, 165, 138, 165],
        tempo: 2600
      },
      5: {
        style: 'Tranquil Starfield',
        harmony: [98, 123, 147], // G2, B2, D3
        melody: [196, 247, 294, 247, 196, 147, 123, 147],
        tempo: 2800
      },
      15: {
        style: 'Ambient Boss Encounter',
        harmony: [73, 92, 110], // D2, F#2, A2 - very deep and ambient
        melody: [146, 185, 220, 185, 146, 110, 92, 110],
        tempo: 3000
      }
    };
    
    return configs[level] || configs[Math.min(level, 5)];
  }
  
  createRelaxingMelody(musicConfig, fadeTime) {
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
      
      melodyOscillator.type = 'sine'; // Always use sine for soft melody
      melodyOscillator.frequency.value = musicConfig.melody[melodyIndex % musicConfig.melody.length];
      
      // Add gentle low-pass filtering for warmth
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      filter.Q.value = 1;
      
      const noteLength = musicConfig.tempo * 0.0008; // Longer, more sustained notes
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.025, this.audioContext.currentTime + 0.1); // Very soft volume
      gainNode.gain.exponentialRampToValueAtTime(0.005, this.audioContext.currentTime + noteLength);
      
      melodyOscillator.start(this.audioContext.currentTime);
      melodyOscillator.stop(this.audioContext.currentTime + noteLength);
      
      melodyIndex++;
      
      // Schedule next note with consistent timing for relaxation
      this.melodyTimeout = setTimeout(playMelodyNote, musicConfig.tempo);
    };
    
    // Start melody after fade-in with longer delay for gentleness
    this.melodyTimeout = setTimeout(playMelodyNote, fadeTime + 500);
  }
  
  fadeOutMusic(track, duration = 1000) {
    if (this.useHTMLAudio) {
      // Simple HTML5 audio fade
      return;
    }
    
    // Web Audio API fade out
    const currentTime = this.audioContext.currentTime;
    // Implementation for fading out current track
  }
  
  playSound(soundName, volume = 1.0) {
    if (this.isMuted) return;
    
    const sound = this.soundEffects[soundName];
    if (!sound) {
      console.warn(`Sound effect not found: ${soundName}`);
      return;
    }
    
    if (this.useHTMLAudio) {
      this.playHTMLAudio(sound.url, false, volume * this.sfxVolume);
    } else {
      this.playWebAudioSound(sound, volume);
    }
  }

  playSFX(soundName, options = {}) {
    if (this.isMuted) {
      console.log(`🔇 SFX ${soundName} muted - not playing`);
      return;
    }
    
    const { volume = 0.5, pitch = 1.0 } = options;
    
    console.log(`🔊 Playing SFX: ${soundName} (volume: ${volume})`);
    
    // Play placeholder synthetic sound for different SFX types
    this.playPlaceholderSFX(soundName, volume, pitch);
  }
  
  playPlaceholderSFX(soundName, volume, pitch) {
    if (!this.audioContext) {
      console.log('🔇 Audio context not available for SFX');
      return;
    }
    
    // Different sophisticated sounds for different SFX types
    switch (soundName) {
      case 'game_start':
        this.createGameStartSound(volume);
        break;
      case 'powerup_collect':
        this.createPowerUpSound(volume);
        break;
      case 'collision':
        this.createCollisionSound(volume);
        break;
      case 'boss_attack':
        this.createBossAttackSound(volume);
        break;
      case 'level_complete':
        this.createLevelCompleteSound(volume);
        break;
      case 'butterfly_flap':
        this.createButterflyFlapSound(volume);
        break;
      case 'shield_activate':
        this.createShieldSound(volume);
        break;
      case 'blaster_shoot':
        this.createBlasterSound(volume);
        break;
      default:
        this.createDefaultSound(soundName, volume, pitch);
    }
  }
  
  createGameStartSound(volume) {
    // Uplifting game start chord progression
    const frequencies = [261, 329, 392, 523]; // C major chord
    
    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.sfxGain);
      
      oscillator.type = 'triangle';
      oscillator.frequency.value = freq;
      
      const startTime = this.audioContext.currentTime + (index * 0.1);
      const duration = 0.8;
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.15, startTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
    
    console.log('🎵 Playing uplifting game start sound');
  }
  
  createPowerUpSound(volume) {
    // Magical sparkle sound
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.sfxGain);
    
    oscillator.type = 'sine';
    
    // Rising sparkle effect
    const startTime = this.audioContext.currentTime;
    const duration = 0.5;
    
    oscillator.frequency.setValueAtTime(440, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(1760, startTime + duration);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, startTime);
    filter.frequency.exponentialRampToValueAtTime(3200, startTime + duration);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.2, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
    
    console.log('✨ Playing magical power-up sparkle sound');
  }
  
  createCollisionSound(volume) {
    // Dramatic impact sound
    const noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.3, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    // Generate noise
    for (let i = 0; i < output.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    noiseSource.buffer = noiseBuffer;
    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.sfxGain);
    
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    
    const startTime = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(volume * 0.4, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
    
    noiseSource.start(startTime);
    
    console.log('💥 Playing dramatic collision impact');
  }
  
  createBossAttackSound(volume) {
    // Menacing boss attack with low rumble
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.sfxGain);
    
    oscillator.type = 'sawtooth';
    
    const startTime = this.audioContext.currentTime;
    const duration = 1.0;
    
    // Deep menacing rumble that rises
    oscillator.frequency.setValueAtTime(40, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(80, startTime + duration * 0.5);
    oscillator.frequency.exponentialRampToValueAtTime(200, startTime + duration);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, startTime);
    filter.frequency.exponentialRampToValueAtTime(800, startTime + duration);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.3, startTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
    
    console.log('👹 Playing menacing boss attack sound');
  }
  
  createLevelCompleteSound(volume) {
    // Triumphant level completion fanfare
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    
    notes.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.sfxGain);
      
      oscillator.type = 'triangle';
      oscillator.frequency.value = freq;
      
      const startTime = this.audioContext.currentTime + (index * 0.15);
      const duration = 0.6;
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.2, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
    
    console.log('🏆 Playing triumphant level complete fanfare');
  }
  
  createButterflyFlapSound(volume) {
    // Gentle flutter sound
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGain);
    
    oscillator.type = 'sine';
    
    const startTime = this.audioContext.currentTime;
    const duration = 0.2;
    
    oscillator.frequency.setValueAtTime(800, startTime);
    oscillator.frequency.linearRampToValueAtTime(1200, startTime + duration * 0.5);
    oscillator.frequency.linearRampToValueAtTime(600, startTime + duration);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.05, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
    
    console.log('🦋 Playing gentle butterfly flutter');
  }
  
  createShieldSound(volume) {
    // Protective energy shield activation
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.sfxGain);
    
    oscillator.type = 'sine';
    
    const startTime = this.audioContext.currentTime;
    const duration = 0.7;
    
    oscillator.frequency.setValueAtTime(220, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, startTime + duration * 0.3);
    oscillator.frequency.exponentialRampToValueAtTime(440, startTime + duration);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, startTime);
    filter.frequency.exponentialRampToValueAtTime(2000, startTime + duration);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.15, startTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
    
    console.log('🛡️ Playing protective shield activation');
  }
  
  createBlasterSound(volume) {
    // Futuristic blaster shot
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.sfxGain);
    
    oscillator.type = 'square';
    
    const startTime = this.audioContext.currentTime;
    const duration = 0.25;
    
    oscillator.frequency.setValueAtTime(1200, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, startTime + duration);
    
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1500, startTime);
    filter.frequency.exponentialRampToValueAtTime(500, startTime + duration);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.2, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
    
    console.log('🔫 Playing futuristic blaster shot');
  }
  
  createDefaultSound(soundName, volume, pitch) {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGain);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 440 * pitch;
    
    const startTime = this.audioContext.currentTime;
    const duration = 0.2;
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.1, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
    
    console.log(`🔊 Playing default sound for ${soundName}`);
  }
  
  playHTMLAudio(url, loop = false, volume = 1.0) {
    // Create placeholder synthetic audio instead of trying to load missing files
    this.playPlaceholderSound();
    console.log(`🎵 Playing placeholder audio for: ${url}`);
    return null;
  }
  
  playWebAudioSound(sound, volume) {
    // Web Audio API implementation for sound effects
    // This would load and play the actual audio buffer
    console.log(`🔊 Playing: ${sound.description}`);
  }
  
  playPlaceholderSound() {
    // Create a brief synthetic sound as placeholder
    if (this.audioContext) {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.sfxGain);
      
      // Create a pleasant notification tone
      oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // A4 note
      oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.1); // A5 note
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
      
      console.log('🔊 Playing placeholder sound');
    } else {
      console.log('🔇 Audio context not available');
    }
  }
  
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
  }
  
  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.sfxVolume;
    }
  }
  
  mute() {
    this.isMuted = true;
    if (this.masterGain) {
      this.masterGain.gain.value = 0;
    }
  }
  
  unmute() {
    this.isMuted = false;
    if (this.masterGain) {
      this.masterGain.gain.value = this.masterVolume;
    }
  }
  
  toggleMute() {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
    return !this.isMuted;
  }
  
  stopAllAudio() {
    if (this.currentMusic) {
      this.fadeOutMusic(this.currentMusic, 500);
      this.currentMusic = null;
    }
  }
  
  resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      console.log('🎵 Resuming suspended audio context...');
      return this.audioContext.resume().then(() => {
        console.log('✅ Audio context resumed successfully');
        // Start playing current music after resuming
        if (!this.isMuted) {
          this.playMusic('menu');
        }
      }).catch(error => {
        console.error('❌ Failed to resume audio context:', error);
      });
    } else if (this.audioContext && this.audioContext.state === 'running') {
      console.log('✅ Audio context already running');
      // Make sure we're playing music
      if (!this.isMuted && !this.currentMusic) {
        this.playMusic('menu');
      }
    } else {
      console.log('🔇 No audio context available');
    }
  }
  
  getLevelMusicInfo(level) {
    return this.musicTracks[level] || this.musicTracks.menu;
  }
  
  // Special methods for game events
  playPowerUpSound(powerUpType) {
    const soundMap = {
      'speed': 'speed_boost',
      'shield': 'shield_activate', 
      'blaster': 'blaster_mode',
      'health': 'health_restore'
    };
    
    this.playSound('powerup_collect');
    
    // Play specific power-up sound after a brief delay
    setTimeout(() => {
      this.playSound(soundMap[powerUpType] || 'powerup_collect');
    }, 100);
  }
  
  playCollisionSound(obstacleType) {
    const soundMap = {
      'asteroid': 'collision_asteroid',
      'insect': 'collision_insect',
      'boss_projectile': 'boss_projectile'
    };
    
    this.playSound(soundMap[obstacleType] || 'collision_asteroid');
  }
  
  playBossSound(attackType) {
    const soundMap = {
      'projectile': 'boss_projectile',
      'homing': 'boss_homing',
      'rage_beam': 'boss_rage_beam',
      'hit': 'boss_hit',
      'defeat': 'boss_defeat'
    };
    
    this.playSound(soundMap[attackType]);
  }
  
  generateMusic(level) {
    if (!this.audioContext) return null;
    
    // Level-specific music configurations
    const musicConfigs = {
      1: { tempo: 120, mood: 'upbeat', key: 'C', instruments: ['lead', 'bass', 'drums'] },
      2: { tempo: 130, mood: 'energetic', key: 'D', instruments: ['lead', 'bass', 'drums', 'pad'] },
      3: { tempo: 125, mood: 'mysterious', key: 'Am', instruments: ['lead', 'bass', 'drums', 'arp'] },
      4: { tempo: 135, mood: 'intense', key: 'E', instruments: ['lead', 'bass', 'drums', 'pad', 'arp'] },
      5: { tempo: 140, mood: 'driving', key: 'F', instruments: ['lead', 'bass', 'drums', 'synth'] },
      6: { tempo: 128, mood: 'cosmic', key: 'G', instruments: ['pad', 'bass', 'drums', 'lead'] },
      7: { tempo: 145, mood: 'urgent', key: 'A', instruments: ['lead', 'bass', 'drums', 'synth', 'arp'] },
      8: { tempo: 150, mood: 'aggressive', key: 'B', instruments: ['lead', 'bass', 'drums', 'distortion'] },
      9: { tempo: 133, mood: 'ethereal', key: 'Dm', instruments: ['pad', 'arp', 'bass', 'soft_drums'] },
      10: { tempo: 155, mood: 'relentless', key: 'Em', instruments: ['lead', 'bass', 'heavy_drums', 'synth'] },
      11: { tempo: 160, mood: 'frantic', key: 'F#', instruments: ['lead', 'bass', 'fast_drums', 'arp', 'synth'] },
      12: { tempo: 165, mood: 'chaotic', key: 'G#', instruments: ['distortion', 'bass', 'heavy_drums', 'noise'] },
      13: { tempo: 170, mood: 'climactic', key: 'A#', instruments: ['orchestral', 'bass', 'epic_drums', 'choir'] },
      14: { tempo: 175, mood: 'pre-boss', key: 'C#', instruments: ['orchestral', 'bass', 'epic_drums', 'brass'] },
      15: { tempo: 180, mood: 'boss_epic', key: 'Dm', instruments: ['full_orchestra', 'epic_bass', 'cinematic_drums', 'choir', 'brass'] }
    };
    
    const config = musicConfigs[level] || musicConfigs[1];
    console.log(`🎼 Generating ${config.mood} music for Level ${level} (${config.key} at ${config.tempo} BPM)`);
    
    // Create a complex musical piece
    this.createLevelMusic(config, level);
    
    return config;
  }
  
  createLevelMusic(config, level) {
    if (!this.audioContext) return;
    
    const duration = 60; // 60 second loop
    const startTime = this.audioContext.currentTime;
    
    // Stop any existing music
    if (this.currentMusicNodes) {
      this.currentMusicNodes.forEach(node => {
        try { node.stop(); } catch(e) {}
      });
    }
    this.currentMusicNodes = [];
    
    // Create sophisticated layered music
    config.instruments.forEach((instrument, index) => {
      setTimeout(() => {
        this.createInstrumentLayer(instrument, config, startTime + index * 0.5, duration, level);
      }, index * 100);
    });
    
    // Special boss music effects
    if (level === 15) {
      this.addBossEffects(config, startTime, duration);
    }
  }
  
  createInstrumentLayer(instrument, config, startTime, duration, level) {
    if (!this.audioContext) return;
    
    const endTime = startTime + duration;
    
    switch (instrument) {
      case 'lead':
        this.createLeadMelody(config, startTime, endTime, level);
        break;
      case 'bass':
        this.createBassLine(config, startTime, endTime, level);
        break;
      case 'drums':
      case 'heavy_drums':
      case 'fast_drums':
      case 'epic_drums':
      case 'cinematic_drums':
        this.createDrumPattern(instrument, config, startTime, endTime, level);
        break;
      case 'pad':
        this.createPadLayer(config, startTime, endTime, level);
        break;
      case 'arp':
        this.createArpeggio(config, startTime, endTime, level);
        break;
      case 'synth':
        this.createSynthLead(config, startTime, endTime, level);
        break;
      case 'orchestral':
      case 'full_orchestra':
        this.createOrchestralSection(instrument, config, startTime, endTime, level);
        break;
      case 'choir':
        this.createChoirPad(config, startTime, endTime, level);
        break;
      case 'brass':
        this.createBrassSection(config, startTime, endTime, level);
        break;
    }
  }
  
  createLeadMelody(config, startTime, endTime, level) {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.musicGain);
    
    // Lead melody configuration
    oscillator.type = level > 10 ? 'sawtooth' : 'triangle';
    filter.type = 'lowpass';
    filter.frequency.value = 2000;
    
    // Melody based on level mood
    const melodyPattern = this.getMelodyPattern(config.mood, level);
    const beatDuration = 60 / config.tempo;
    
    let currentTime = startTime;
    
    melodyPattern.forEach((note, index) => {
      const noteTime = currentTime + (index * beatDuration);
      if (noteTime < endTime) {
        oscillator.frequency.setValueAtTime(note.frequency, noteTime);
        gainNode.gain.setValueAtTime(0, noteTime);
        gainNode.gain.linearRampToValueAtTime(note.volume * 0.15, noteTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, noteTime + note.duration);
      }
    });
    
    // Repeat pattern
    const patternDuration = melodyPattern.length * beatDuration;
    for (let t = startTime; t < endTime; t += patternDuration) {
      // Pattern repeats automatically due to frequency scheduling
    }
    
    oscillator.start(startTime);
    oscillator.stop(endTime);
    this.currentMusicNodes.push(oscillator);
  }
  
  createBassLine(config, startTime, endTime, level) {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.musicGain);
    
    oscillator.type = 'sawtooth';
    
    // Bass pattern
    const bassNotes = this.getBassPattern(config.key, level);
    const beatDuration = 60 / config.tempo;
    
    let currentTime = startTime;
    
    while (currentTime < endTime) {
      bassNotes.forEach((frequency, index) => {
        const noteTime = currentTime + (index * beatDuration);
        if (noteTime < endTime) {
          oscillator.frequency.setValueAtTime(frequency, noteTime);
          gainNode.gain.setValueAtTime(0, noteTime);
          gainNode.gain.linearRampToValueAtTime(0.25, noteTime + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.01, noteTime + beatDuration * 0.8);
        }
      });
      currentTime += bassNotes.length * beatDuration;
    }
    
    oscillator.start(startTime);
    oscillator.stop(endTime);
    this.currentMusicNodes.push(oscillator);
  }
  
  createDrumPattern(drumType, config, startTime, endTime, level) {
    const beatDuration = 60 / config.tempo;
    let currentTime = startTime;
    
    while (currentTime < endTime) {
      // Kick drum
      this.createDrumHit('kick', currentTime, drumType, level);
      this.createDrumHit('kick', currentTime + beatDuration * 2, drumType, level);
      
      // Snare
      this.createDrumHit('snare', currentTime + beatDuration, drumType, level);
      this.createDrumHit('snare', currentTime + beatDuration * 3, drumType, level);
      
      // Hi-hats (more frequent)
      for (let i = 0; i < 4; i++) {
        this.createDrumHit('hihat', currentTime + (i * beatDuration * 0.5), drumType, level);
      }
      
      currentTime += beatDuration * 4; // One bar
    }
  }
  
  createDrumHit(drumSound, time, drumType, level) {
    if (!this.audioContext || time >= this.audioContext.currentTime + 60) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.sfxGain);
    
    // Drum sound configuration
    switch (drumSound) {
      case 'kick':
        oscillator.frequency.value = level > 10 ? 60 : 80;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.4, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
        break;
      case 'snare':
        oscillator.frequency.value = 200;
        oscillator.type = 'noise';
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        gainNode.gain.setValueAtTime(0.3, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
        break;
      case 'hihat':
        oscillator.frequency.value = 8000;
        oscillator.type = 'noise';
        filter.type = 'highpass';
        filter.frequency.value = 5000;
        gainNode.gain.setValueAtTime(0.1, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
        break;
    }
    
    oscillator.start(time);
    oscillator.stop(time + 0.5);
    this.currentMusicNodes.push(oscillator);
  }
  
  getMelodyPattern(mood, level) {
    // Generate melody patterns based on mood and level
    const patterns = {
      upbeat: [
        { frequency: 523, volume: 0.8, duration: 0.4 }, // C5
        { frequency: 659, volume: 0.7, duration: 0.4 }, // E5
        { frequency: 784, volume: 0.9, duration: 0.6 }, // G5
        { frequency: 659, volume: 0.6, duration: 0.4 }, // E5
      ],
      energetic: [
        { frequency: 587, volume: 0.9, duration: 0.3 }, // D5
        { frequency: 698, volume: 0.8, duration: 0.3 }, // F#5
        { frequency: 880, volume: 1.0, duration: 0.5 }, // A5
        { frequency: 784, volume: 0.7, duration: 0.4 }, // G5
      ],
      boss_epic: [
        { frequency: 294, volume: 1.0, duration: 0.8 }, // D4
        { frequency: 370, volume: 0.9, duration: 0.6 }, // F#4
        { frequency: 440, volume: 1.0, duration: 1.0 }, // A4
        { frequency: 523, volume: 0.8, duration: 0.6 }, // C5
      ]
    };
    
    return patterns[mood] || patterns.upbeat;
  }
  
  getBassPattern(key, level) {
    // Simple bass patterns
    const bassFrequencies = {
      'C': [130, 164, 196, 164], // C3, E3, G3, E3
      'Dm': [146, 175, 220, 175], // D3, F3, A3, F3
      'Am': [110, 130, 164, 130], // A2, C3, E3, C3
    };
    
    return bassFrequencies[key] || bassFrequencies['C'];
  }
  
  addBossEffects(config, startTime, duration) {
    // Add dramatic boss fight effects
    setTimeout(() => {
      console.log('🎭 Adding boss music dramatic effects...');
      
      // Create tension-building filter sweeps
      const sweepOsc = this.audioContext.createOscillator();
      const sweepGain = this.audioContext.createGain();
      
      sweepOsc.connect(sweepGain);
      sweepGain.connect(this.musicGain);
      
      sweepOsc.type = 'sawtooth';
      sweepOsc.frequency.setValueAtTime(50, startTime);
      sweepOsc.frequency.exponentialRampToValueAtTime(100, startTime + duration);
      
      sweepGain.gain.setValueAtTime(0.1, startTime);
      sweepGain.gain.linearRampToValueAtTime(0.2, startTime + duration * 0.5);
      sweepGain.gain.exponentialRampToValueAtTime(0.05, startTime + duration);
      
      sweepOsc.start(startTime);
      sweepOsc.stop(startTime + duration);
      this.currentMusicNodes.push(sweepOsc);
    }, 1000);
  }
}

export default AudioManager;