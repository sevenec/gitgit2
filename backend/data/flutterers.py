# Mirror of frontend flutterer data for backend validation
RARITY_TIERS = {
    'COMMON': 'common',
    'RARE': 'rare', 
    'EPIC': 'epic',
    'LEGENDARY': 'legendary'
}

RARITY_PRICES = {
    'common': 0.99,
    'rare': 1.99,
    'epic': 2.99,
    'legendary': 4.99
}

FLUTTERERS = [
    {
        "id": "basic_cosmic",
        "name": "Basic Cosmic Flutter",
        "rarity": "common",
        "price": 0,  # Free starter
        "unlock_condition": "starter"
    },
    {
        "id": "stardust_dancer", 
        "name": "Stardust Dancer",
        "rarity": "common",
        "price": 0.99,
        "unlock_condition": "score_5000"
    },
    {
        "id": "solar_glider",
        "name": "Solar Glider", 
        "rarity": "common",
        "price": 0.99,
        "unlock_condition": "level_5"
    },
    {
        "id": "frost_wing",
        "name": "Frost Wing",
        "rarity": "rare",
        "price": 1.99,
        "unlock_condition": "defeat_100_enemies"
    },
    {
        "id": "plasma_striker",
        "name": "Plasma Striker",
        "rarity": "rare", 
        "price": 1.99,
        "unlock_condition": "survive_300_seconds"
    },
    {
        "id": "void_phantom",
        "name": "Void Phantom",
        "rarity": "rare",
        "price": 1.99,
        "unlock_condition": "score_25000"
    },
    {
        "id": "epic_blaster_wing",
        "name": "Epic Blaster Wing",
        "rarity": "epic",
        "price": 2.99,
        "unlock_condition": "purchase_or_level_10"
    },
    {
        "id": "cosmic_guardian",
        "name": "Cosmic Guardian",
        "rarity": "epic",
        "price": 2.99,
        "unlock_condition": "defeat_boss_3_times"
    },
    {
        "id": "legendary_nebula_guardian",
        "name": "Legendary Nebula Guardian",
        "rarity": "legendary",
        "price": 4.99,
        "unlock_condition": "purchase_or_complete_all_levels"
    },
    {
        "id": "speedy_cosmic_flutter",
        "name": "Speedy Cosmic Flutter",
        "rarity": "legendary",
        "price": 4.99,
        "unlock_condition": "purchase_or_speedrun_record"
    }
]

STARTER_PACK = {
    "id": "starter_pack",
    "name": "Cosmic Starter Pack",
    "price": 5.99,
    "contents": [
        {"type": "flutterer", "id": "epic_blaster_wing"},
        {"type": "coins", "amount": 1000},
        {"type": "power_up_bundle", "count": 5}
    ]
}