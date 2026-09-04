import React from 'react';
import { useMarket } from '../../context/MarketContext';
import { Sliders, RefreshCw, AlertTriangle, Zap, CheckCircle2, RotateCcw } from 'lucide-react';

export const DemoScenarioBar: React.FC = () => {
  const { activeScenario, switchScenario, performCheckIn, isCheckingIn } = useMarket();

  const scenarios = [
    { id: 'default', label: 'Default: 4 Mixed Signals (INFY, TCS, HDFC, REL)' },
    { id: 'large_surge', label: 'Surge: Critical INFY (+7.3% / 4.2x Vol)' },
    { id: 'market_crash', label: 'Pullback: Banking Drop (-6.4%)' },
    { id: 'stale_data', label: 'Resilience: Stale Data (14m Delay)' },
    { id: 'provider_failure', label: 'Resilience: HDFC Gateway Failure' },
    { id: 'no_signal_quiet', label: 'Empty State: No Meaningful Signal' },
  ];

  return (
    <div className="bg-[#12141A] text-white border-t-2 border-cobalt-500 py-2.5 px-4 sticky bottom-0 z-40 shadow-2xl scanline-bg">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs financial-mono">
        
        {/* Left: Console Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-retropink-500 animate-pulse shadow-[0_0_8px_#E85AA5]"></div>
          <span className="font-extrabold text-retropink-500 uppercase tracking-wider text-[11px]">
            DEV MODE · EVALUATOR CONTROLS
          </span>
          <span className="text-ink-400 hidden sm:inline">|</span>
          <span className="text-ink-400 text-[10.5px] hidden md:inline">
            (Demo Scenarios & Edge Cases):
          </span>
        </div>

        {/* Center: Scenario Switcher Console Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {scenarios.map((sc) => {
            const isActive = activeScenario === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => switchScenario(sc.id)}
                className={`px-2.5 py-1 rounded-xs text-[11px] font-bold uppercase transition-all border ${
                  isActive
                    ? 'bg-cobalt-500 text-white border-cobalt-400 shadow-[1.5px_1.5px_0px_#E85AA5]'
                    : 'bg-[#1C202B] hover:bg-[#252B3A] text-ink-300 border-[#2E3547]'
                }`}
              >
                {sc.id}
              </button>
            );
          })}
        </div>

        {/* Right: Reset Baseline Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => performCheckIn(true)}
            disabled={isCheckingIn}
            title="Reset to fresh baseline snapshot to verify First-Visit empty state"
            className="flex items-center gap-1.5 px-3 py-1 bg-[#1C202B] hover:bg-[#252B3A] text-ivory-200 border border-[#3A4259] hover:border-retropink-500/60 rounded-xs text-[11px] font-bold uppercase transition-all shadow-subtle"
          >
            <RotateCcw className={`w-3 h-3 text-retropink-500 ${isCheckingIn ? 'animate-spin' : ''}`} />
            <span>↺ Reset Baseline</span>
          </button>
        </div>

      </div>
    </div>
  );
};
