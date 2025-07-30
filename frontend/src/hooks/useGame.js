import { useState, useEffect, useCallback } from 'react';
import { gameAPI } from '../services/api';

export const useGame = () => {
  const [gameConfig, setGameConfig] = useState(null);
  const [flutterers, setFlutterers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load game data on mount
  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load game config
      const config = await gameAPI.getConfig();
      setGameConfig(config);

      // Load flutterer catalog
      const fluttererData = await gameAPI.getFlutterers();
      setFlutterers(fluttererData.flutterers || []);

      // Load active events
      const activeEvents = await gameAPI.getEvents();
      setEvents(activeEvents);

    } catch (err) {
      console.error('Failed to load game data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const watchRewardedAd = useCallback(async (userId, adType = 'coins') => {
    try {
      const result = await gameAPI.watchRewardedAd(userId, adType);
      return result;
    } catch (err) {
      console.error('Failed to process rewarded ad:', err);
      throw err;
    }
  }, []);

  const shareScore = useCallback(async (userId, score, platform = 'web') => {
    try {
      const result = await gameAPI.shareScore(userId, score, platform);
      return result;
    } catch (err) {
      console.error('Failed to share score:', err);
      throw err;
    }
  }, []);

  const verifyPurchase = useCallback(async (purchaseData) => {
    try {
      const result = await gameAPI.verifyPurchase(purchaseData);
      return result;
    } catch (err) {
      console.error('Failed to verify purchase:', err);
      throw err;
    }
  }, []);

  const trackEvent = useCallback(async (eventType, eventData, userId, sessionId) => {
    try {
      const analyticsData = {
        user_id: userId,
        event_type: eventType,
        event_data: eventData,
        session_id: sessionId,
        timestamp: new Date().toISOString(),
        platform: 'web',
        app_version: '1.0.0'
      };
      
      await gameAPI.trackAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to track event:', err);
      // Don't throw - analytics failures shouldn't break the game
    }
  }, []);

  const getFluttererById = useCallback((id) => {
    return flutterers.find(f => f.id === id);
  }, [flutterers]);

  const getFlutterersByRarity = useCallback((rarity) => {
    return flutterers.filter(f => f.rarity === rarity);
  }, [flutterers]);

  const checkUnlockCondition = useCallback((flutterer, gameStats) => {
    if (!flutterer || !gameStats) return false;
    
    const condition = flutterer.unlock_condition;
    
    switch (condition) {
      case 'starter': return true;
      case 'score_5000': return gameStats.high_score >= 5000;
      case 'score_25000': return gameStats.high_score >= 25000;
      case 'level_5': return gameStats.max_level >= 5;
      case 'level_10': return gameStats.max_level >= 10;
      case 'defeat_100_enemies': return gameStats.enemies_defeated >= 100;
      case 'survive_300_seconds': return gameStats.total_survival_time >= 300;
      case 'defeat_boss_3_times': return gameStats.boss_defeats >= 3;
      case 'complete_all_levels': return gameStats.max_level >= 15;
      default: return false;
    }
  }, []);

  return {
    gameConfig,
    flutterers,
    events,
    loading,
    error,
    watchRewardedAd,
    shareScore,
    verifyPurchase,
    trackEvent,
    getFluttererById,
    getFlutterersByRarity,
    checkUnlockCondition,
    refreshGameData: loadGameData
  };
};