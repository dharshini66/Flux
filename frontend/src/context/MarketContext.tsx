import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ChangeSummary, ChangeEvent, MarketPulseEvent } from '../types';
import { api } from '../services/api';

interface MarketContextType {
  summary: ChangeSummary | null;
  pulseEvents: MarketPulseEvent[];
  marketStatus: {
    status: string;
    exchange: string;
    current_time: string;
    is_trading_active: boolean;
  } | null;
  activeScenario: string;
  isCheckingIn: boolean;
  selectedStockSymbol: string | null;
  selectedExplainChange: ChangeEvent | null;
  setSelectedStockSymbol: (sym: string | null) => void;
  setSelectedExplainChange: (change: ChangeEvent | null) => void;
  refreshMarketData: () => Promise<void>;
  performCheckIn: (forceNewBaseline?: boolean) => Promise<void>;
  switchScenario: (scenario: string) => Promise<void>;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [summary, setSummary] = useState<ChangeSummary | null>(null);
  const [pulseEvents, setPulseEvents] = useState<MarketPulseEvent[]>([]);
  const [marketStatus, setMarketStatus] = useState<any>(null);
  const [activeScenario, setActiveScenario] = useState<string>('default');
  const [isCheckingIn, setIsCheckingIn] = useState<boolean>(false);
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string | null>(null);
  const [selectedExplainChange, setSelectedExplainChange] = useState<ChangeEvent | null>(null);

  const refreshMarketData = useCallback(async () => {
    try {
      const [sum, pulse, status] = await Promise.all([
        api.getChangesSummary(),
        api.getMarketPulse(),
        api.getMarketStatus(),
      ]);
      setSummary(sum);
      setPulseEvents(pulse.events);
      setMarketStatus(status);
    } catch (err) {
      console.error('Error fetching market summary & pulse:', err);
    }
  }, []);

  useEffect(() => {
    refreshMarketData();
  }, [refreshMarketData]);

  const performCheckIn = async (forceNewBaseline: boolean = false) => {
    setIsCheckingIn(true);
    try {
      await api.performCheckIn('Manual Check-in', forceNewBaseline);
      await refreshMarketData();
    } catch (err) {
      console.error('Failed to perform check-in snapshot:', err);
    } finally {
      setIsCheckingIn(false);
    }
  };

  const switchScenario = async (scenario: string) => {
    try {
      await api.switchScenario(scenario);
      setActiveScenario(scenario);
      await refreshMarketData();
    } catch (err) {
      console.error('Failed to switch scenario:', err);
    }
  };

  return (
    <MarketContext.Provider
      value={{
        summary,
        pulseEvents,
        marketStatus,
        activeScenario,
        isCheckingIn,
        selectedStockSymbol,
        selectedExplainChange,
        setSelectedStockSymbol,
        setSelectedExplainChange,
        refreshMarketData,
        performCheckIn,
        switchScenario,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) throw new Error('useMarket must be used within a MarketProvider');
  return context;
};
