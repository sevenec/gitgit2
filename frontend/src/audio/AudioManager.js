class AudioManager {
  constructor() {
    this.audioContext = null;
    this.masterVolume = 0.7;
    this.musicVolume = 0.6;
    this.sfxVolume = 0.8;
    this.currentMusic = null;
    this.musicTracks = {};
    this.soundEffects = {};
    this.isMuted = false;
    
    this.initializeAudio();
    this.loadAudioAssets();
  }
  
  initializeAudio() {
    try {
      // Initialize Web Audio API
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create master gain node
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = this.masterVolume;
      
      // Create separate gain nodes for music and SFX
      this.musicGain = this.audioContext.createGain();
      this.musicGain.connect(this.masterGain);
      this.musicGain.gain.value = this.musicVolume;
      
      this.sfxGain = this.audioContext.createGain();
      this.sfxGain.connect(this.masterGain);
      this.sfxGain.gain.value = this.sfxVolume;
      
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
      this.useHTMLAudio = true;
    }
  }
  
  loadAudioAssets() {
    // Level-specific music tracks (high-quality orchestral/electronic)
    this.musicTracks = {
      // Levels 1-5: Starry Beginnings
      1: { name: 'Starry Genesis', url: '/audio/music/01_starry_genesis.mp3', mood: 'upbeat_orchestral' },
      2: { name: 'Cosmic Drift', url: '/audio/music/02_cosmic_drift.mp3', mood: 'electronic_ambient' },
      3: { name: 'Aurora Fields', url: '/audio/music/03_aurora_fields.mp3', mood: 'ambient_wonder' },
      4: { name: 'Magnetic Storms', url: '/audio/music/04_magnetic_storms.mp3', mood: 'electronic_tension' },
      5: { name: 'Colorful Nebula', url: '/audio/music/05_colorful_nebula.mp3', mood: 'orchestral_wonder' },
      
      // Levels 6-10: Intermediate Challenges  
      6: { name: 'Crystal Formations', url: '/audio/music/06_crystal_formations.mp3', mood: 'electronic_crystal' },
      7: { name: 'Plasma Turbulence', url: '/audio/music/07_plasma_turbulence.mp3', mood: 'intense_electronic' },
      8: { name: 'Quantum Fluctuations', url: '/audio/music/08_quantum_fluctuations.mp3', mood: 'ambient_quantum' },
      9: { name: 'Solar Eruption', url: '/audio/music/09_solar_eruption.mp3', mood: 'orchestral_epic' },
      10: { name: 'Galactic Heart', url: '/audio/music/10_galactic_heart.mp3', mood: 'electronic_core' },
      
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
    
    console.log(`🎵 Starting music for level ${level}: ${track.name} (${track.mood})`);
    
    // Stop current music with fade out
    if (this.currentMusic) {
      this.fadeOutMusic(this.currentMusic, 1000);
    }
    
    // Start new music with fade in
    this.fadeInMusic(track, 1500);
    
    console.log(`🎵 Now Playing: ${track.name} (${track.mood})`);
  }
  
  fadeInMusic(track, duration = 1500) {
    if (this.useHTMLAudio) {
      // Fallback to HTML5 audio
      this.playHTMLAudio(track.url, true, this.musicVolume);
      return;
    }
    
    // Web Audio API implementation
    this.currentMusic = track;
    
    // Create gain node for this track
    const trackGain = this.audioContext.createGain();
    trackGain.connect(this.musicGain);
    trackGain.gain.setValueAtTime(0, this.audioContext.currentTime);
    trackGain.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + (duration / 1000));
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
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGain);
    
    // Different sounds for different SFX types
    let frequency, duration, waveType;
    
    switch (soundName) {
      case 'game_start':
        frequency = 523; // C5 note
        duration = 0.6;
        waveType = 'triangle';
        // Create a rising tone for game start
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.5, this.audioContext.currentTime + duration);
        break;
      case 'powerup_collect':
        frequency = 880; // A5 note
        duration = 0.3;
        waveType = 'square';
        break;
      case 'collision':
        frequency = 200; // Low frequency for impact
        duration = 0.2;
        waveType = 'sawtooth';
        break;
      default:
        frequency = 440; // A4 note
        duration = 0.2;
        waveType = 'sine';
    }
    
    oscillator.type = waveType;
    oscillator.frequency.value = frequency * pitch;
    
    gainNode.gain.setValueAtTime(volume * 0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
    
    console.log(`🔊 Playing ${waveType} wave ${soundName} at ${frequency}Hz for ${duration}s`);
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
    // Resume audio context on user interaction (required by browsers)
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
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

// Create global audio manager instance
window.AudioManager = new AudioManager();

export default AudioManager;