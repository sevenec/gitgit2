// Butterfly Flutterers - Character Collection System
export const RARITY_TIERS = {
  COMMON: 'common',
  RARE: 'rare', 
  EPIC: 'epic',
  LEGENDARY: 'legendary'
};

export const RARITY_COLORS = {
  [RARITY_TIERS.COMMON]: '#9CA3AF',     // Gray
  [RARITY_TIERS.RARE]: '#3B82F6',      // Blue  
  [RARITY_TIERS.EPIC]: '#8B5CF6',      // Purple
  [RARITY_TIERS.LEGENDARY]: '#F59E0B'   // Gold
};

export const RARITY_PRICES = {
  [RARITY_TIERS.COMMON]: 0.99,
  [RARITY_TIERS.RARE]: 1.99,
  [RARITY_TIERS.EPIC]: 2.99,
  [RARITY_TIERS.LEGENDARY]: 4.99
};

export const FLUTTERERS = [
  // Common Flutterers (3)
  {
    id: 'basic_cosmic',
    name: 'Basic Cosmic Flutter',
    rarity: RARITY_TIERS.COMMON,
    description: 'A standard butterfly explorer of the nebula',
    unlocked: true, // Starting flutterer
    skills: {
      speed: 1.0,
      health: 100,
      special: null
    },
    colors: {
      body: '#8B4513',
      wing1: '#FF6B9D',
      wing2: '#FF8FA3',
      accent: '#FFFFFF'
    },
    visualProps: {
      wingShape: 'standard',
      wingPattern: 'simple',
      size: 1.0,
      trailEffect: false,
      sparkles: false,
      glow: false
    },
    unlockCondition: 'starter'
  },
  {
    id: 'stardust_dancer',
    name: 'Stardust Dancer',
    rarity: RARITY_TIERS.COMMON,
    description: 'Leaves sparkling trails as it flies',
    unlocked: false,
    skills: {
      speed: 1.1,
      health: 90,
      special: 'trail_sparkles'
    },
    colors: {
      body: '#4A5568',
      wing1: '#E2E8F0',
      wing2: '#CBD5E0',
      accent: '#F7FAFC',
      glow: '#FFD700'
    },
    visualProps: {
      wingShape: 'elongated',
      wingPattern: 'sparkles',
      size: 1.1,
      trailEffect: true,
      sparkles: true,
      glow: true
    },
    unlockCondition: 'score_5000'
  },
  {
    id: 'solar_glider',
    name: 'Solar Glider',
    rarity: RARITY_TIERS.COMMON,
    description: 'Powered by solar energy from distant stars',
    unlocked: false,
    skills: {
      speed: 0.9,
      health: 120,
      special: 'solar_boost'
    },
    colors: {
      body: '#B45309',
      wing1: '#F59E0B',
      wing2: '#FCD34D',
      accent: '#FEF3C7'
    },
    visualProps: {
      wingShape: 'broad',
      wingPattern: 'radial',
      size: 1.2,
      trailEffect: false,
      sparkles: false,
      glow: true
    },
    unlockCondition: 'level_5'
  },
  
  // Rare Flutterers (3)
  {
    id: 'frost_wing',
    name: 'Frost Wing',
    rarity: RARITY_TIERS.RARE,
    description: 'Ice-cold wings that freeze enemies briefly',
    unlocked: false,
    skills: {
      speed: 1.2,
      health: 95,
      special: 'frost_freeze'
    },
    colors: {
      body: '#1E3A8A',
      wing1: '#3B82F6',
      wing2: '#93C5FD',
      accent: '#DBEAFE',
      glow: '#00FFFF'
    },
    visualProps: {
      wingShape: 'crystalline',
      wingPattern: 'frost',
      size: 1.0,
      trailEffect: true,
      sparkles: true,
      glow: true
    },
    unlockCondition: 'defeat_boss'
  },
  {
    id: 'thunder_strike',
    name: 'Thunder Strike',
    rarity: RARITY_TIERS.RARE,
    description: 'Electric wings crackle with energy',
    unlocked: false,
    skills: {
      speed: 1.3,
      health: 85,
      special: 'lightning_bolt'
    },
    colors: {
      body: '#4C1D95',
      wing1: '#7C3AED',
      wing2: '#A78BFA',
      accent: '#EDE9FE',
      glow: '#FFFF00'
    },
    visualProps: {
      wingShape: 'angular',
      wingPattern: 'electric',
      size: 1.1,
      trailEffect: true,
      sparkles: false,
      glow: true
    },
    unlockCondition: 'level_10'
  },
  {
    id: 'nature_spirit',
    name: 'Nature Spirit',
    rarity: RARITY_TIERS.RARE,
    description: 'Connected to the life force of distant worlds',
    unlocked: false,
    skills: {
      speed: 1.0,
      health: 110,
      special: 'healing_aura'
    },
    colors: {
      body: '#15803D',
      wing1: '#22C55E',
      wing2: '#86EFAC',
      accent: '#DCFCE7',
      glow: '#00FF00'
    },
    visualProps: {
      wingShape: 'ethereal',
      wingPattern: 'ghostly',
      size: 1.3,
      trailEffect: true,
      sparkles: true,
      glow: true
    },
    unlockCondition: 'survive_60_seconds'
  },
  
  // Epic Flutterers (2)
  {
    id: 'void_walker',
    name: 'Void Walker',
    rarity: RARITY_TIERS.EPIC,
    description: 'Master of dark energy and shadow manipulation',
    unlocked: false,
    skills: {
      speed: 1.4,
      health: 80,
      special: 'phase_shift'
    },
    colors: {
      body: '#000000',
      wing1: '#374151',
      wing2: '#6B7280',
      accent: '#F3F4F6',
      glow: '#8B5CF6'
    },
    visualProps: {
      wingShape: 'armored',
      wingPattern: 'tech',
      size: 1.2,
      trailEffect: true,
      sparkles: false,
      glow: true
    },
    unlockCondition: 'reach_level_12'
  },
  {
    id: 'phoenix_rise',
    name: 'Phoenix Rise',
    rarity: RARITY_TIERS.EPIC,
    description: 'Reborn from cosmic flames, immune to fire damage',
    unlocked: false,
    skills: {
      speed: 1.2,
      health: 120,
      special: 'fire_immunity'
    },
    colors: {
      body: '#DC2626',
      wing1: '#EF4444',
      wing2: '#F87171',
      accent: '#FEE2E2',
      glow: '#FF4500'
    },
    visualProps: {
      wingShape: 'guardian',
      wingPattern: 'legendary',
      size: 1.4,
      trailEffect: true,
      sparkles: true,
      glow: true
    },
    unlockCondition: 'score_50000'
  },
  
  // Legendary Flutterers (2)
  {
    id: 'cosmic_empress',
    name: 'Cosmic Empress',
    rarity: RARITY_TIERS.LEGENDARY,
    description: 'Supreme ruler of the butterfly nebula',
    unlocked: false,
    skills: {
      speed: 1.5,
      health: 150,
      special: 'cosmic_shield'
    },
    colors: {
      body: '#C9B037',
      wing1: '#FFD700',
      wing2: '#FFF8DC',
      accent: '#FFFEF7',
      glow: '#FFD700'
    },
    visualProps: {
      wingShape: 'majestic',
      wingPattern: 'legendary',
      size: 1.5,
      trailEffect: true,
      sparkles: true,
      glow: true
    },
    unlockCondition: 'defeat_all_bosses'
  },
  {
    id: 'quantum_butterfly',
    name: 'Quantum Butterfly',
    rarity: RARITY_TIERS.LEGENDARY,
    description: 'Exists in multiple dimensions simultaneously',
    unlocked: false,
    skills: {
      speed: 1.6,
      health: 100,
      special: 'quantum_phase'
    },
    colors: {
      body: '#7C2D12',
      wing1: '#EA580C',
      wing2: '#FB923C',
      accent: '#FED7AA',
      glow: '#00CED1'
    },
    visualProps: {
      wingShape: 'streamlined',
      wingPattern: 'speed',
      size: 1.3,
      trailEffect: true,
      sparkles: true,
      glow: true
    },
    unlockCondition: 'complete_game'
  }
];

export const STARTER_PACK = {
  id: 'starter_pack',
  name: 'Cosmic Starter Pack',
  price: 5.99,
  contents: [
    { type: 'flutterer', id: 'epic_blaster_wing' },
    { type: 'coins', amount: 1000 },
    { type: 'power_up_bundle', count: 5 }
  ],
  description: 'Perfect start for your cosmic journey!'
};

export const getFluttererById = (id) => {
  return FLUTTERERS.find(f => f.id === id);
};

export const getFlutterersByRarity = (rarity) => {
  return FLUTTERERS.filter(f => f.rarity === rarity);
};

export const getUnlockedFlutterers = () => {
  return FLUTTERERS.filter(f => f.unlocked);
};

export const checkUnlockCondition = (flutterer, gameStats) => {
  const { condition } = flutterer.unlockCondition;
  const { score, level, enemiesDefeated, survivalTime, bossDefeats } = gameStats;
  
  switch (condition) {
    case 'starter': return true;
    case 'score_5000': return score >= 5000;
    case 'score_25000': return score >= 25000;
    case 'level_5': return level >= 5;
    case 'level_10': return level >= 10;
    case 'defeat_100_enemies': return enemiesDefeated >= 100;
    case 'survive_300_seconds': return survivalTime >= 300;
    case 'defeat_boss_3_times': return bossDefeats >= 3;
    case 'complete_all_levels': return level >= 15;
    default: return false;
  }
};