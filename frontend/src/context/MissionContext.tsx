import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MissionState } from '../types';
import { api } from '../services/api';

interface MissionContextType {
  missionState: MissionState | null;
  loading: boolean;
  claimReward: (missionId: string, xp: number) => Promise<void>;
  refreshMissions: () => Promise<void>;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const MissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [missionState, setMissionState] = useState<MissionState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshMissions = useCallback(async () => {
    try {
      const data = await api.getMissions();
      setMissionState(data);
    } catch (err) {
      console.error('Failed to load missions state:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMissions();
  }, [refreshMissions]);

  const claimReward = async (missionId: string, xp: number) => {
    try {
      const updated = await api.claimMission(missionId, xp);
      setMissionState(updated);
    } catch (err) {
      console.error('Failed to claim mission XP:', err);
    }
  };

  return (
    <MissionContext.Provider value={{ missionState, loading, claimReward, refreshMissions }}>
      {children}
    </MissionContext.Provider>
  );
};

export const useMission = () => {
  const context = useContext(MissionContext);
  if (!context) throw new Error('useMission must be used within a MissionProvider');
  return context;
};
