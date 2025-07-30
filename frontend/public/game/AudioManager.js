window.AudioManager = class AudioManager {
  constructor() {
    // Audio configuration with real music files
    this.musicDisabled = false; // Music is now enabled!
    this.musicVolume = 0.4; // Moderate volume for background music
    this.sfxVolume = 0.6; // Sound effects volume
    this.masterVolume = 0.7; // Master volume control
    
    // Audio context for advanced audio features
    this.audioContext = null;
    this.musicTracks = new Map(); // Store loaded music tracks
    this.currentTrack = null;
    this.fadeTimeout = null;
    
    // Level music mapping
    this.levelMusicMap = {
      1: '/sounds/level1-space-epic-cinematic.mp3',
      2: '/sounds/level2-traveling-through-space.mp3', 
      3: '/sounds/level3-lost-in-space.mp3',
      4: '/sounds/level4-space-music.mp3',
      5: '/sounds/level5-space-clouds-velvet.mp3',
      // Levels 6-10 will cycle through available tracks
      6: '/sounds/level1-space-epic-cinematic.mp3',
      7: '/sounds/level2-traveling-through-space.mp3',
      8: '/sounds/level3-lost-in-space.mp3',
      9: '/sounds/level4-space-music.mp3',
      10: '/sounds/level5-space-clouds-velvet.mp3',
      // Levels 11-15 (including boss levels) get more intense tracks
      11: '/sounds/level1-space-epic-cinematic.mp3', // More epic for later levels
      12: '/sounds/level2-traveling-through-space.mp3',
      13: '/sounds/level3-lost-in-space.mp3', 
      14: '/sounds/level4-space-music.mp3',
      15: '/sounds/level1-space-epic-cinematic.mp3'  // Epic finale music
    };
    
    // Initialize audio context
    this.initializeAudioContext();
    console.log('AudioManager initialized with real music tracks!');
  }
  
  initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log('Audio context initialized successfully');
    } catch (e) {
      console.warn('Web Audio API not supported, falling back to HTML5 audio');
    }
  }
  
  // Play background music for specific level
  playLevelMusic(level) {
    if (this.musicDisabled) {
      console.log('Music is disabled - no music will play');
      return;
    }
    
    const musicPath = this.levelMusicMap[level];
    if (!musicPath) {
      console.warn(`No music configured for level ${level}`);
      return;
    }
    
    console.log(`Starting music for Level ${level}: ${musicPath}`);
    
    // Stop current music if playing
    this.stopMusic();
    
    // Create new audio element
    const audio = new Audio(musicPath);
    audio.volume = this.musicVolume * this.masterVolume;
    audio.loop = true; // Loop background music
    
    // Handle loading and playback
    audio.addEventListener('loadstart', () => {
      console.log(`Loading music: ${musicPath}`);
    });
    
    audio.addEventListener('canplaythrough', () => {
      console.log(`Music ready to play: ${musicPath}`);
    });
    
    audio.addEventListener('error', (e) => {
      console.error(`Failed to load music: ${musicPath}`, e);
    });
    
    // Store reference and play
    this.currentTrack = audio;
    
    // Play with user interaction handling
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log(`Successfully started Level ${level} music`);
        })
        .catch(error => {
          console.warn('Music play failed - likely needs user interaction:', error);
          // Store for later playback after user interaction
          document.addEventListener('click', () => {
            this.resumeMusic();
          }, { once: true });
        });
    }
  }
  
  // Stop current music with optional fade out
  stopMusic(fadeOut = false) {
    if (!this.currentTrack) return;
    
    if (fadeOut) {
      // Fade out over 1 second
      const fadeStep = this.currentTrack.volume / 20;
      const fadeInterval = setInterval(() => {
        if (this.currentTrack.volume - fadeStep > 0) {
          this.currentTrack.volume -= fadeStep;
        } else {
          this.currentTrack.pause();
          this.currentTrack = null;
          clearInterval(fadeInterval);
        }
      }, 50);
    } else {
      // Immediate stop
      this.currentTrack.pause();
      this.currentTrack = null;
    }
  }
  
  // Resume paused music
  resumeMusic() {
    if (this.currentTrack && this.currentTrack.paused) {
      const playPromise = this.currentTrack.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Music resumed successfully');
          })
          .catch(error => {
            console.warn('Failed to resume music:', error);
          });
      }
    }
  }
  
  // Pause current music
  pauseMusic() {
    if (this.currentTrack && !this.currentTrack.paused) {
      this.currentTrack.pause();
      console.log('Music paused');
    }
  }
  
  // Change music level with smooth transition
  changeLevel(newLevel) {
    const newMusicPath = this.levelMusicMap[newLevel];
    const currentPath = this.currentTrack ? this.currentTrack.src : null;
    
    // Only change if different track needed
    if (newMusicPath && !currentPath?.includes(newMusicPath)) {
      console.log(`Changing to Level ${newLevel} music`);
      
      if (this.currentTrack) {
        // Fade out current, then start new
        this.stopMusic(true);
        setTimeout(() => {
          this.playLevelMusic(newLevel);
        }, 1000);
      } else {
        // Start new immediately
        this.playLevelMusic(newLevel);
      }
    }
  }
  
  // Set music volume (0.0 to 1.0)
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.currentTrack) {
      this.currentTrack.volume = this.musicVolume * this.masterVolume;
    }
    console.log(`Music volume set to ${this.musicVolume}`);
  }
  
  // Set master volume (0.0 to 1.0)
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.currentTrack) {
      this.currentTrack.volume = this.musicVolume * this.masterVolume;
    }
    console.log(`Master volume set to ${this.masterVolume}`);
  }
  
  // Toggle music on/off
  toggleMusic() {
    this.musicDisabled = !this.musicDisabled;
    if (this.musicDisabled) {
      this.stopMusic();
      console.log('Music disabled');
    } else {
      console.log('Music enabled');
    }
    return !this.musicDisabled;
  }
  
  // Simple sound effects (fallback for power-ups, collisions, etc.)
  playSound(type, options = {}) {
    if (!options.volume) options.volume = this.sfxVolume;
    
    // Simple beep-based sound effects for now
    // Can be enhanced with real SFX files later
    if (!this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Different sounds for different events
      switch (type) {
        case 'powerup':
          oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.2);
          break;
        case 'collision':
          oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3);
          break;
        case 'victory':
          oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
          oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.2);
          break;
        default:
          oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
      }
      
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(options.volume * this.masterVolume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + (options.duration || 0.3));
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + (options.duration || 0.3));
      
    } catch (e) {
      console.warn('Sound effect failed:', e);
    }
  }
  
  // Get current music info
  getMusicInfo() {
    if (!this.currentTrack) return null;
    
    return {
      isPlaying: !this.currentTrack.paused,
      currentTime: this.currentTrack.currentTime,
      duration: this.currentTrack.duration,
      volume: this.musicVolume,
      src: this.currentTrack.src
    };
  }

  // Compatibility methods for existing game code
  playMusic(level) {
    this.playLevelMusic(level);
  }

  playSFX(soundName, options = {}) {
    this.playSound(soundName, options);
  }

  playPowerUpSound(powerUpType = 'default') {
    this.playSound('powerup');
  }

  setSfxVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  toggleMute() {
    this.musicDisabled = !this.musicDisabled;
    if (this.musicDisabled) {
      this.stopMusic();
    }
    return this.musicDisabled;
  }

  mute() {
    this.musicDisabled = true;
    this.stopMusic();
  }

  unmute() {
    this.musicDisabled = false;
  }

  setAudioQuality(quality) {
    console.log(`Audio quality set to: ${quality}`);
  }

  resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().then(() => {
        console.log('Audio context resumed');
      });
    }
  }

  stopAllAudio() {
    this.stopMusic();
    console.log('All audio stopped');
  }

  enableMusic() {
    this.musicDisabled = false;
    console.log('Music enabled');
  }
}

// Export the class directly (not instance) so it can be instantiated
export default AudioManager;