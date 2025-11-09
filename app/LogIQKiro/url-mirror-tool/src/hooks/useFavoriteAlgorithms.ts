import { useState, useEffect } from 'react';

const FAVORITES_STORAGE_KEY = 'logiq-favorite-algorithms';

export const useFavoriteAlgorithms = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Failed to load favorite algorithms:', error);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorite algorithms:', error);
    }
  }, [favorites]);

  const addToFavorites = (algorithmId: string) => {
    setFavorites(prev => {
      if (!prev.includes(algorithmId)) {
        return [...prev, algorithmId];
      }
      return prev;
    });
  };

  const removeFromFavorites = (algorithmId: string) => {
    setFavorites(prev => prev.filter(id => id !== algorithmId));
  };

  const toggleFavorite = (algorithmId: string) => {
    if (favorites.includes(algorithmId)) {
      removeFromFavorites(algorithmId);
    } else {
      addToFavorites(algorithmId);
    }
  };

  const isFavorite = (algorithmId: string) => {
    return favorites.includes(algorithmId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };
};