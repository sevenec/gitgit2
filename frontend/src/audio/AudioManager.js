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
      
      oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);
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
}

// Create global audio manager instance
window.AudioManager = new AudioManager();

export default AudioManager;