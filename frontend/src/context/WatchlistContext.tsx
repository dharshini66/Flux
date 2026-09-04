import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Watchlist } from '../types';
import { api } from '../services/api';

interface WatchlistContextType {
  watchlists: Watchlist[];
  activeWatchlist: Watchlist | null;
  loading: boolean;
  setActiveWatchlistId: (id: string) => void;
  refreshWatchlists: () => Promise<void>;
  createWatchlist: (name: string, description?: string) => Promise<void>;
  addStock: (watchlistId: string, symbol: string, isPriority?: boolean) => Promise<void>;
  removeStock: (watchlistId: string, symbol: string) => Promise<void>;
  togglePriority: (watchlistId: string, symbol: string) => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [activeWatchlistId, setActiveWatchlistId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshWatchlists = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getWatchlists();
      setWatchlists(data);
      if (data.length > 0 && (!activeWatchlistId || !data.some((w) => w.id === activeWatchlistId))) {
        setActiveWatchlistId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load watchlists:', err);
    } finally {
      setLoading(false);
    }
  }, [activeWatchlistId]);

  useEffect(() => {
    refreshWatchlists();
  }, [refreshWatchlists]);

  const activeWatchlist = watchlists.find((w) => w.id === activeWatchlistId) || watchlists[0] || null;

  const createWatchlist = async (name: string, description?: string) => {
    await api.createWatchlist(name, description);
    await refreshWatchlists();
  };

  const addStock = async (watchlistId: string, symbol: string, isPriority: boolean = false) => {
    await api.addStockToWatchlist(watchlistId, symbol, isPriority);
    await refreshWatchlists();
  };

  const removeStock = async (watchlistId: string, symbol: string) => {
    await api.removeStockFromWatchlist(watchlistId, symbol);
    await refreshWatchlists();
  };

  const togglePriority = async (watchlistId: string, symbol: string) => {
    await api.togglePriorityStock(watchlistId, symbol);
    await refreshWatchlists();
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlists,
        activeWatchlist,
        loading,
        setActiveWatchlistId,
        refreshWatchlists,
        createWatchlist,
        addStock,
        removeStock,
        togglePriority,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error('useWatchlist must be used within a WatchlistProvider');
  return context;
};
