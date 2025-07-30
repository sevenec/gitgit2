# 🦋 Butterfly Nebula Brawl - Technical Contracts & Integration Guide

## 📋 **API CONTRACTS**

### **User Management Endpoints**
```javascript
// POST /api/users/register
{
  "username": "string",
  "device_id": "string", 
  "platform": "android|ios|web",
  "email": "string?" 
}
→ Returns: User object with cosmic_coins, flutterer_progress, game_stats

// GET /api/users/{user_id}
→ Returns: Complete user profile with all progress

// POST /api/users/{user_id}/score
{
  "score": "number",
  "level": "number", 
  "survival_time": "number",
  "enemies_defeated": "number",
  "flutterer_used": "string",
  "session_id": "string"
}
→ Returns: { success: true, coins_awarded: number, new_record: boolean }

// GET /api/users/{user_id}/leaderboard?limit=50
→ Returns: Array of LeaderboardEntry objects with rankings
```

### **Game Configuration Endpoints**
```javascript
// GET /api/game/config
→ Returns: Game settings, monetization config, feature flags

// GET /api/game/flutterers  
→ Returns: Complete flutterer catalog with pricing

// POST /api/game/ad/rewarded?user_id={id}&ad_type=coins
→ Returns: { success: true, reward_type: string, reward_amount: number }

// POST /api/game/share-score
{
  "user_id": "string",
  "score": "number", 
  "platform": "string"
}
→ Returns: { success: true, coins_awarded: 15 }
```

### **Monetization Endpoints**
```javascript
// POST /api/game/purchase/verify
{
  "user_id": "string",
  "item_type": "flutterer|starter_pack|coins",
  "item_id": "string",
  "price_usd": "number",
  "transaction_id": "string",
  "platform": "android|ios"
}
→ Returns: { success: true, purchase_id: string }
```

---

## 🎮 **FRONTEND-BACKEND INTEGRATION PLAN**

### **1. Data Flow Architecture**
```
Frontend (React/Canvas) ↔ API Services ↔ Backend (FastAPI) ↔ Database (MongoDB)
                        ↕
                   Local Storage (Offline Support)
```

### **2. State Management**
- **User State**: Managed by `useUser` hook, synced with backend
- **Game State**: Local game engine + periodic backend sync  
- **Audio State**: Managed by AudioManager singleton
- **UI State**: React component state for menus and overlays

### **3. Backend Integration Points**

#### **Game Start Flow**
1. Frontend: User clicks "Start Game" 
2. Generate session ID and track analytics
3. Load user's selected flutterer from backend
4. Initialize game engine with user stats
5. Start level with appropriate music/background

#### **Score Submission Flow**
1. Game ends (death or level complete)
2. Collect session data: score, level, survival time, enemies defeated
3. Submit to backend via `submitScore` API
4. Backend calculates coins, checks for new records
5. Frontend updates UI with results and coin rewards
6. Refresh user data to show updated stats

#### **Power-up Collection Flow**
1. Player collects power-up in game engine
2. Trigger audio effect via AudioManager
3. Create particle effects via enhanced renderer
4. Update game state and display "+50" popup
5. No backend call needed (real-time gameplay)

#### **Flutterer Selection Flow**
1. User opens flutterer selector
2. Display flutterers from local data
3. Show unlock status based on user progress from backend
4. On selection: Update local state + call `selectFlutterer` API
5. Update game engine with new flutterer abilities

---

## 🔧 **MOCK DATA REPLACEMENT PLAN**

### **Current Mock Data Sources**
```javascript
// /app/frontend/src/data/flutterers.js - Static flutterer definitions
// Will remain static as it's game configuration data

// Game stats in localStorage - REPLACE WITH BACKEND
// User preferences in localStorage - REPLACE WITH BACKEND  
// High scores in localStorage - REPLACE WITH BACKEND
```

### **Backend Data Sources**
```javascript
// User profile from: GET /api/users/{user_id}
// Game config from: GET /api/game/config
// Leaderboard from: GET /api/users/{user_id}/leaderboard
// Daily challenges from: GET /api/users/{user_id}/daily-challenges
```

### **Offline Support Strategy**
```javascript
// Cache user data in localStorage as backup
// Sync when connection available
// Queue API calls when offline
// Graceful degradation for network issues
```

---

## 🎵 **AUDIO SYSTEM INTEGRATION**

### **Audio Manager Integration**
```javascript
// Initialize on app load
window.AudioManager = new AudioManager();

// Level music integration  
gameEngine.initializeLevel() → AudioManager.playMusic(level)

// Sound effects integration
gameEngine.collectPowerUp() → AudioManager.playPowerUpSound(type)
gameEngine.playerHit() → AudioManager.playSound('player_hit')
gameEngine.bossAttack() → AudioManager.playBossSound(attackType)

// UI sound integration  
Button clicks → AudioManager.playSound('button_click')
Menu navigation → AudioManager.playSound('menu_select')
```

### **Music Track Management**
```javascript
// Production: Load actual audio files
// Development: Use AudioManager placeholder synthesis
// Mobile: Preload critical sounds, lazy-load music
// Performance: Audio sprite techniques for mobile optimization
```

---

## 🎨 **VISUAL EFFECTS INTEGRATION**

### **Enhanced Renderer Usage**
```javascript
// Replace basic GameRenderer.js with EnhancedGameRenderer
// Level-specific backgrounds from getLevelBackgroundConfig()
// Premium butterfly rendering with flutterer customization
// Particle system for power-ups and explosions

gameRenderer.renderPremiumButterfly(x, y, selectedFlutterer, effects)
gameRenderer.createPowerUpExplosion(x, y, color)
gameRenderer.renderEnhancedBackground(currentLevel)
```

### **Performance Optimization**
```javascript
// 60 FPS target on mid-range mobile devices
// Particle pooling to reduce garbage collection
// Efficient canvas rendering techniques
// Audio optimization for mobile browsers
```

---

## 💰 **MONETIZATION INTEGRATION**

### **In-App Purchase Flow**
```javascript
// Frontend: User clicks purchase button
// Validate with backend: GET /api/game/flutterers (check pricing)
// Initiate platform purchase: Google Play Billing / Apple IAP
// Verify purchase: POST /api/game/purchase/verify
// Backend processes: Unlock item, add coins, update user
// Frontend refreshes: Update UI, show confirmation
```

### **AdMob Integration**
```javascript
// Rewarded ads: POST /api/game/ad/rewarded
// Check cooldown and daily limits on backend
// Show ad via Cordova AdMob plugin
// Reward user: coins or extra lives
// Track analytics: ad_watched event
```

### **Social Sharing Integration**
```javascript
// Share score: Use Web Share API or fallback to clipboard
// Backend tracks: POST /api/game/share-score  
// Reward user: 15 coins per share
// Analytics tracking: social_share event
```

---

## 📱 **MOBILE DEPLOYMENT CONTRACTS**

### **Cordova Plugin Requirements**
```javascript
// Core plugins needed:
cordova-plugin-device          // Device info
cordova-plugin-statusbar       // Status bar control
cordova-plugin-splashscreen    // Loading screen
cordova-plugin-media          // Audio playback
cordova-plugin-vibration      // Haptic feedback
cordova-plugin-network-information // Offline detection

// Monetization plugins:
cordova-plugin-purchase       // Google Play Billing
cordova-plugin-admob-free    // AdMob integration

// Analytics plugins:
cordova-plugin-firebase-analytics // User behavior tracking
```

### **Platform-Specific Configurations**
```xml
<!-- config.xml settings for optimal game performance -->
<preference name="Orientation" value="portrait" />
<preference name="Fullscreen" value="true" />
<preference name="DisallowOverscroll" value="true" />
<preference name="BackgroundColor" value="#1a1b3a" />
<preference name="SuppressesIncrementalRendering" value="true" />
```

### **Performance Contracts**
```javascript
// Target specifications:
// • 60 FPS on devices with 2GB+ RAM
// • 30 FPS minimum on 1GB RAM devices  
// • <100MB memory usage during gameplay
// • <5% battery drain per 10-minute session
// • <3 second game startup time
```

---

## 🧪 **TESTING CONTRACTS**

### **Frontend Testing Requirements**
```javascript
// Game mechanics testing
✓ All 15 levels playable and balanced
✓ Boss fight mechanics working (3 phases)
✓ Power-up collection and effects
✓ Flutterer abilities functioning correctly
✓ Touch controls responsive on various screen sizes

// UI/UX testing  
✓ Opening screen and tutorial flow
✓ Flutterer selector with all rarities
✓ Settings and volume controls
✓ Game over and restart functionality
✓ Social sharing and monetization UI
```

### **Backend Testing Requirements**
```javascript
// API endpoint testing
✓ User registration and authentication  
✓ Score submission and leaderboard updates
✓ Purchase verification and item unlocking
✓ Daily challenge generation
✓ Analytics event tracking

// Database testing
✓ User data persistence and retrieval
✓ Concurrent user handling
✓ Data migration and backup procedures
```

### **Integration Testing Requirements**
```javascript
// End-to-end scenarios
✓ New user onboarding → tutorial → first game → score submission
✓ Flutterer purchase → unlock → selection → gameplay
✓ Social sharing → coin reward → backend update
✓ Offline play → reconnection → data sync
✓ Cross-device profile synchronization
```

---

## 🔄 **UPDATE DEPLOYMENT CONTRACTS**

### **Modular Update System**
```javascript
// Game content updates (no app store review needed):
• New flutterer skins and abilities
• Level balance adjustments  
• Daily challenge configurations
• Event-based content (seasonal themes)
• Music and audio asset updates

// App updates (requires app store review):
• New core gameplay mechanics
• Additional levels beyond 15
• New game modes (multiplayer)
• Major UI/UX changes
• New monetization features
```

### **Version Management**
```javascript
// Backend API versioning: /api/v1/, /api/v2/
// Client compatibility checks via game config
// Graceful fallbacks for older app versions  
// Forced update mechanism for critical changes
```

---

## 📊 **ANALYTICS INTEGRATION CONTRACTS**

### **Key Events to Track**
```javascript
// Game progression events
game_start(level, flutterer_used)
level_complete(level, score, survival_time)
boss_defeat(attempt_number, flutterer_used)
game_over(level_reached, final_score)

// Monetization events  
purchase_initiated(item_id, price)
purchase_completed(item_id, revenue)
ad_impression(ad_type, placement)
ad_clicked(ad_type, revenue)

// User engagement events
daily_login(consecutive_days)
social_share(platform, score)
flutterer_selected(flutterer_id, rarity)
settings_changed(setting_type, value)
```

### **Performance Metrics**
```javascript
// Technical performance
frame_rate_drop(average_fps, level)
memory_usage(peak_mb, duration)
load_time(screen_type, duration_ms)
crash_report(error_type, stack_trace)

// Business metrics  
user_retention(day_1, day_7, day_30)
session_length(average_minutes)
ltv_cohort(install_date, revenue)
conversion_rate(funnel_step, percentage)
```

---

**🎯 This contracts document ensures seamless integration between all game systems, from frontend gameplay to backend persistence, mobile deployment, and ongoing content updates. Following these contracts guarantees a professional, scalable game ready for millions of players!**