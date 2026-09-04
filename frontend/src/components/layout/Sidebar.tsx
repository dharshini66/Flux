import React from 'react';
import {
  LayoutDashboard,
  ListOrdered,
  Activity,
  Award,
  Cpu,
  Bookmark,
  Layers,
} from 'lucide-react';
import { useMarket } from '../../context/MarketContext';
import { useMission } from '../../context/MissionContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { summary } = useMarket();
  const { missionState } = useMission();

  const navItems = [
    {
      id: 'overview',
      label: 'Home',
      sublabel: 'Since Last Visit',
      icon: LayoutDashboard,
      badge: summary && summary.meaningful_changes_count > 0 ? `${summary.meaningful_changes_count}` : undefined,
      badgeColor: 'bg-cobalt-500 text-white',
    },
    {
      id: 'watchlist',
      label: 'Watchlist',
      sublabel: 'Manage & Track',
      icon: ListOrdered,
    },
    {
      id: 'changes',
      label: 'Changes',
      sublabel: 'Ranked Signals',
      icon: Activity,
      badge: summary && summary.meaningful_changes_count > 0 ? 'ALERT' : undefined,
      badgeColor: 'bg-retropink-500 text-white',
    },
    {
      id: 'missions',
      label: 'Market Mission',
      sublabel: `Level ${missionState?.level || 1} Scout`,
      icon: Award,
      badge: `${missionState?.total_xp || 120} XP`,
      badgeColor: 'bg-signal-ochre text-white',
    },
    {
      id: 'engine',
      label: 'Engine Specs',
      sublabel: 'Thresholds & Architecture',
      icon: Cpu,
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-ivory-100 border-r border-ivory-300 min-h-[calc(100vh-57px)] flex flex-col justify-between p-4 hidden md:flex">
      <div>
        {/* Navigation Items */}
        <div className="space-y-1.5">
          <div className="text-[10px] financial-mono font-bold text-ink-400 uppercase tracking-wider px-3 mb-2">
            INTELLIGENCE SYSTEM
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-sm text-left transition-all ${
                  isActive
                    ? 'bg-ivory-200 border-editorial-dark shadow-retro text-ink-900 font-bold'
                    : 'text-ink-600 hover:bg-ivory-50 hover:text-ink-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cobalt-500' : 'text-ink-400'}`} />
                  <div>
                    <span className="block text-xs font-semibold leading-none">{item.label}</span>
                    <span className="text-[10px] financial-mono text-ink-400 block mt-0.5">
                      {item.sublabel}
                    </span>
                  </div>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] financial-mono font-bold px-1.5 py-0.5 rounded-sm ${
                      item.badgeColor || 'bg-ivory-300 text-ink-900'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer System Specs */}
      <div className="pt-4 border-t border-ivory-300">
        <div className="bg-ivory-200 border border-ivory-300 rounded p-3 text-[11px] financial-mono">
          <div className="flex items-center justify-between text-ink-700 font-bold mb-1">
            <span>ENGINE STATUS</span>
            <span className="text-signal-green flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-signal-green animate-ping"></span>
              ACTIVE
            </span>
          </div>
          <p className="text-ink-400 text-[10px] leading-tight">
            Code by Groww 2026 Challenge · Evaluated on 5 Dimensions
          </p>
        </div>
      </div>
    </aside>
  );
};
