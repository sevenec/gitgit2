import { useState, useEffect, useCallback } from 'react';
import { userAPI, storage, getCurrentPlatform } from '../services/api';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize user on mount
  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check for existing user in localStorage
      const existingUser = storage.getUser();
      
      if (existingUser && existingUser.user_id) {
        try {
          // Fetch fresh user data from server
          const freshUserData = await userAPI.getUser(existingUser.user_id);
          setUser(freshUserData);
          storage.setUser(freshUserData);
        } catch (err) {
          console.warn('Failed to fetch fresh user data, using cached data:', err);
          setUser(existingUser);
        }
      } else {
        // Register new user
        await registerNewUser();
      }
    } catch (err) {
      console.error('Failed to initialize user:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const registerNewUser = async () => {
    const deviceId = storage.getDeviceId();
    const platform = getCurrentPlatform();
    
    // Generate a random username
    const randomNum = Math.floor(Math.random() * 9999);
    const username = `CosmicPlayer${randomNum}`;

    const userData = {
      username,
      device_id: deviceId,
      platform,
      email: null
    };

    try {
      const newUser = await userAPI.register(userData);
      setUser(newUser);
      storage.setUser(newUser);
    } catch (err) {
      throw new Error(`Registration failed: ${err.message}`);
    }
  };

  const updateUser = useCallback(async (updateData) => {
    if (!user?.user_id) return;

    try {
      const updatedUser = await userAPI.updateUser(user.user_id, updateData);
      setUser(updatedUser);
      storage.setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error('Failed to update user:', err);
      throw err;
    }
  }, [user]);

  const submitScore = useCallback(async (scoreData) => {
    if (!user?.user_id) return;

    try {
      const result = await userAPI.submitScore(user.user_id, {
        ...scoreData,
        user_id: user.user_id
      });
      
      // Refresh user data to get updated stats and coins
      const freshUserData = await userAPI.getUser(user.user_id);
      setUser(freshUserData);
      storage.setUser(freshUserData);
      
      return result;
    } catch (err) {
      console.error('Failed to submit score:', err);
      throw err;
    }
  }, [user]);

  const unlockFlutterer = useCallback(async (fluttererId) => {
    if (!user?.user_id) return;

    try {
      const result = await userAPI.unlockFlutterer(user.user_id, fluttererId);
      
      // Refresh user data
      const freshUserData = await userAPI.getUser(user.user_id);
      setUser(freshUserData);
      storage.setUser(freshUserData);
      
      return result;
    } catch (err) {
      console.error('Failed to unlock flutterer:', err);
      throw err;
    }
  }, [user]);

  const selectFlutterer = useCallback(async (fluttererId) => {
    if (!user?.user_id) return;

    try {
      const updatedUser = await updateUser({ selected_flutterer: fluttererId });
      return updatedUser;
    } catch (err) {
      console.error('Failed to select flutterer:', err);
      throw err;
    }
  }, [updateUser]);

  const getLeaderboard = useCallback(async (limit = 50) => {
    if (!user?.user_id) return [];

    try {
      return await userAPI.getLeaderboard(user.user_id, limit);
    } catch (err) {
      console.error('Failed to get leaderboard:', err);
      return [];
    }
  }, [user]);

  const getDailyChallenges = useCallback(async () => {
    if (!user?.user_id) return [];

    try {
      return await userAPI.getDailyChallenges(user.user_id);
    } catch (err) {
      console.error('Failed to get daily challenges:', err);
      return [];
    }
  }, [user]);

  const refreshUser = useCallback(async () => {
    if (!user?.user_id) return;

    try {
      const freshUserData = await userAPI.getUser(user.user_id);
      setUser(freshUserData);
      storage.setUser(freshUserData);
      return freshUserData;
    } catch (err) {
      console.error('Failed to refresh user:', err);
      throw err;
    }
  }, [user]);

  return {
    user,
    loading,
    error,
    updateUser,
    submitScore,
    unlockFlutterer,
    selectFlutterer,
    getLeaderboard,
    getDailyChallenges,
    refreshUser,
    registerNewUser
  };
};