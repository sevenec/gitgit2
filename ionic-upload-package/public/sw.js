const CACHE_NAME = 'butterfly-nebula-brawl-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const AUDIO_CACHE = 'audio-v1.0.0';
const RUNTIME_CACHE = 'runtime-v1.0.0';

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/main.js',
  '/game/GameEngine.js',
  '/game/GameRenderer.js',
  '/game/AudioManager.js',
  '/manifest.json'
];

// Audio files to cache (your music tracks)
const AUDIO_ASSETS = [
  '/sounds/intro-cinematic-battle-score.mp3',
  '/sounds/level1-space-epic-cinematic.mp3',
  '/sounds/level2-traveling-through-space.mp3',
  '/sounds/level3-lost-in-space.mp3',
  '/sounds/level4-space-music.mp3',
  '/sounds/level5-space-clouds-velvet.mp3',
  '/sounds/level6-space-travel.mp3',
  '/sounds/level7-space-flight.mp3',
  '/sounds/level8-calm-space-music.mp3',
  '/sounds/level9-ambient-space-arpeggio.mp3',
  '/sounds/level10-space-ambient.mp3',
  '/sounds/level11-epic-cinematic-battle.mp3',
  '/sounds/level12-glorious-army-battle.mp3',
  '/sounds/level13-war-battle-military.mp3',
  '/sounds/level14-z-battle-finale.mp3'
];

// Install event - cache critical assets
self.addEventListener('install', event => {
  console.log('🚀 Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then(cache => {
        console.log('📦 Caching static assets...');
        return cache.addAll(PRECACHE_ASSETS);
      }),
      // Cache audio assets (progressive)
      caches.open(AUDIO_CACHE).then(cache => {
        console.log('🎵 Caching audio assets...');
        // Cache first few tracks immediately for faster startup
        const priorityAudio = AUDIO_ASSETS.slice(0, 5);
        return cache.addAll(priorityAudio);
      })
    ])
  );
  
  // Skip waiting and activate immediately
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('✅ Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== AUDIO_CACHE && 
              cacheName !== RUNTIME_CACHE) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all pages immediately
  return self.clients.claim();
});

// Fetch event - serve from cache with intelligent strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) return;
  
  // API requests - Network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }
  
  // Audio files - Cache first, network fallback
  if (request.url.includes('/sounds/') && request.url.endsWith('.mp3')) {
    event.respondWith(audioStrategy(request));
    return;
  }
  
  // Static assets - Cache first, network fallback
  if (request.destination === 'script' || 
      request.destination === 'style' ||
      request.destination === 'document') {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }
  
  // Default - Network first
  event.respondWith(networkFirstStrategy(request));
});

// Cache-first strategy (for static assets)
async function cacheFirstStrategy(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Update cache in background
      fetchAndCache(request, cache);
      return cachedResponse;
    }
    
    // Not in cache, fetch from network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
    
  } catch (error) {
    console.warn('Cache-first strategy failed:', error);
    return new Response('Offline - Asset not available', { status: 503 });
  }
}

// Network-first strategy (for API calls)
async function networkFirstStrategy(request) {
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    
    // Try network first
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (networkError) {
      // Network failed, try cache
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      throw networkError;
    }
    
  } catch (error) {
    console.warn('Network-first strategy failed:', error);
    return new Response('Offline - Network unavailable', { status: 503 });
  }
}

// Audio strategy (optimized for music files)
async function audioStrategy(request) {
  try {
    const cache = await caches.open(AUDIO_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Not cached, fetch and cache
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache audio files for offline play
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
    
  } catch (error) {
    console.warn('Audio strategy failed:', error);
    return new Response('Audio unavailable offline', { status: 503 });
  }
}

// Background cache update
async function fetchAndCache(request, cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response);
    }
  } catch (error) {
    console.warn('Background cache update failed:', error);
  }
}

// Progressive audio caching
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CACHE_AUDIO') {
    event.waitUntil(cacheRemainingAudio());
  }
});

async function cacheRemainingAudio() {
  try {
    const cache = await caches.open(AUDIO_CACHE);
    const remainingAudio = AUDIO_ASSETS.slice(5); // Skip already cached
    
    for (const audioUrl of remainingAudio) {
      try {
        const response = await fetch(audioUrl);
        if (response.ok) {
          await cache.put(audioUrl, response);
          console.log('🎵 Cached:', audioUrl);
        }
      } catch (error) {
        console.warn('Failed to cache audio:', audioUrl, error);
      }
    }
    
    console.log('🎵 All audio assets cached for offline play!');
  } catch (error) {
    console.warn('Progressive audio caching failed:', error);
  }
}