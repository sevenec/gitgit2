// Level configurations with unique backgrounds and themes
export const LEVEL_THEMES = {
  STARRY_NIGHT: 'starry_night',
  COSMIC_AURORA: 'cosmic_aurora', 
  NEBULA_CLOUDS: 'nebula_clouds',
  CRYSTAL_VOID: 'crystal_void',
  PLASMA_STORM: 'plasma_storm',
  DARK_MATTER: 'dark_matter',
  QUANTUM_REALM: 'quantum_realm',
  SOLAR_FLARE: 'solar_flare',
  GALACTIC_CORE: 'galactic_core',
  VOID_DARKNESS: 'void_darkness',
  BOSS_ARENA: 'boss_arena'
};

export const LEVEL_CONFIGS = [
  // Levels 1-5: Starry Beginnings
  {
    level: 1,
    theme: LEVEL_THEMES.STARRY_NIGHT,
    name: 'Starry Genesis',
    background: {
      gradient: ['#0B1426', '#1B2951', '#2A3F7A'],
      stars: { count: 100, speed: 1, brightness: 0.8 },
      effects: ['twinkling_stars']
    },
    music: 'orchestral_beginning.mp3',
    difficulty: {
      gameSpeed: 2,
      obstacleSpawnRate: 0.02,
      powerUpSpawnRate: 0.005
    }
  },
  {
    level: 2,
    theme: LEVEL_THEMES.STARRY_NIGHT,
    name: 'Cosmic Drift',
    background: {
      gradient: ['#1A1B3A', '#2D2E5F', '#4A4B7C'],
      stars: { count: 120, speed: 1.2, brightness: 0.9 },
      effects: ['shooting_stars']
    },
    music: 'electronic_drift.mp3',
    difficulty: {
      gameSpeed: 2.5,
      obstacleSpawnRate: 0.025,
      powerUpSpawnRate: 0.006
    }
  },
  {
    level: 3,
    theme: LEVEL_THEMES.COSMIC_AURORA,
    name: 'Aurora Fields',
    background: {
      gradient: ['#2D1B69', '#4A2B7A', '#6B3B8E'],
      stars: { count: 80, speed: 1.5, brightness: 0.7 },
      effects: ['aurora_waves', 'floating_particles']
    },
    music: 'ambient_aurora.mp3',
    difficulty: {
      gameSpeed: 3,
      obstacleSpawnRate: 0.03,
      powerUpSpawnRate: 0.007
    }
  },
  {
    level: 4,
    theme: LEVEL_THEMES.COSMIC_AURORA,
    name: 'Magnetic Storms',
    background: {
      gradient: ['#1E3A5F', '#3B5998', '#5B7BC7'],
      stars: { count: 90, speed: 1.8, brightness: 0.6 },
      effects: ['magnetic_pulses', 'energy_streams']
    },
    music: 'electronic_storm.mp3',
    difficulty: {
      gameSpeed: 3.5,
      obstacleSpawnRate: 0.035,
      powerUpSpawnRate: 0.008
    }
  },
  {
    level: 5,
    theme: LEVEL_THEMES.NEBULA_CLOUDS,
    name: 'Colorful Nebula',
    background: {
      gradient: ['#8B2986', '#E94560', '#F2CC8F'],
      stars: { count: 60, speed: 2, brightness: 0.5 },
      effects: ['nebula_clouds', 'color_shifts']
    },
    music: 'orchestral_wonder.mp3',
    difficulty: {
      gameSpeed: 4,
      obstacleSpawnRate: 0.04,
      powerUpSpawnRate: 0.009
    }
  },

  // Levels 6-10: Intermediate Challenges
  {
    level: 6,
    theme: LEVEL_THEMES.CRYSTAL_VOID,
    name: 'Crystal Formations',
    background: {
      gradient: ['#2D1B4E', '#4A2B7D', '#7B3F98'],
      stars: { count: 70, speed: 2.2, brightness: 0.9 },
      effects: ['crystal_fragments', 'light_refraction']
    },
    music: 'electronic_crystal.mp3',
    difficulty: {
      gameSpeed: 4.5,
      obstacleSpawnRate: 0.045,
      powerUpSpawnRate: 0.01
    }
  },
  {
    level: 7,
    theme: LEVEL_THEMES.PLASMA_STORM,
    name: 'Plasma Turbulence',
    background: {
      gradient: ['#4A1810', '#7A2815', '#B73E1A'],
      stars: { count: 50, speed: 2.5, brightness: 0.4 },
      effects: ['plasma_bolts', 'energy_discharge']
    },
    music: 'intense_electronic.mp3',
    difficulty: {
      gameSpeed: 5,
      obstacleSpawnRate: 0.05,
      powerUpSpawnRate: 0.011
    }
  },
  {
    level: 8,
    theme: LEVEL_THEMES.QUANTUM_REALM,
    name: 'Quantum Fluctuations',
    background: {
      gradient: ['#1A4B3E', '#2E7D69', '#42B883'],
      stars: { count: 85, speed: 2.8, brightness: 0.7 },
      effects: ['quantum_shifts', 'probability_waves']
    },
    music: 'ambient_quantum.mp3',
    difficulty: {
      gameSpeed: 5.5,
      obstacleSpawnRate: 0.055,
      powerUpSpawnRate: 0.012
    }
  },
  {
    level: 9,
    theme: LEVEL_THEMES.SOLAR_FLARE,
    name: 'Solar Eruption',
    background: {
      gradient: ['#7A2D0A', '#D2691E', '#FF8C00'],
      stars: { count: 40, speed: 3, brightness: 0.3 },
      effects: ['solar_flares', 'heat_waves']
    },
    music: 'orchestral_epic.mp3',
    difficulty: {
      gameSpeed: 6,
      obstacleSpawnRate: 0.06,
      powerUpSpawnRate: 0.013
    }
  },
  {
    level: 10,
    theme: LEVEL_THEMES.GALACTIC_CORE,
    name: 'Galactic Heart',
    background: {
      gradient: ['#4A1A4A', '#7A2A7A', '#AA3AAA'],
      stars: { count: 120, speed: 3.2, brightness: 0.8 },
      effects: ['gravitational_lensing', 'core_pulsation']
    },
    music: 'electronic_core.mp3',
    difficulty: {
      gameSpeed: 6.5,
      obstacleSpawnRate: 0.065,
      powerUpSpawnRate: 0.014
    }
  },

  // Levels 11-14: Advanced Darkness
  {
    level: 11,
    theme: LEVEL_THEMES.VOID_DARKNESS,
    name: 'Event Horizon',
    background: {
      gradient: ['#000000', '#1A001A', '#330033'],
      stars: { count: 30, speed: 3.5, brightness: 0.2 },
      effects: ['void_distortion', 'event_horizon']
    },
    music: 'dark_ambient.mp3',
    difficulty: {
      gameSpeed: 7,
      obstacleSpawnRate: 0.07,
      powerUpSpawnRate: 0.015
    }
  },
  {
    level: 12,
    theme: LEVEL_THEMES.VOID_DARKNESS,
    name: 'Dark Matter Storm',
    background: {
      gradient: ['#0A0A0A', '#2A002A', '#4A004A'],
      stars: { count: 25, speed: 3.8, brightness: 0.15 },
      effects: ['dark_matter_streams', 'gravity_waves']
    },
    music: 'orchestral_dark.mp3',
    difficulty: {
      gameSpeed: 7.5,
      obstacleSpawnRate: 0.075,
      powerUpSpawnRate: 0.016
    }
  },
  {
    level: 13,
    theme: LEVEL_THEMES.VOID_DARKNESS,
    name: 'Singularity Approach',
    background: {
      gradient: ['#000000', '#330066', '#660099'],
      stars: { count: 20, speed: 4, brightness: 0.1 },
      effects: ['singularity_pull', 'space_distortion']
    },
    music: 'electronic_ominous.mp3',
    difficulty: {
      gameSpeed: 8,
      obstacleSpawnRate: 0.08,
      powerUpSpawnRate: 0.017
    }
  },
  {
    level: 14,
    theme: LEVEL_THEMES.VOID_DARKNESS,
    name: 'Pre-Boss Gauntlet',
    background: {
      gradient: ['#1A0000', '#4A001A', '#7A0033'],
      stars: { count: 15, speed: 4.5, brightness: 0.05 },
      effects: ['energy_buildup', 'boss_presence']
    },
    music: 'intense_buildup.mp3',
    difficulty: {
      gameSpeed: 8.5,
      obstacleSpawnRate: 0.085,
      powerUpSpawnRate: 0.018
    }
  },

  // Level 15: Epic Boss Fight
  {
    level: 15,
    theme: LEVEL_THEMES.BOSS_ARENA,
    name: 'Mother Insect\'s Lair',
    background: {
      gradient: ['#4B0082', '#8B008B', '#FF1493'],
      stars: { count: 200, speed: 1, brightness: 1 },
      effects: ['boss_aura', 'energy_tendrils', 'pulsating_core']
    },
    music: 'epic_boss_battle.mp3',
    difficulty: {
      gameSpeed: 4, // Slower for boss mechanics
      obstacleSpawnRate: 0.03, // Boss handles most obstacles
      powerUpSpawnRate: 0.02 // More power-ups for boss fight
    },
    boss: {
      name: 'Mother Insect',
      health: 500,
      phases: 3,
      attacks: ['energy_projectiles', 'swarm_summon', 'rage_beam']
    }
  }
];

export const getLevelConfig = (level) => {
  return LEVEL_CONFIGS.find(l => l.level === level) || LEVEL_CONFIGS[0];
};

export const isBossLevel = (level) => {
  return level === 15;
};

export const getBossConfig = (level) => {
  const config = getLevelConfig(level);
  return config.boss || null;
};