import React, { useState, useEffect } from 'react';
import { CheckCircle2, TrendingUp, TrendingDown, Radio, X, Target, BarChart3, Globe } from 'lucide-react';
import { useMarket } from '../../context/MarketContext';
import { useMission } from '../../context/MissionContext';

export const RightRail: React.FC = () => {
  const { marketStatus } = useMarket();
  const { missionState } = useMission();
  const [showInsightBanner, setShowInsightBanner] = useState<boolean>(true);
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      setTimeStr(
        d.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDateStr(
        d.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Market indices reflecting official session data
  const marketIndices = [
    { name: 'NIFTY 50', value: '24,742.30', change: '+1.2%', positive: true },
    { name: 'SENSEX', value: '81,432.10', change: '+1.1%', positive: true },
    { name: 'NIFTY BANK', value: '51,230.45', change: '-0.3%', positive: false },
    { name: 'USD/INR', value: '83.21', change: '+0.1%', positive: true },
  ];

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-4">
      {/* 1. Market Mission / Analyst Progress Card */}
      <div className="card-secondary p-4 shadow-subtle">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-ivory-300 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base select-none">🎯</span>
            <h3 className="text-xs font-bold financial-mono text-ink-900 uppercase tracking-wider">
              MARKET MISSION
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] financial-mono font-bold px-1.5 py-0.5 bg-softpurple-500 text-white rounded-sm">
              Lv 3
            </span>
            <span className="text-[11px] financial-mono font-bold text-ink-600">
              3 / 3
            </span>
          </div>
        </div>

        {/* Tasks Checklist */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 bg-ivory-50 border border-ivory-300 rounded-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cobalt-600 shrink-0" />
              <span className="text-ink-800 text-[11.5px] font-medium font-sans">
                Review highest price velocity mover
              </span>
            </div>
            <span className="text-[10px] font-bold financial-mono text-retropink-500 shrink-0">
              +10 XP
            </span>
          </div>

          <div className="flex items-center justify-between p-2 bg-ivory-50 border border-ivory-300 rounded-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cobalt-600 shrink-0" />
              <span className="text-ink-800 text-[11.5px] font-medium font-sans">
                Investigate unusual volume surge
              </span>
            </div>
            <span className="text-[10px] font-bold financial-mono text-retropink-500 shrink-0">
              +15 XP
            </span>
          </div>

          <div className="flex items-center justify-between p-2 bg-ivory-50 border border-ivory-300 rounded-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cobalt-600 shrink-0" />
              <span className="text-ink-800 text-[11.5px] font-medium font-sans">
                Confirm 52-week boundary breakout
              </span>
            </div>
            <span className="text-[10px] font-bold financial-mono text-retropink-500 shrink-0">
              +20 XP
            </span>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-3 pt-3 border-t border-ivory-300">
          <div className="flex justify-between text-[10px] financial-mono text-ink-600 font-bold mb-1.5">
            <span>320 / 500 XP</span>
            <span className="text-softpurple-600">64%</span>
          </div>
          <div className="w-full bg-ivory-300 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-softpurple-500 to-retropink-500 rounded-full transition-all duration-500"
              style={{ width: '64%' }}
            ></div>
          </div>
        </div>

        {/* Analytical Guidance Note */}
        <div className="mt-3.5 pt-3 border-t border-ivory-200 flex items-center gap-3">
          <div className="w-8 h-8 bg-ivory-200 border border-ink-900 rounded-sm flex items-center justify-center text-lg shrink-0 shadow-[1px_1px_0px_#121212] select-none">
            🐱
          </div>
          <div className="relative bg-softpurple-50 border border-softpurple-200/80 rounded-sm px-2.5 py-1.5 text-[10.5px] text-softpurple-950 font-sans flex-1 leading-snug shadow-subtle">
            <span className="block font-medium">
              "Focus on volume-confirmed catalysts over routine market chop."
            </span>
          </div>
        </div>
      </div>

      {/* 2. Market Snapshot Card */}
      <div className="card-secondary p-4 shadow-subtle">
        <div className="flex items-center justify-between pb-2.5 border-b border-ivory-300 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm select-none">📊</span>
            <h3 className="text-xs font-bold financial-mono text-ink-900 uppercase tracking-wider">
              MARKET SNAPSHOT
            </h3>
          </div>
          <span className="text-[10px] financial-mono text-ink-500 font-medium">INDEX REVENUE</span>
        </div>

        <div className="divide-y divide-ivory-200">
          {marketIndices.map((idx) => (
            <div key={idx.name} className="py-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-ink-800 text-[11px] font-sans">{idx.name}</span>
              <div className="flex items-center gap-2.5 financial-mono">
                <span className="text-ink-900 font-bold">{idx.value}</span>
                <span
                  className={`text-[10px] font-bold px-1 py-0.5 rounded-xs ${
                    idx.positive ? 'text-signal-green bg-signal-green/10' : 'text-signal-red bg-signal-red/10'
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

        {/* Analytical Breadth Note */}
        {showInsightBanner && (
          <div className="mt-3 p-2 bg-ivory-200/80 border border-ivory-300 rounded-sm flex items-center justify-between text-[10.5px] text-ink-700 font-sans">
            <div className="flex items-center gap-1.5">
              <span className="text-cobalt-600 font-bold font-mono">▪</span>
              <span>Market breadth: Advancers lead 3:1 across benchmark constituents.</span>
            </div>
            <button
              onClick={() => setShowInsightBanner(false)}
              className="text-ink-400 hover:text-ink-700 p-0.5"
              title="Dismiss"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* 3. Market Status Card */}
      <div className="card-secondary p-4 shadow-subtle">
        <div className="flex items-center justify-between pb-2.5 border-b border-ivory-300 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm select-none">🌐</span>
            <h3 className="text-xs font-bold financial-mono text-ink-900 uppercase tracking-wider">
              MARKET STATUS
            </h3>
          </div>
          <span className="text-[9px] financial-mono bg-ivory-300 text-ink-700 px-1.5 py-0.5 rounded uppercase font-bold">
            NSE EQUITIES
          </span>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-ivory-300">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-signal-green animate-pulse"></span>
              <span className="text-xs font-bold text-ink-900 font-sans">Market Open</span>
            </div>
            <span className="text-[10px] financial-mono text-ink-600 block mt-0.5">
              NSE | {dateStr || '04 Sep 2026'} {timeStr || '09:45:00'} IST
            </span>
          </div>
          {/* Pixel Monument / Exchange Icon */}
          <div className="w-8 h-8 bg-ivory-200 border border-ink-900 rounded-sm flex items-center justify-center text-base shadow-[1px_1px_0px_#121212] select-none">
            🏛️
          </div>
        </div>

        {/* Philosophy Quote */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="text-[11px] font-editorial italic text-ink-800 leading-tight">
            "Not just what moved.<br />
            <span className="font-semibold text-ink-900 not-italic font-sans text-[10.5px]">
              Understand why it matters."
            </span>
            <span className="block text-[9px] financial-mono not-italic text-cobalt-600 mt-0.5 font-bold uppercase tracking-wider">
              — FLUX INTELLIGENCE
            </span>
          </div>
          <div className="w-7 h-7 bg-ivory-200 border border-ink-900 rounded-sm flex items-center justify-center text-sm shadow-[1px_1px_0px_#121212] select-none">
            🌱
          </div>
        </div>
      </div>
    </aside>
  );
};
