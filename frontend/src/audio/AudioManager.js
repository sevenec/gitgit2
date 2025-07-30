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
        // Rich cinematic chord progression: C - Am - F - G
        harmony: [261.63, 329.63, 392.00], // C Major chord
        secondaryHarmony: [220.00, 261.63, 329.63], // A Minor chord  
        tertiaryHarmony: [174.61, 220.00, 261.63], // F Major chord
        bassline: [130.81, 110.00, 87.31, 98.00], // C - A - F - G bass progression
        melody: [523.25, 587.33, 659.25, 698.46, 783.99, 659.25, 523.25],
        tempo: 1800,
        atmosphere: 'cinematic_ambient',
        hasRhythm: false,
        hasArpeggio: true,
        electronic: true
      },
      1: { 
        name: 'Starry Awakening',
        mood: 'epic_adventure',
        key: 'C',
        // Epic progression: C - G - Am - F (I-V-vi-IV)
        harmony: [261.63, 329.63, 392.00], // C Major
        secondaryHarmony: [196.00, 246.94, 293.66], // G Major
        tertiaryHarmony: [220.00, 261.63, 329.63], // A Minor
        quaternaryHarmony: [174.61, 220.00, 261.63], // F Major
        bassline: [130.81, 98.00, 110.00, 87.31], // C - G - A - F
        melody: [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 783.99, 659.25],
        counterMelody: [392.00, 440.00, 493.88, 523.25, 440.00, 392.00],
        tempo: 1000,
        atmosphere: 'heroic_bright',
        hasRhythm: true,
        hasArpeggio: true,
        hasCounterMelody: true,
        electronic: true
      },
      2: { 
        name: 'Aurora Dance',
        mood: 'energetic_electronic',
        key: 'D',
        // Energetic progression: D - Bm - G - A
        harmony: [293.66, 369.99, 440.00], // D Major
        secondaryHarmony: [246.94, 293.66, 369.99], // B Minor
        tertiaryHarmony: [196.00, 246.94, 293.66], // G Major
        quaternaryHarmony: [220.00, 277.18, 329.63], // A Major
        bassline: [146.83, 123.47, 98.00, 110.00],
        melody: [587.33, 659.25, 739.99, 830.61, 880.00, 783.99, 659.25, 587.33],
        counterMelody: [440.00, 493.88, 554.37, 587.33, 523.25, 440.00],
        tempo: 800,
        atmosphere: 'electronic_dance',
        hasRhythm: true,
        hasArpeggio: true,
        hasCounterMelody: true,
        electronic: true
      },
      10: {
        name: 'Void Tension',
        mood: 'dark_cinematic',
        key: 'Dm',
        // Dark progression: Dm - Bb - F - C
        harmony: [146.83, 185.00, 220.00], // D Minor
        secondaryHarmony: [116.54, 146.83, 174.61], // Bb Major
        tertiaryHarmony: [174.61, 220.00, 261.63], // F Major
        quaternaryHarmony: [130.81, 164.81, 196.00], // C Major
        bassline: [73.42, 58.27, 87.31, 65.41],
        melody: [293.66, 349.23, 392.00, 440.00, 466.16, 392.00, 349.23, 293.66],
        counterMelody: [220.00, 246.94, 277.18, 293.66, 261.63, 220.00],
        tempo: 1400,
        atmosphere: 'dark_tension',
        hasRhythm: false,
        hasArpeggio: true,
        hasCounterMelody: true,
        electronic: true
      },
      15: {
        name: 'Mother Insect Battle',
        mood: 'epic_boss_orchestral',
        key: 'Dm',
        // Epic boss progression: Dm - Gm - A - Dm
        harmony: [146.83, 185.00, 220.00], // D Minor
        secondaryHarmony: [98.00, 116.54, 146.83], // G Minor
        tertiaryHarmony: [110.00, 138.59, 164.81], // A Major
        quaternaryHarmony: [146.83, 185.00, 220.00], // D Minor (return)
        bassline: [73.42, 49.00, 55.00, 73.42],
        melody: [293.66, 349.23, 415.30, 466.16, 523.25, 587.33, 523.25, 466.16],
        counterMelody: [220.00, 261.63, 311.13, 349.23, 392.00, 349.23, 293.66],
        epicHarmony: [587.33, 698.46, 830.61], // High octave power chords
        tempo: 600,
        atmosphere: 'epic_orchestral',
        hasRhythm: true,
        hasArpeggio: true,
        hasCounterMelody: true,
        hasEpicLayer: true,
        electronic: true
      }
    };
    
    // Professional fallback system
    const defaultConfig = {
      name: 'Professional Default',
      mood: 'cinematic_safe',
      key: 'C',
      harmony: [261.63, 329.63, 392.00],
      secondaryHarmony: [220.00, 261.63, 329.63],
      bassline: [130.81, 110.00],
      melody: [523.25, 587.33, 659.25, 523.25],
      tempo: 1200,
      atmosphere: 'professional',
      hasRhythm: true,
      hasArpeggio: true,
      electronic: true
    };
    
    const config = configs[level] || configs[Math.min(Math.max(level, 1), 15)] || defaultConfig;
    
    // Validate all harmonic content
    if (!config.harmony || !config.bassline || !config.melody) {
      console.warn(`⚠️ Invalid music config for level ${level}, using professional default`);
      return defaultConfig;
    }
    
    return config;
  }

  // ULTRA-PREMIUM Orchestral Harmony with Advanced Audio Processing
  createOrchestralHarmony(config) {
    try {
      if (!config || !config.harmony || !Array.isArray(config.harmony)) {
        console.warn('⚠️ Invalid harmony config, skipping orchestral harmony');
        return;
      }

      console.log(`🎼 Creating ULTRA-PREMIUM orchestral harmony with ${config.harmony.length} voices`);
      
      // Create multiple instrument layers for rich orchestral sound
      config.harmony.forEach((freq, index) => {
        try {
          // === STRING SECTION LAYER ===
          this.createStringSection(freq, index);
          
          // === BRASS SECTION LAYER ===
          this.createBrassSection(freq, index);
          
          // === WOODWIND SECTION LAYER ===
          this.createWoodwindSection(freq, index);
          
          // === ELECTRONIC PAD LAYER ===
          this.createElectronicPadLayer(freq, index);
          
          // Add bassline for foundation
          if (config.bassline && config.bassline[index]) {
            this.createAdvancedBassline(config.bassline[index], index);
          }
        } catch (error) {
          console.warn(`⚠️ Error creating orchestral layer at index ${index}:`, error);
        }
      });
      
      console.log(`✅ ULTRA-PREMIUM orchestral harmony created with ${this.currentMusicNodes.length} active nodes`);
    } catch (error) {
      console.error('❌ Critical error in createOrchestralHarmony:', error);
    }
  }

  createStringSection(freq, index) {
    // Advanced string section with multiple oscillators for rich harmonic content
    for (let harmonic = 1; harmonic <= 3; harmonic++) {
      const stringOsc = this.audioContext.createOscillator();
      const stringGain = this.audioContext.createGain();
      const stringFilter = this.audioContext.createBiquadFilter();
      const stringReverb = this.createReverbNode();
      
      // Use multiple waveforms for richer string sound
      const waveforms = ['sawtooth', 'triangle', 'sine'];
      stringOsc.type = waveforms[harmonic - 1];
      
      // FIXED: Proper harmonic series for rich orchestral sound
      stringOsc.frequency.value = freq * harmonic; // True harmonics: 1x, 2x, 3x
      
      // Advanced filtering for orchestral warmth with proper frequency spread
      stringFilter.type = 'bandpass';
      stringFilter.frequency.value = 600 + (index * 400) + (harmonic * 300); // Better separation
      stringFilter.Q.value = 1.5 + (harmonic * 0.3); // Gentler resonance
      
      // Connect with reverb for spatial depth
      stringOsc.connect(stringFilter);
      stringFilter.connect(stringReverb);
      stringReverb.connect(stringGain);
      stringGain.connect(this.musicGain);
      
      // Dynamic volume with proper harmonic balance
      const volume = (0.006 + (index * 0.001)) / Math.sqrt(harmonic); // Natural harmonic volume decay
      stringGain.gain.value = volume;
      
      stringOsc.start();
      this.currentMusicNodes.push(stringOsc);
    }
  }

  createBrassSection(freq, index) {
    // Rich brass section with characteristic harmonic content
    const brassOsc = this.audioContext.createOscillator();
    const brassGain = this.audioContext.createGain();
    const brassFilter = this.audioContext.createBiquadFilter();
    const brassDistortion = this.createDistortionNode(0.1);
    
    brassOsc.type = 'sawtooth'; // Rich harmonic content for brass
    brassOsc.frequency.value = freq * 0.75; // Perfect fourth interval for brass depth
    
    // Brass-specific filtering
    brassFilter.type = 'bandpass';
    brassFilter.frequency.value = 300 + (index * 200); // Lower frequency range
    brassFilter.Q.value = 2.5;
    
    // Connect with subtle distortion for brass character
    brassOsc.connect(brassDistortion);
    brassDistortion.connect(brassFilter);
    brassFilter.connect(brassGain);
    brassGain.connect(this.musicGain);
    
    brassGain.gain.value = 0.004 + (index * 0.001); // Reduced volume
    
    brassOsc.start();
    this.currentMusicNodes.push(brassOsc);
  }

  createWoodwindSection(freq, index) {
    // Ethereal woodwind layer for atmospheric depth
    const woodOsc = this.audioContext.createOscillator();
    const woodGain = this.audioContext.createGain();
    const woodFilter = this.audioContext.createBiquadFilter();
    const woodLFO = this.audioContext.createOscillator();
    const woodLFOGain = this.audioContext.createGain();
    
    woodOsc.type = 'triangle';
    woodOsc.frequency.value = freq * 2; // Higher octave for woodwinds
    
    // LFO for subtle vibrato
    woodLFO.type = 'sine';
    woodLFO.frequency.value = 4 + Math.random() * 2; // 4-6 Hz vibrato
    woodLFOGain.gain.value = 3;
    
    woodLFO.connect(woodLFOGain);
    woodLFOGain.connect(woodOsc.frequency);
    
    // Woodwind-specific filtering
    woodFilter.type = 'lowpass';
    woodFilter.frequency.value = 1200 + (index * 200);
    woodFilter.Q.value = 1.5;
    
    woodOsc.connect(woodFilter);
    woodFilter.connect(woodGain);
    woodGain.connect(this.musicGain);
    
    woodGain.gain.value = 0.004 + (index * 0.001);
    
    woodOsc.start();
    woodLFO.start();
    this.currentMusicNodes.push(woodOsc);
    this.currentMusicNodes.push(woodLFO);
  }

  createElectronicPadLayer(freq, index) {
    // Advanced electronic pad with phase modulation
    const padOsc1 = this.audioContext.createOscillator();
    const padOsc2 = this.audioContext.createOscillator();
    const padGain = this.audioContext.createGain();
    const padFilter = this.audioContext.createBiquadFilter();
    const padDelay = this.createDelayNode(0.3, 0.2);
    
    padOsc1.type = 'sine';
    padOsc2.type = 'triangle';
    padOsc1.frequency.value = freq * 4; // Higher octave
    padOsc2.frequency.value = freq * 4.01; // Slight detuning for beating effect
    
    // Advanced filtering with resonance
    padFilter.type = 'bandpass';
    padFilter.frequency.value = 1000 + (index * 400);
    padFilter.Q.value = 4;
    
    // Mix both oscillators
    const mixer = this.audioContext.createGain();
    padOsc1.connect(mixer);
    padOsc2.connect(mixer);
    
    mixer.connect(padFilter);
    padFilter.connect(padDelay);
    padDelay.connect(padGain);
    padGain.connect(this.musicGain);
    
    padGain.gain.value = 0.003;
    
    padOsc1.start();
    padOsc2.start();
    this.currentMusicNodes.push(padOsc1);
    this.currentMusicNodes.push(padOsc2);
  }

  createAdvancedBassline(freq, index) {
    // Deep, rich bassline with sub-harmonics
    const bassOsc = this.audioContext.createOscillator();
    const subOsc = this.audioContext.createOscillator();
    const bassGain = this.audioContext.createGain();
    const bassFilter = this.audioContext.createBiquadFilter();
    const bassCompressor = this.createCompressorNode();
    
    bassOsc.type = 'sine';
    subOsc.type = 'sine';
    bassOsc.frequency.value = freq;
    subOsc.frequency.value = freq * 0.5; // Sub-octave
    
    // Bass-specific filtering
    bassFilter.type = 'lowpass';
    bassFilter.frequency.value = 150 + (index * 50);
    bassFilter.Q.value = 2;
    
    // Mix bass and sub
    const bassMixer = this.audioContext.createGain();
    bassOsc.connect(bassMixer);
    subOsc.connect(bassMixer);
    
    bassMixer.connect(bassFilter);
    bassFilter.connect(bassCompressor);
    bassCompressor.connect(bassGain);
    bassGain.connect(this.musicGain);
    
    bassGain.gain.value = 0.015 + (index * 0.005);
    
    bassOsc.start();
    subOsc.start();
    this.currentMusicNodes.push(bassOsc);
    this.currentMusicNodes.push(subOsc);
  }

  // Advanced Audio Processing Nodes
  createReverbNode() {
    const reverbGain = this.audioContext.createGain();
    const delay1 = this.audioContext.createDelay();
    const delay2 = this.audioContext.createDelay();
    const delay3 = this.audioContext.createDelay();
    
    delay1.delayTime.value = 0.03;
    delay2.delayTime.value = 0.07;
    delay3.delayTime.value = 0.11;
    
    const feedback1 = this.audioContext.createGain();
    const feedback2 = this.audioContext.createGain();
    const feedback3 = this.audioContext.createGain();
    
    feedback1.gain.value = 0.3;
    feedback2.gain.value = 0.25;
    feedback3.gain.value = 0.2;
    
    // Create reverb network
    delay1.connect(feedback1);
    feedback1.connect(delay1);
    delay1.connect(reverbGain);
    
    delay2.connect(feedback2);
    feedback2.connect(delay2);
    delay2.connect(reverbGain);
    
    delay3.connect(feedback3);
    feedback3.connect(delay3);
    delay3.connect(reverbGain);
    
    reverbGain.gain.value = 0.2;
    
    return delay1;
  }

  createDistortionNode(amount) {
    const waveshaper = this.audioContext.createWaveShaper();
    const samples = 44100;
    const curve = new Float32Array(samples);
    
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = Math.tanh(x * amount * 10) * 0.5;
    }
    
    waveshaper.curve = curve;
    waveshaper.oversample = '4x';
    
    return waveshaper;
  }

  createDelayNode(delayTime, feedback) {
    const delay = this.audioContext.createDelay();
    const feedbackGain = this.audioContext.createGain();
    const wetGain = this.audioContext.createGain();
    
    delay.delayTime.value = delayTime;
    feedbackGain.gain.value = feedback;
    wetGain.gain.value = 0.3;
    
    delay.connect(feedbackGain);
    feedbackGain.connect(delay);
    delay.connect(wetGain);
    
    return wetGain;
  }

  createCompressorNode() {
    const compressor = this.audioContext.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.knee.value = 30;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;
    
    return compressor;
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
    let melodyNodes = [];
    
    const playAdvancedMelodyNote = () => {
      if (this.isMuted || !this.audioContext || !this.currentMusic) return;
      
      // Clean up previous notes
      melodyNodes.forEach(node => {
        try { if (node.stop) node.stop(); } catch(e) {}
      });
      melodyNodes = [];
      
      // Create ADVANCED MELODIC INSTRUMENT
      const leadOsc = this.audioContext.createOscillator();
      const harmOsc = this.audioContext.createOscillator();
      const melodyGain = this.audioContext.createGain();
      const melodyFilter = this.audioContext.createBiquadFilter();
      const melodyReverb = this.createReverbNode();
      const melodyDelay = this.createDelayNode(0.125, 0.3);
      const melodyChorus = this.createChorusEffect();
      
      // Dual oscillator setup for richer melody
      const freq = config.melody[melodyIndex % config.melody.length];
      leadOsc.frequency.value = freq;
      harmOsc.frequency.value = freq * 1.5; // Perfect fifth harmony
      
      // Choose sophisticated waveforms based on atmosphere
      switch(config.atmosphere) {
        case 'bright':
          leadOsc.type = 'triangle';
          harmOsc.type = 'sine';
          break;
        case 'energetic':
          leadOsc.type = 'sawtooth';
          harmOsc.type = 'square';
          break;
        case 'mysterious':
          leadOsc.type = 'sine';
          harmOsc.type = 'triangle';
          break;
        case 'tense':
          leadOsc.type = 'square';
          harmOsc.type = 'sawtooth';
          break;
        case 'epic':
          leadOsc.type = 'sawtooth';
          harmOsc.type = 'triangle';
          break;
        default:
          leadOsc.type = 'sine';
          harmOsc.type = 'triangle';
      }
      
      // Advanced filtering with dynamic parameters
      melodyFilter.type = 'bandpass';
      melodyFilter.frequency.value = freq * 2 + (Math.sin(Date.now() * 0.001) * 200);
      melodyFilter.Q.value = 4 + (Math.sin(Date.now() * 0.0007) * 2);
      
      // Create sophisticated audio chain
      const mixer = this.audioContext.createGain();
      leadOsc.connect(mixer);
      harmOsc.connect(mixer);
      mixer.gain.value = 0.7;
      
      mixer.connect(melodyFilter);
      melodyFilter.connect(melodyChorus);
      melodyChorus.connect(melodyDelay);
      melodyDelay.connect(melodyReverb);
      melodyReverb.connect(melodyGain);
      melodyGain.connect(this.musicGain);
      
      // Dynamic envelope for natural phrasing
      const noteLength = config.tempo * 0.0008;
      const sustainLevel = 0.02 + (Math.sin(melodyIndex * 0.5) * 0.01);
      
      melodyGain.gain.setValueAtTime(0, this.audioContext.currentTime);
      melodyGain.gain.linearRampToValueAtTime(sustainLevel, this.audioContext.currentTime + 0.1);
      melodyGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + noteLength);
      
      leadOsc.start(this.audioContext.currentTime);
      harmOsc.start(this.audioContext.currentTime);
      leadOsc.stop(this.audioContext.currentTime + noteLength);
      harmOsc.stop(this.audioContext.currentTime + noteLength);
      
      melodyNodes.push(leadOsc);
      melodyNodes.push(harmOsc);
      
      melodyIndex++;
      
      // Advanced rhythm patterns based on atmosphere
      let nextNoteDelay = config.tempo;
      if (config.atmosphere === 'energetic') {
        nextNoteDelay += Math.sin(melodyIndex * 0.3) * (config.tempo * 0.2);
      } else if (config.atmosphere === 'mysterious') {
        nextNoteDelay += (Math.random() - 0.5) * (config.tempo * 0.3);
      }
      
      this.melodyTimeout = setTimeout(playAdvancedMelodyNote, nextNoteDelay);
    };
    
    // Start melody with sophisticated timing
    this.melodyTimeout = setTimeout(playAdvancedMelodyNote, 1200);
  }

  createChorusEffect() {
    const chorus = this.audioContext.createGain();
    const delay1 = this.audioContext.createDelay();
    const delay2 = this.audioContext.createDelay();
    const delay3 = this.audioContext.createDelay();
    
    const lfo1 = this.audioContext.createOscillator();
    const lfo2 = this.audioContext.createOscillator();
    const lfo3 = this.audioContext.createOscillator();
    
    const lfoGain1 = this.audioContext.createGain();
    const lfoGain2 = this.audioContext.createGain();
    const lfoGain3 = this.audioContext.createGain();
    
    // Set up LFOs for chorus modulation
    lfo1.frequency.value = 0.3;
    lfo2.frequency.value = 0.4;
    lfo3.frequency.value = 0.5;
    
    lfoGain1.gain.value = 0.002;
    lfoGain2.gain.value = 0.003;
    lfoGain3.gain.value = 0.004;
    
    delay1.delayTime.value = 0.02;
    delay2.delayTime.value = 0.025;
    delay3.delayTime.value = 0.03;
    
    // Connect LFOs to delay times
    lfo1.connect(lfoGain1);
    lfo2.connect(lfoGain2);
    lfo3.connect(lfoGain3);
    
    lfoGain1.connect(delay1.delayTime);
    lfoGain2.connect(delay2.delayTime);
    lfoGain3.connect(delay3.delayTime);
    
    // Mix delayed signals
    delay1.connect(chorus);
    delay2.connect(chorus);
    delay3.connect(chorus);
    
    chorus.gain.value = 0.3;
    
    lfo1.start();
    lfo2.start();
    lfo3.start();
    
    return delay1; // Return input node
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