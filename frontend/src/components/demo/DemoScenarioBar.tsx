import React from 'react';
import { useMarket } from '../../context/MarketContext';
import { RotateCcw } from 'lucide-react';

export const DemoScenarioBar: React.FC = () => {
  const { activeScenario, switchScenario, performCheckIn, isCheckingIn } = useMarket();

  const scenarios = [
    { id: 'default', label: 'DEFAULT' },
    { id: 'large_surge', label: 'LARGE_SURGE' },
    { id: 'market_crash', label: 'MARKET_CRASH' },
    { id: 'stale_data', label: 'STALE_DATA' },
    { id: 'provider_failure', label: 'PROVIDER_FAILURE' },
    { id: 'no_signal_quiet', label: 'NO_SIGNAL_QUIET' },
  ];

  return (
    <div className="bg-[#141822] dark:bg-[#12151C] text-white border-t border-[#252C3D] dark:border-[#232A38] py-2 px-4 sticky bottom-0 z-40 shadow-xl select-none transition-colors">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs financial-mono">
        {/* Left: Console Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-retropink-500 animate-pulse"></div>
          <span className="font-bold text-retropink-400 uppercase tracking-wider text-[10.5px]">
            DEV MODE · EVALUATOR CONTROLS
          </span>
          <span className="text-gray-500 hidden sm:inline">|</span>
          <span className="text-gray-400 dark:text-[#737B8A] text-[10px] hidden md:inline">
            (Demo Scenarios & Edge Cases):
          </span>
        </div>

        {/* Center: Scenario Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {scenarios.map((sc) => {
            const isActive = activeScenario === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => switchScenario(sc.id)}
                className={`px-2.5 py-1 rounded-xs text-[10.5px] font-bold uppercase transition-all border ${
                  isActive
                    ? 'bg-cobalt-600 text-white border-cobalt-400 shadow-[1px_1px_0px_#000]'
                    : 'bg-[#1C212E] dark:bg-[#1B202B] hover:bg-[#262D3D] dark:hover:bg-[#202633] text-gray-300 dark:text-[#A8AFBD] border-[#2C3447] dark:border-[#303746]'
                }`}
              >
                {sc.label}
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
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1C212E] dark:bg-[#1B202B] hover:bg-[#262D3D] dark:hover:bg-[#202633] text-gray-200 dark:text-[#F4F1E8] border border-[#333C52] dark:border-[#303746] hover:border-retropink-500/60 rounded-xs text-[10.5px] font-bold uppercase transition-all shadow-subtle"
          >
            <RotateCcw className={`w-3 h-3 text-retropink-400 ${isCheckingIn ? 'animate-spin' : ''}`} />
            <span>RESET BASELINE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
