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

  // PROFESSIONAL ORCHESTRAL HARMONY with Advanced Chord Progressions
  createOrchestralHarmony(config) {
    try {
      if (!config || !config.harmony || !Array.isArray(config.harmony)) {
        console.warn('⚠️ Invalid harmony config, skipping orchestral harmony');
        return;
      }

      console.log(`🎼 Creating CINEMATIC orchestral harmony: ${config.name} (${config.mood})`);
      
      // Create professional chord progression system
      this.createAdvancedChordProgression(config);
      
      // Add cinematic string ensemble
      this.createCinematicStrings(config);
      
      // Add orchestral brass section  
      this.createOrchestralBrass(config);
      
      // Add ethereal pad layer
      this.createEtherealPads(config);
      
      // Add professional bass foundation
      this.createProfessionalBass(config);
      
      console.log(`✅ CINEMATIC orchestral harmony created: ${this.currentMusicNodes.length} professional nodes`);
    } catch (error) {
      console.error('❌ Critical error in createOrchestralHarmony:', error);
    }
  }

  createAdvancedChordProgression(config) {
    // Create dynamic chord progression that changes every 4-8 seconds
    let chordIndex = 0;
    const chords = [config.harmony, config.secondaryHarmony, config.tertiaryHarmony, config.quaternaryHarmony].filter(Boolean);
    
    const playChordProgression = () => {
      if (this.isMuted || !this.audioContext || !this.currentMusic) return;
      
      const currentChord = chords[chordIndex % chords.length];
      if (!currentChord) return;
      
      // Create rich chord voicing
      currentChord.forEach((freq, noteIndex) => {
        try {
          // Multiple voices per note for richness
          for (let voice = 0; voice < 2; voice++) {
            const chordOsc = this.audioContext.createOscillator();
            const chordGain = this.audioContext.createGain();
            const chordFilter = this.audioContext.createBiquadFilter();
            const chordReverb = this.createProfessionalReverb();
            
            // Alternate between different waveforms for voices
            chordOsc.type = voice === 0 ? 'sawtooth' : 'triangle';
            chordOsc.frequency.value = freq * (1 + voice * 0.002); // Slight detuning for chorus effect
            
            // Professional orchestral filtering
            chordFilter.type = 'bandpass';
            chordFilter.frequency.value = 400 + (noteIndex * 350) + (voice * 100);
            chordFilter.Q.value = 2.5;
            
            // Connect audio chain
            chordOsc.connect(chordFilter);
            chordFilter.connect(chordReverb);
            chordReverb.connect(chordGain);
            chordGain.connect(this.musicGain);
            
            // Dynamic volume with musical phrasing
            const baseVolume = 0.008 / (noteIndex + 1);
            const currentTime = this.audioContext.currentTime;
            
            chordGain.gain.setValueAtTime(0, currentTime);
            chordGain.gain.linearRampToValueAtTime(baseVolume, currentTime + 0.5); // Slow attack
            chordGain.gain.setValueAtTime(baseVolume, currentTime + 6); // Sustain
            chordGain.gain.linearRampToValueAtTime(0, currentTime + 7); // Fade out
            
            chordOsc.start(currentTime);
            chordOsc.stop(currentTime + 7);
            
            this.currentMusicNodes.push(chordOsc);
          }
        } catch (error) {
          console.warn(`⚠️ Error creating chord note: ${noteIndex}`, error);
        }
      });
      
      chordIndex++;
      
      // Schedule next chord change (4-6 seconds for cinematic pacing)
      const nextChordDelay = 4000 + Math.random() * 2000;
      setTimeout(playChordProgression, nextChordDelay);
    };
    
    // Start chord progression immediately
    playChordProgression();
  }

  createCinematicStrings(config) {
    // High-quality string ensemble with multiple sections
    config.harmony.forEach((freq, index) => {
      // Violin section
      for (let violin = 0; violin < 3; violin++) {
        const violinOsc = this.audioContext.createOscillator();
        const violinGain = this.audioContext.createGain();
        const violinFilter = this.audioContext.createBiquadFilter();
        
        violinOsc.type = 'sawtooth';
        violinOsc.frequency.value = freq * 2 * (1 + violin * 0.001); // Higher octave with slight detuning
        
        violinFilter.type = 'bandpass';
        violinFilter.frequency.value = 800 + (index * 200) + (violin * 50);
        violinFilter.Q.value = 3;
        
        violinOsc.connect(violinFilter);
        violinFilter.connect(violinGain);
        violinGain.connect(this.musicGain);
        
        violinGain.gain.value = 0.003 / (violin + 1);
        
        violinOsc.start();
        this.currentMusicNodes.push(violinOsc);
      }
      
      // Viola section (lower)
      const violaOsc = this.audioContext.createOscillator();
      const violaGain = this.audioContext.createGain();
      const violaFilter = this.audioContext.createBiquadFilter();
      
      violaOsc.type = 'sawtooth';
      violaOsc.frequency.value = freq * 1.5; // Perfect fifth
      
      violaFilter.type = 'bandpass';
      violaFilter.frequency.value = 600 + (index * 150);
      violaFilter.Q.value = 2.5;
      
      violaOsc.connect(violaFilter);
      violaFilter.connect(violaGain);
      violaGain.connect(this.musicGain);
      
      violaGain.gain.value = 0.005;
      
      violaOsc.start();
      this.currentMusicNodes.push(violaOsc);
    });
  }

  createOrchestralBrass(config) {
    // Professional brass section with French horns and trumpets
    config.harmony.forEach((freq, index) => {
      // French Horn
      const hornOsc = this.audioContext.createOscillator();
      const hornGain = this.audioContext.createGain();
      const hornFilter = this.audioContext.createBiquadFilter();
      const hornDistortion = this.createWarmDistortion(0.15);
      
      hornOsc.type = 'sawtooth';
      hornOsc.frequency.value = freq * 0.8; // Slightly lower for horns
      
      hornFilter.type = 'bandpass';
      hornFilter.frequency.value = 350 + (index * 100);
      hornFilter.Q.value = 3.5;
      
      hornOsc.connect(hornDistortion);
      hornDistortion.connect(hornFilter);
      hornFilter.connect(hornGain);
      hornGain.connect(this.musicGain);
      
      hornGain.gain.value = 0.004;
      
      hornOsc.start();
      this.currentMusicNodes.push(hornOsc);
    });
  }

  createEtherealPads(config) {
    // Lush electronic pads for space atmosphere
    config.harmony.forEach((freq, index) => {
      const padOsc1 = this.audioContext.createOscillator();
      const padOsc2 = this.audioContext.createOscillator();
      const padGain = this.audioContext.createGain();
      const padFilter = this.audioContext.createBiquadFilter();
      const padChorus = this.createAdvancedChorus();
      
      padOsc1.type = 'sine';
      padOsc2.type = 'triangle';
      padOsc1.frequency.value = freq * 3; // High ethereal layer
      padOsc2.frequency.value = freq * 3.01; // Slight detuning for thickness
      
      padFilter.type = 'lowpass';
      padFilter.frequency.value = 1200 + (Math.sin(Date.now() * 0.0005 + index) * 200); // Slow filter sweep
      padFilter.Q.value = 1.5;
      
      const mixer = this.audioContext.createGain();
      padOsc1.connect(mixer);
      padOsc2.connect(mixer);
      mixer.connect(padFilter);
      padFilter.connect(padChorus);
      padChorus.connect(padGain);
      padGain.connect(this.musicGain);
      
      padGain.gain.value = 0.002;
      
      padOsc1.start();
      padOsc2.start();
      this.currentMusicNodes.push(padOsc1);
      this.currentMusicNodes.push(padOsc2);
    });
  }

  createProfessionalBass(config) {
    // Deep, rich bass line with professional processing
    config.bassline.forEach((freq, index) => {
      const bassOsc = this.audioContext.createOscillator();
      const subOsc = this.audioContext.createOscillator();
      const bassGain = this.audioContext.createGain();
      const bassFilter = this.audioContext.createBiquadFilter();
      const bassCompressor = this.createAdvancedCompressor();
      
      bassOsc.type = 'sine';
      subOsc.type = 'sine';
      bassOsc.frequency.value = freq;
      subOsc.frequency.value = freq * 0.5; // Sub-bass octave
      
      bassFilter.type = 'lowpass';
      bassFilter.frequency.value = 120 + (index * 30);
      bassFilter.Q.value = 2;
      
      const bassMixer = this.audioContext.createGain();
      bassOsc.connect(bassMixer);
      subOsc.connect(bassMixer);
      bassMixer.connect(bassFilter);
      bassFilter.connect(bassCompressor);
      bassCompressor.connect(bassGain);
      bassGain.connect(this.musicGain);
      
      bassGain.gain.value = 0.012;
      
      bassOsc.start();
      subOsc.start();
      this.currentMusicNodes.push(bassOsc);
      this.currentMusicNodes.push(subOsc);
    });
  }

  // Professional Audio Processing
  createProfessionalReverb() {
    const convolver = this.audioContext.createConvolver();
    
    // Create impulse response for concert hall reverb
    const length = this.audioContext.sampleRate * 3; // 3 seconds
    const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }
    
    convolver.buffer = impulse;
    return convolver;
  }

  createWarmDistortion(amount) {
    const waveshaper = this.audioContext.createWaveShaper();
    const samples = 44100;
    const curve = new Float32Array(samples);
    
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = Math.tanh(x * amount * 8) * 0.7; // Warmer distortion
    }
    
    waveshaper.curve = curve;
    waveshaper.oversample = '4x';
    
    return waveshaper;
  }

  createAdvancedChorus() {
    const chorus = this.audioContext.createGain();
    const delay1 = this.audioContext.createDelay();
    const delay2 = this.audioContext.createDelay();
    
    const lfo1 = this.audioContext.createOscillator();
    const lfo2 = this.audioContext.createOscillator();
    
    const lfoGain1 = this.audioContext.createGain();
    const lfoGain2 = this.audioContext.createGain();
    
    lfo1.frequency.value = 0.4;
    lfo2.frequency.value = 0.6;
    
    lfoGain1.gain.value = 0.003;
    lfoGain2.gain.value = 0.004;
    
    delay1.delayTime.value = 0.015;
    delay2.delayTime.value = 0.025;
    
    lfo1.connect(lfoGain1);
    lfo2.connect(lfoGain2);
    
    lfoGain1.connect(delay1.delayTime);
    lfoGain2.connect(delay2.delayTime);
    
    delay1.connect(chorus);
    delay2.connect(chorus);
    
    chorus.gain.value = 0.4;
    
    lfo1.start();
    lfo2.start();
    
    return delay1;
  }

  createAdvancedCompressor() {
    const compressor = this.audioContext.createDynamicsCompressor();
    compressor.threshold.value = -20;
    compressor.knee.value = 25;
    compressor.ratio.value = 6;
    compressor.attack.value = 0.001;
    compressor.release.value = 0.15;
    
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
    console.log(`🎵 Creating professional melody: ${config.name}`);
    
    let melodyIndex = 0;
    let counterMelodyIndex = 0;
    const currentMelodyNodes = []; // Fixed: Declare in proper scope
    
    const playProfessionalMelody = () => {
      if (this.isMuted || !this.audioContext || !this.currentMusic) return;
      
      // Clean up previous notes
      currentMelodyNodes.forEach(node => {
        try { if (node.stop) node.stop(); } catch(e) {}
      });
      currentMelodyNodes.length = 0; // Clear array
      
      // === MAIN MELODY LINE ===
      this.createMelodyVoice(config, melodyIndex, 'lead', currentMelodyNodes);
      
      // === COUNTER MELODY (if configured) ===
      if (config.hasCounterMelody && config.counterMelody) {
        this.createMelodyVoice(config, counterMelodyIndex, 'counter', currentMelodyNodes);
        counterMelodyIndex++;
      }
      
      // === ARPEGGIATED ACCOMPANIMENT ===
      if (config.hasArpeggio) {
        this.createArpeggioPattern(config, melodyIndex, currentMelodyNodes);
      }
      
      melodyIndex++;
      
      // Professional timing with musical phrasing
      let nextNoteDelay = config.tempo;
      
      // Add musical expression based on atmosphere
      switch(config.atmosphere) {
        case 'heroic_bright':
          nextNoteDelay *= 0.9; // Slightly faster for heroic energy
          break;
        case 'electronic_dance':
          nextNoteDelay *= 0.8 + Math.sin(melodyIndex * 0.5) * 0.2; // Rhythmic variation
          break;
        case 'dark_tension':
          nextNoteDelay *= 1.2 + Math.random() * 0.3; // Irregular for tension
          break;
        case 'epic_orchestral':
          nextNoteDelay *= 0.7; // Fast and dramatic
          break;
        default:
          nextNoteDelay *= 1.0;
      }
      
      this.melodyTimeout = setTimeout(playProfessionalMelody, nextNoteDelay);
    };
    
    // Start with musical entrance timing
    this.melodyTimeout = setTimeout(playProfessionalMelody, 1500);
  }

  createMelodyVoice(config, noteIndex, voiceType, nodeArray) {
    const isLead = voiceType === 'lead';
    const melody = isLead ? config.melody : config.counterMelody;
    if (!melody) return;
    
    const freq = melody[noteIndex % melody.length];
    
    // Create sophisticated lead instrument
    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    const reverb = this.createProfessionalReverb();
    const chorus = this.createAdvancedChorus();
    
    // Professional waveform selection based on atmosphere
    let waveType1, waveType2;
    switch(config.atmosphere) {
      case 'heroic_bright':
        waveType1 = 'sawtooth';
        waveType2 = 'triangle';
        break;
      case 'electronic_dance':
        waveType1 = 'square';
        waveType2 = 'sawtooth';
        break;
      case 'dark_tension':
        waveType1 = 'sine';
        waveType2 = 'triangle';
        break;
      case 'epic_orchestral':
        waveType1 = 'sawtooth';
        waveType2 = 'sine';
        break;
      default:
        waveType1 = 'triangle';
        waveType2 = 'sine';
    }
    
    osc1.type = waveType1;
    osc2.type = waveType2;
    osc1.frequency.value = freq;
    osc2.frequency.value = freq * (isLead ? 1.005 : 1.003); // Slight detuning for thickness
    
    // Professional filtering with dynamic parameters
    filter.type = 'bandpass';
    filter.frequency.value = freq * 1.5 + (Math.sin(Date.now() * 0.002 + noteIndex) * 300);
    filter.Q.value = 3 + Math.sin(Date.now() * 0.001) * 1.5; // Dynamic resonance
    
    // Create professional audio chain
    const mixer = this.audioContext.createGain();
    osc1.connect(mixer);
    osc2.connect(mixer);
    mixer.connect(filter);
    filter.connect(chorus);
    chorus.connect(reverb);
    reverb.connect(gainNode);
    gainNode.connect(this.musicGain);
    
    // Professional envelope shaping with musical phrasing
    const noteLength = config.tempo * 0.0012;
    const currentTime = this.audioContext.currentTime;
    const volume = isLead ? 0.025 : 0.015; // Lead louder than counter-melody
    
    // Musical attack-decay-sustain-release envelope
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.7, currentTime + 0.05); // Quick attack
    gainNode.gain.linearRampToValueAtTime(volume, currentTime + 0.2); // Rise to peak
    gainNode.gain.setValueAtTime(volume * 0.8, currentTime + noteLength * 0.7); // Sustain
    gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + noteLength); // Musical release
    
    osc1.start(currentTime);
    osc2.start(currentTime);
    osc1.stop(currentTime + noteLength);
    osc2.stop(currentTime + noteLength);
    
    nodeArray.push(osc1);
    nodeArray.push(osc2);
  }

  createArpeggioPattern(config, noteIndex, nodeArray) {
    // Create beautiful arpeggiated accompaniment
    const chords = [config.harmony, config.secondaryHarmony, config.tertiaryHarmony].filter(Boolean);
    if (chords.length === 0) return;
    
    const currentChord = chords[Math.floor(noteIndex / 4) % chords.length];
    const arpeggioNote = currentChord[noteIndex % currentChord.length];
    
    const arpOsc = this.audioContext.createOscillator();
    const arpGain = this.audioContext.createGain();
    const arpFilter = this.audioContext.createBiquadFilter();
    const arpDelay = this.createDelayNode(0.125, 0.15);
    
    arpOsc.type = 'triangle';
    arpOsc.frequency.value = arpeggioNote * 0.5; // Lower octave for accompaniment
    
    arpFilter.type = 'bandpass';
    arpFilter.frequency.value = arpeggioNote + 200;
    arpFilter.Q.value = 2;
    
    arpOsc.connect(arpFilter);
    arpFilter.connect(arpDelay);
    arpDelay.connect(arpGain);
    arpGain.connect(this.musicGain);
    
    const currentTime = this.audioContext.currentTime;
    const arpLength = config.tempo * 0.0006;
    
    arpGain.gain.setValueAtTime(0, currentTime);
    arpGain.gain.linearRampToValueAtTime(0.008, currentTime + 0.02);
    arpGain.gain.exponentialRampToValueAtTime(0.001, currentTime + arpLength);
    
    arpOsc.start(currentTime);
    arpOsc.stop(currentTime + arpLength);
    
    nodeArray.push(arpOsc);
  }

  createDelayNode(delayTime, feedback) {
    const delay = this.audioContext.createDelay();
    const feedbackGain = this.audioContext.createGain();
    const wetGain = this.audioContext.createGain();
    
    delay.delayTime.value = delayTime;
    feedbackGain.gain.value = feedback;
    wetGain.gain.value = 0.25; // Subtle delay mix
    
    delay.connect(feedbackGain);
    feedbackGain.connect(delay);
    delay.connect(wetGain);
    
    return wetGain;
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