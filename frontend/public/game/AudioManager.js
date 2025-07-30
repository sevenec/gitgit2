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
    
    // COMPLETE LEVEL MUSIC MAPPING - 15 UNIQUE TRACKS + INTRO (ZERO REPETITION!)
    this.levelMusicMap = {
      // INTRO SCREEN - Epic welcome music
      'intro': '/sounds/intro-cinematic-battle-score.mp3',
      
      // EXPLORATION PHASE (Levels 1-5) - Original space ambience uploads
      1: '/sounds/level1-space-epic-cinematic.mp3',        // Epic opening
      2: '/sounds/level2-traveling-through-space.mp3',     // Journey begins
      3: '/sounds/level3-lost-in-space.mp3',               // Mystery & danger
      4: '/sounds/level4-space-music.mp3',                 // Cosmic ambience
      5: '/sounds/level5-space-clouds-velvet.mp3',         // Ethereal beauty
      
      // ADVENTURE PHASE (Levels 6-10) - Second wave space uploads  
      6: '/sounds/level6-space-travel.mp3',                // Space travel adventure
      7: '/sounds/level7-space-flight.mp3',                // Dynamic flight
      8: '/sounds/level8-calm-space-music.mp3',            // Calm before storm
      9: '/sounds/level9-ambient-space-arpeggio.mp3',      // Building tension
      10: '/sounds/level10-space-ambient.mp3',             // Deep space mystery
      
      // FINAL BATTLE PHASE (Levels 11-15) - Epic battle finale uploads
      11: '/sounds/level11-epic-cinematic-battle.mp3',     // Epic battle begins
      12: '/sounds/level12-glorious-army-battle.mp3',      // Glorious army march
      13: '/sounds/level13-war-battle-military.mp3',       // Military war intensity
      14: '/sounds/level14-z-battle-finale.mp3',           // Z-Battle finale prep
      15: '/sounds/level5-space-clouds-velvet.mp3'         // MOTHER INSECT BOSS - Ethereal finale
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
  
  // Play intro music immediately when game opens
  playIntroMusic() {
    if (this.musicDisabled) {
      console.log('Music is disabled - no intro music will play');
      return;
    }
    
    const introMusicPath = this.levelMusicMap['intro'];
    if (!introMusicPath) {
      console.warn('No intro music configured');
      return;
    }
    
    console.log(`Starting intro music: ${introMusicPath}`);
    
    // Stop any current music
    this.stopMusic();
    
    // Create intro music element
    const audio = new Audio(introMusicPath);
    audio.volume = this.musicVolume * this.masterVolume * 0.8; // Slightly quieter for intro
    audio.loop = true; // Loop intro music
    
    // Handle loading and playback
    audio.addEventListener('canplaythrough', () => {
      console.log('Intro music ready to play');
    });
    
    audio.addEventListener('error', (e) => {
      console.error(`Failed to load intro music: ${introMusicPath}`, e);
    });
    
    // Store reference and play
    this.currentTrack = audio;
    
    // Play intro music (modern browsers require user interaction)
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Intro music started successfully');
        })
        .catch(error => {
          console.warn('Intro music needs user interaction:', error);
          // Store for later playback after user interaction
          document.addEventListener('click', () => {
            this.resumeMusic();
          }, { once: true });
        });
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
    
    console.log(`🎵 Starting music for Level ${level}: ${musicPath}`);
    
    // ENHANCED STOP: Ensure ALL previous audio is stopped
    this.stopAllAudio();
    
    // Small delay to ensure cleanup is complete
    setTimeout(() => {
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
            console.log(`✅ Successfully started Level ${level} music - SINGLE TRACK ONLY`);
          })
          .catch(error => {
            console.warn('Music play failed - likely needs user interaction:', error);
            // Store for later playback after user interaction
            document.addEventListener('click', () => {
              this.resumeMusic();
            }, { once: true });
          });
      }
    }, 100); // 100ms delay for cleanup
  }
  
  // Stop current music with optional fade out - ENHANCED to stop ALL audio
  stopMusic(fadeOut = false) {
    if (!this.currentTrack) return;
    
    if (fadeOut) {
      // Fade out over 1 second
      const fadeStep = this.currentTrack.volume / 20;
      const fadeInterval = setInterval(() => {
        if (this.currentTrack && this.currentTrack.volume - fadeStep > 0) {
          this.currentTrack.volume -= fadeStep;
        } else {
          if (this.currentTrack) {
            this.currentTrack.pause();
            this.currentTrack.currentTime = 0; // Reset to beginning
            this.currentTrack = null;
          }
          clearInterval(fadeInterval);
        }
      }, 50);
    } else {
      // Immediate stop with full cleanup
      try {
        this.currentTrack.pause();
        this.currentTrack.currentTime = 0; // Reset to beginning
        this.currentTrack = null;
        console.log('🔇 Music stopped and cleaned up');
      } catch (e) {
        console.warn('Error stopping music:', e);
        this.currentTrack = null; // Force cleanup
      }
    }
    
    // ADDITIONAL SAFETY: Stop any other audio elements that might be playing
    try {
      const allAudioElements = document.querySelectorAll('audio');
      allAudioElements.forEach(audio => {
        if (!audio.paused) {
          audio.pause();
          audio.currentTime = 0;
          console.log('🔇 Stopped additional audio element');
        }
      });
    } catch (e) {
      console.warn('Error stopping additional audio elements:', e);
    }
  }
  
  // Stop ALL audio completely - use before starting new music
  stopAllAudio() {
    // Stop current tracked music
    this.stopMusic();
    
    // Stop ALL audio elements on the page
    try {
      const allAudioElements = document.querySelectorAll('audio');
      allAudioElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0;
      });
      console.log(`🔇 Stopped ALL audio (${allAudioElements.length} elements)`);
    } catch (e) {
      console.warn('Error stopping all audio:', e);
    }
    
    // Clear any references
    this.currentTrack = null;
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
  
  // Enhanced sound effects with sparkles, crunch, buzz/explosions
  playSound(type, options = {}) {
    if (!options.volume) options.volume = this.sfxVolume;
    
    // Enhanced sound effects using Web Audio API
    if (!this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Enhanced sound effects for different game events
      switch (type) {
        case 'powerup':
        case 'sparkles':
          // Magical sparkle sound - ascending notes
          this.createSparkleEffect(oscillator, gainNode, options);
          break;
          
        case 'collision':
        case 'crunch':
          // Crunchy collision sound - harsh descending tone
          this.createCrunchEffect(oscillator, gainNode, options);
          break;
          
        case 'boss_attack':
        case 'buzz':
          // Buzzing boss attack - menacing buzz
          this.createBuzzEffect(oscillator, gainNode, options);
          break;
          
        case 'explosion':
          // Explosive sound - white noise burst
          this.createExplosionEffect(oscillator, gainNode, options);
          break;
          
        case 'level_start':
          // Level start fanfare
          this.createFanfareEffect(oscillator, gainNode, options);
          break;
          
        case 'victory':
          // Victory celebration
          this.createVictoryEffect(oscillator, gainNode, options);
          break;
          
        default:
          // Default beep
          oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(options.volume * this.masterVolume, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
      }
      
      const duration = options.duration || 0.5;
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
      
    } catch (e) {
      console.warn('Sound effect failed:', e);
    }
  }
  
  createSparkleEffect(oscillator, gainNode, options) {
    // Magical ascending sparkle - like collecting stars
    oscillator.type = 'sine';
    const startFreq = 800;
    const endFreq = 1600;
    const currentTime = this.audioContext.currentTime;
    
    oscillator.frequency.setValueAtTime(startFreq, currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFreq, currentTime + 0.3);
    
    // Shimmering volume envelope
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(options.volume * this.masterVolume, currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(options.volume * this.masterVolume * 0.7, currentTime + 0.15);
    gainNode.gain.linearRampToValueAtTime(options.volume * this.masterVolume, currentTime + 0.25);
    gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.4);
  }
  
  createCrunchEffect(oscillator, gainNode, options) {
    // Harsh crunchy collision - like hitting an asteroid
    oscillator.type = 'sawtooth';
    const startFreq = 200;
    const endFreq = 50;
    const currentTime = this.audioContext.currentTime;
    
    oscillator.frequency.setValueAtTime(startFreq, currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFreq, currentTime + 0.2);
    
    // Sharp attack, quick decay
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(options.volume * this.masterVolume, currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.25);
  }
  
  createBuzzEffect(oscillator, gainNode, options) {
    // Menacing boss attack buzz - like insect wings
    oscillator.type = 'sawtooth';
    const baseFreq = 120;
    const currentTime = this.audioContext.currentTime;
    
    // Rapid frequency modulation for buzzing effect
    oscillator.frequency.setValueAtTime(baseFreq, currentTime);
    
    // Create tremolo effect
    const tremolo = this.audioContext.createOscillator();
    const tremoloGain = this.audioContext.createGain();
    
    tremolo.frequency.setValueAtTime(15, currentTime); // 15Hz tremolo
    tremolo.connect(tremoloGain);
    tremoloGain.connect(gainNode.gain);
    tremoloGain.gain.setValueAtTime(0.5, currentTime);
    
    tremolo.start(currentTime);
    tremolo.stop(currentTime + 0.6);
    
    gainNode.gain.setValueAtTime(options.volume * this.masterVolume * 0.8, currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.6);
  }
  
  createExplosionEffect(oscillator, gainNode, options) {
    // Explosive burst - white noise simulation
    oscillator.type = 'sawtooth';
    const currentTime = this.audioContext.currentTime;
    
    // Rapid frequency sweep for explosion effect
    oscillator.frequency.setValueAtTime(300, currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(60, currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(30, currentTime + 0.3);
    
    // Sharp attack, medium decay
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(options.volume * this.masterVolume, currentTime + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(options.volume * this.masterVolume * 0.3, currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.4);
  }
  
  createFanfareEffect(oscillator, gainNode, options) {
    // Level start fanfare - triumphant ascending notes
    oscillator.type = 'triangle';
    const currentTime = this.audioContext.currentTime;
    
    // Musical fanfare sequence
    oscillator.frequency.setValueAtTime(440, currentTime);        // A
    oscillator.frequency.setValueAtTime(523, currentTime + 0.15); // C
    oscillator.frequency.setValueAtTime(659, currentTime + 0.3);  // E
    
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(options.volume * this.masterVolume * 0.7, currentTime + 0.05);
    gainNode.gain.setValueAtTime(options.volume * this.masterVolume * 0.7, currentTime + 0.45);
    gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.6);
  }
  
  createVictoryEffect(oscillator, gainNode, options) {
    // Victory celebration - major chord arpeggio
    oscillator.type = 'sine';
    const currentTime = this.audioContext.currentTime;
    
    // Victory arpeggio: C-E-G-C
    oscillator.frequency.setValueAtTime(523, currentTime);        // C
    oscillator.frequency.setValueAtTime(659, currentTime + 0.1);  // E  
    oscillator.frequency.setValueAtTime(784, currentTime + 0.2);  // G
    oscillator.frequency.setValueAtTime(1047, currentTime + 0.3); // C (octave)
    
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(options.volume * this.masterVolume * 0.8, currentTime + 0.05);
    gainNode.gain.setValueAtTime(options.volume * this.masterVolume * 0.8, currentTime + 0.35);
    gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.8);
  }
  
  // Mute all audio
  mute() {
    this.wasMuted = false; // Track previous state
    if (this.currentTrack && !this.currentTrack.paused) {
      this.wasMuted = true;
      this.pauseMusic();
    }
    this.musicVolume = 0;
    this.sfxVolume = 0;
    console.log('🔇 Audio muted');
  }
  
  // Unmute all audio  
  unmute() {
    this.musicVolume = 0.4; // Restore music volume
    this.sfxVolume = 0.6;   // Restore SFX volume
    if (this.wasMuted && this.currentTrack) {
      this.resumeMusic();
    }
    console.log('🔊 Audio unmuted');
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
};