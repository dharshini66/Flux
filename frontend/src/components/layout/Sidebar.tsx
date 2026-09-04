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
      badge:
        summary && summary.meaningful_changes_count > 0
          ? summary.meaningful_changes_count < 10
            ? `0${summary.meaningful_changes_count}`
            : `${summary.meaningful_changes_count}`
          : undefined,
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
      sublabel: `Level ${missionState?.level || 3} Scout`,
      icon: Award,
      badge: `${missionState?.total_xp || 320} XP`,
      badgeColor: 'bg-retropink-500 text-white',
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
        <div className="space-y-2">
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-sm text-left transition-all ${
                  isActive
                    ? 'bg-ivory-50 border-[1.5px] border-ink-900 shadow-[2px_2px_0px_#121212] text-ink-900'
                    : 'text-ink-600 hover:bg-ivory-200/70 hover:text-ink-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-cobalt-600 stroke-[2.2]' : 'text-ink-400'
                    }`}
                  />
                  <div>
                    <span className={`block text-xs font-sans leading-none ${isActive ? 'font-bold text-ink-900' : 'font-semibold text-ink-700'}`}>
                      {item.label}
                    </span>
                    <span className="text-[10px] font-sans text-ink-500 block mt-1">
                      {item.sublabel}
                    </span>
                  </div>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] financial-mono font-bold px-1.5 py-0.5 rounded-xs shrink-0 ${
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

      {/* Footer: Pixel Art Girl & Cat Illustration with Quote */}
      <div className="pt-4 border-t border-ivory-300 space-y-3">
        <div className="bg-ivory-200 border border-editorial-dark rounded-sm p-3 shadow-subtle overflow-hidden relative">
          
          {/* Pixel Art Scene */}
          <div className="relative h-20 w-full bg-ivory-300/60 rounded-xs border border-ivory-300 flex items-end justify-center overflow-hidden">
            <svg
              className="w-full h-full"
              viewBox="0 0 200 80"
              preserveAspectRatio="none"
              shapeRendering="crispEdges"
            >
              {/* Sky Backdrop with subtle stars/pixels */}
              <rect x="0" y="0" width="200" height="80" fill="#EDE8DF" />
              <rect x="25" y="12" width="2" height="2" fill="#E85AA5" />
              <rect x="70" y="8" width="2" height="2" fill="#7561D8" />
              <rect x="145" y="15" width="2" height="2" fill="#1746D1" />
              <rect x="180" y="22" width="2" height="2" fill="#E85AA5" />

              {/* Blossom Branch from top right */}
              <path d="M200 6 Q170 12, 140 8 T120 18" fill="none" stroke="#5C4033" strokeWidth="2" />
              <path d="M160 10 Q145 18, 135 24" fill="none" stroke="#5C4033" strokeWidth="1.5" />
              {/* Pink Blossom Petals */}
              <circle cx="140" cy="8" r="3" fill="#E85AA5" />
              <circle cx="143" cy="6" r="2.5" fill="#F48FB1" />
              <circle cx="120" cy="18" r="3" fill="#E85AA5" />
              <circle cx="135" cy="24" r="2.5" fill="#F48FB1" />
              <circle cx="155" cy="14" r="3" fill="#E85AA5" />
              <circle cx="170" cy="11" r="2.5" fill="#F48FB1" />

              {/* Distant City Skyline Silhouettes */}
              <rect x="15" y="38" width="16" height="26" fill="#D3CCC0" />
              <rect x="35" y="28" width="20" height="36" fill="#C5BDAE" />
              <rect x="60" y="34" width="14" height="30" fill="#D3CCC0" />
              <rect x="78" y="42" width="18" height="22" fill="#C5BDAE" />

              {/* Brick Ledge */}
              <rect x="0" y="64" width="200" height="16" fill="#784E3A" />
              <line x1="0" y1="64" x2="200" y2="64" stroke="#121212" strokeWidth="1" />
              {/* Brick Lines */}
              <line x1="20" y1="64" x2="20" y2="72" stroke="#563524" strokeWidth="1" />
              <line x1="60" y1="64" x2="60" y2="72" stroke="#563524" strokeWidth="1" />
              <line x1="100" y1="64" x2="100" y2="72" stroke="#563524" strokeWidth="1" />
              <line x1="140" y1="64" x2="140" y2="72" stroke="#563524" strokeWidth="1" />
              <line x1="180" y1="64" x2="180" y2="72" stroke="#563524" strokeWidth="1" />
              <line x1="0" y1="72" x2="200" y2="72" stroke="#563524" strokeWidth="1" />
              <line x1="40" y1="72" x2="40" y2="80" stroke="#563524" strokeWidth="1" />
              <line x1="80" y1="72" x2="80" y2="80" stroke="#563524" strokeWidth="1" />
              <line x1="120" y1="72" x2="120" y2="80" stroke="#563524" strokeWidth="1" />
              <line x1="160" y1="72" x2="160" y2="80" stroke="#563524" strokeWidth="1" />

              {/* Pixel Girl Sitting on Ledge */}
              {/* Head / Hair */}
              <rect x="94" y="36" width="10" height="10" fill="#2C1D11" />
              <rect x="96" y="39" width="7" height="6" fill="#FAD0C4" />
              {/* Scarf in soft purple */}
              <rect x="93" y="46" width="12" height="3" fill="#7561D8" />
              {/* Coat in cobalt */}
              <rect x="92" y="49" width="14" height="13" fill="#1746D1" />
              {/* Legs dangling */}
              <rect x="94" y="62" width="3" height="10" fill="#121212" />
              <rect x="100" y="62" width="3" height="9" fill="#121212" />

              {/* Pixel Cat Sitting next to girl */}
              {/* Cat body */}
              <rect x="114" y="52" width="8" height="12" fill="#FAF8F3" stroke="#121212" strokeWidth="0.5" />
              {/* Cat head */}
              <rect x="113" y="46" width="8" height="6" fill="#FAF8F3" stroke="#121212" strokeWidth="0.5" />
              {/* Ears */}
              <polygon points="113,46 115,42 117,46" fill="#E85AA5" />
              <polygon points="118,46 120,42 121,46" fill="#E85AA5" />
              {/* Tail curling */}
              <path d="M122 62 Q126 58, 124 54" fill="none" stroke="#FAF8F3" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Philosophy Quote */}
          <div className="mt-2.5 text-center">
            <p className="text-[11px] font-editorial italic text-ink-800 leading-snug">
              "Same markets. Deeper insights."
            </p>
            <span className="text-[9px] financial-mono text-cobalt-600 font-bold block mt-0.5 tracking-wider">
              — FLUX INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Engine Status Line */}
        <div className="flex items-center justify-between text-[10px] financial-mono text-ink-600 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-green animate-ping"></span>
            <span className="font-bold text-ink-800">ENGINE ONLINE</span>
          </div>
          <span className="text-ink-400">v2.4.0-PROD</span>
        </div>
      </div>
    </aside>
  );
};
