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
      health: 100,
      special: 'trail_sparkles'
    },
    colors: {
      body: '#4A5568',
      wing1: '#E2E8F0',
      wing2: '#CBD5E0',
      accent: '#F7FAFC'
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
      health: 110,
      special: 'freeze_enemies'
    },
    colors: {
      body: '#1E3A8A',
      wing1: '#3B82F6',
      wing2: '#93C5FD',
      accent: '#DBEAFE'
    },
    unlockCondition: 'defeat_100_enemies'
  },
  {
    id: 'plasma_striker',
    name: 'Plasma Striker',
    rarity: RARITY_TIERS.RARE,
    description: 'Generates plasma bursts on collision',
    unlocked: false,
    skills: {
      speed: 1.0,
      health: 100,
      special: 'plasma_burst'
    },
    colors: {
      body: '#7C2D12',
      wing1: '#DC2626',
      wing2: '#F87171',
      accent: '#FEE2E2'
    },
    unlockCondition: 'survive_300_seconds'
  },
  {
    id: 'void_phantom',
    name: 'Void Phantom',
    rarity: RARITY_TIERS.RARE,
    description: 'Phase through obstacles briefly',
    unlocked: false,
    skills: {
      speed: 1.3,
      health: 90,
      special: 'phase_through'
    },
    colors: {
      body: '#111827',
      wing1: '#374151',
      wing2: '#6B7280',
      accent: '#D1D5DB'
    },
    unlockCondition: 'score_25000'
  },

  // Epic Flutterers (2)
  {
    id: 'epic_blaster_wing',
    name: 'Epic Blaster Wing',
    rarity: RARITY_TIERS.EPIC,
    description: 'Shoots energy projectiles to destroy obstacles',
    unlocked: false,
    skills: {
      speed: 1.1,
      health: 120,
      special: 'shoot_projectiles'
    },
    colors: {
      body: '#581C87',
      wing1: '#8B5CF6',
      wing2: '#A78BFA',
      accent: '#DDD6FE'
    },
    unlockCondition: 'purchase_or_level_10'
  },
  {
    id: 'cosmic_guardian',
    name: 'Cosmic Guardian',
    rarity: RARITY_TIERS.EPIC,
    description: 'Creates protective energy barriers',
    unlocked: false,
    skills: {
      speed: 0.9,
      health: 150,
      special: 'energy_barrier'
    },
    colors: {
      body: '#0F766E',
      wing1: '#14B8A6',
      wing2: '#5EEAD4',
      accent: '#CCFBF1'
    },
    unlockCondition: 'defeat_boss_3_times'
  },

  // Legendary Flutterers (2)
  {
    id: 'legendary_nebula_guardian',
    name: 'Legendary Nebula Guardian',
    rarity: RARITY_TIERS.LEGENDARY,
    description: 'One-hit shield and cosmic powers',
    unlocked: false,
    skills: {
      speed: 1.2,
      health: 100,
      special: 'one_hit_shield'
    },
    colors: {
      body: '#92400E',
      wing1: '#F59E0B',
      wing2: '#FCD34D',
      accent: '#FEF3C7',
      glow: '#FBBF24'
    },
    unlockCondition: 'purchase_or_complete_all_levels'
  },
  {
    id: 'speedy_cosmic_flutter',
    name: 'Speedy Cosmic Flutter',
    rarity: RARITY_TIERS.LEGENDARY,
    description: 'Ultimate speed and agility master',
    unlocked: false,
    skills: {
      speed: 1.8,
      health: 80,
      special: 'speed_master'
    },
    colors: {
      body: '#7C2D12',
      wing1: '#EF4444',
      wing2: '#F87171',
      accent: '#FEE2E2',
      glow: '#DC2626'
    },
    unlockCondition: 'purchase_or_speedrun_record'
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