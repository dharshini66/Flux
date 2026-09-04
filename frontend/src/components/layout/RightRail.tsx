import React, { useState } from 'react';
import { Sparkles, Trophy, CheckCircle2, TrendingUp, TrendingDown, ArrowUpRight, Radio, X } from 'lucide-react';
import { useMarket } from '../../context/MarketContext';
import { useMission } from '../../context/MissionContext';

export const RightRail: React.FC = () => {
  const { marketStatus } = useMarket();
  const { missionState, claimReward } = useMission();
  const [showQuoteBanner, setShowQuoteBanner] = useState<boolean>(true);

  // Market indices mock data reflecting the live screenshot
  const marketIndices = [
    { name: 'NIFTY 50', value: '24,742.30', change: '+1.2%', positive: true, points: [20, 24, 22, 28, 32, 35, 40] },
    { name: 'SENSEX', value: '81,432.10', change: '+1.1%', positive: true, points: [18, 20, 25, 24, 30, 36, 38] },
    { name: 'NIFTY BANK', value: '51,230.45', change: '-0.3%', positive: false, points: [35, 34, 30, 28, 26, 24, 22] },
    { name: 'USD/INR', value: '83.21', change: '+0.1%', positive: true, points: [10, 11, 11, 12, 12, 13, 13] },
  ];

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-4">
      
      {/* 1. Market Mission Card */}
      <div className="bg-ivory-100 border border-editorial-dark rounded-md p-4 shadow-retro">
        
        {/* Card Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-ivory-300 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🎮</span>
            <h3 className="text-xs font-extrabold financial-mono text-ink-900 uppercase tracking-wider">
              MARKET MISSION
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] financial-mono font-extrabold px-1.5 py-0.5 bg-softpurple-500 text-white rounded-sm">
              Lv 3
            </span>
            <span className="text-[11px] financial-mono font-bold text-ink-600">
              3 / 3
            </span>
          </div>
        </div>

        {/* Tasks Checklist */}
        <div className="space-y-2 text-xs financial-mono">
          <div className="flex items-center justify-between p-1.5 bg-ivory-50 border border-ivory-300 rounded-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cobalt-600" />
              <span className="text-ink-800 text-[11px] font-medium">Review your biggest mover</span>
            </div>
            <span className="text-[10px] font-bold text-retropink-500">+10 XP</span>
          </div>

          <div className="flex items-center justify-between p-1.5 bg-ivory-50 border border-ivory-300 rounded-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cobalt-600" />
              <span className="text-ink-800 text-[11px] font-medium">Investigate unusual volume</span>
            </div>
            <span className="text-[10px] font-bold text-retropink-500">+15 XP</span>
          </div>

          <div className="flex items-center justify-between p-1.5 bg-ivory-50 border border-ivory-300 rounded-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cobalt-600" />
              <span className="text-ink-800 text-[11px] font-medium">Check a new 52W high</span>
            </div>
            <span className="text-[10px] font-bold text-retropink-500">+20 XP</span>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-3 pt-3 border-t border-ivory-300">
          <div className="flex justify-between text-[10px] financial-mono text-ink-600 font-bold mb-1">
            <span>320 / 500 XP</span>
            <span className="text-softpurple-600">64%</span>
          </div>
          <div className="w-full bg-ivory-300 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-softpurple-500 to-retropink-500 rounded-full"
              style={{ width: '64%' }}
            ></div>
          </div>
        </div>

        {/* Pixel Cat Mascot & Speech Bubble */}
        <div className="mt-3.5 pt-3 border-t border-ivory-200 flex items-center gap-3">
          <div className="w-9 h-9 bg-ivory-200 border border-ink-900 rounded-sm flex items-center justify-center text-xl shrink-0 shadow-[1px_1px_0px_#121212]">
            🐱
          </div>
          <div className="relative bg-softpurple-50 border border-softpurple-200 rounded-sm px-2.5 py-1.5 text-[10px] text-softpurple-900 financial-mono flex-1 leading-snug shadow-subtle">
            <span className="block font-medium">"Small steps. Brighter decisions."</span>
          </div>
        </div>

      </div>

      {/* 2. Market Snapshot Card */}
      <div className="bg-ivory-100 border border-editorial-dark rounded-md p-4 shadow-retro">
        
        <div className="flex items-center gap-2 pb-2.5 border-b border-ivory-300 mb-2">
          <span className="text-sm">📊</span>
          <h3 className="text-xs font-extrabold financial-mono text-ink-900 uppercase tracking-wider">
            MARKET SNAPSHOT
          </h3>
        </div>

        <div className="divide-y divide-ivory-200">
          {marketIndices.map((idx) => (
            <div key={idx.name} className="py-2 flex items-center justify-between text-xs financial-mono">
              <span className="font-bold text-ink-800 text-[11px]">{idx.name}</span>
              <div className="flex items-center gap-2.5">
                <span className="text-ink-900 font-bold">{idx.value}</span>
                <span
                  className={`text-[10px] font-bold px-1 py-0.5 rounded-xs ${
                    idx.positive ? 'text-signal-green' : 'text-signal-red'
                  }`}
                >
                  {idx.change}
                </span>
                {/* Micro SVG Sparkline */}
                <svg className="w-10 h-4" viewBox="0 0 50 20">
                  <path
                    d={
                      idx.positive
                        ? 'M 2 15 Q 12 18, 20 12 T 35 8 L 48 4'
                        : 'M 2 4 Q 15 6, 25 12 T 38 16 L 48 18'
                    }
                    fill="none"
                    stroke={idx.positive ? '#176B52' : '#D94336'}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Small Quote Pill */}
        {showQuoteBanner && (
          <div className="mt-3 p-2 bg-softpurple-50 border border-softpurple-200 rounded-sm flex items-center justify-between text-[10px] financial-mono text-softpurple-900">
            <div className="flex items-center gap-1.5">
              <span>🍸</span>
              <span>Information is a superpower.</span>
            </div>
            <button
              onClick={() => setShowQuoteBanner(false)}
              className="text-softpurple-400 hover:text-softpurple-700"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

      </div>

      {/* 3. Market Status Card */}
      <div className="bg-ivory-100 border border-editorial-dark rounded-md p-4 shadow-retro">
        
        <div className="flex items-center gap-2 pb-2.5 border-b border-ivory-300 mb-2.5">
          <span className="text-sm">🌐</span>
          <h3 className="text-xs font-extrabold financial-mono text-ink-900 uppercase tracking-wider">
            MARKET STATUS
          </h3>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-ivory-300">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-signal-green animate-pulse"></span>
              <span className="text-xs font-bold text-ink-900 financial-mono">Market Open</span>
            </div>
            <span className="text-[10px] financial-mono text-ink-500 block mt-0.5">
              NSE | 04 Sep 2026 09:24:18 IST
            </span>
          </div>
          {/* Pixel Monument / Exchange Icon */}
          <div className="w-8 h-8 bg-ivory-200 border border-ink-900 rounded-sm flex items-center justify-center text-base shadow-[1px_1px_0px_#121212]">
            🏛️
          </div>
        </div>

        {/* Philosophy Quote */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="text-[10.5px] font-editorial italic text-ink-700 leading-tight">
            "Not just what moved.<br />
            <span className="font-bold text-ink-900 not-italic font-mono text-[10px]">But why it matters."</span>
            <span className="block text-[9px] financial-mono not-italic text-cobalt-600 mt-0.5">— FLUX</span>
          </div>
          <div className="w-7 h-7 bg-ivory-200 border border-ink-900 rounded-sm flex items-center justify-center text-sm shadow-[1px_1px_0px_#121212]">
            🌱
          </div>
        </div>

      </div>

    </aside>
  );
};
