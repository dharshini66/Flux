import React from 'react';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { useMarket } from '../../context/MarketContext';

interface StaleDataBannerProps {
  className?: string;
}

export const StaleDataBanner: React.FC<StaleDataBannerProps> = ({ className = '' }) => {
  const { activeScenario, refreshMarketData, isCheckingIn } = useMarket();

  if (activeScenario !== 'stale_data') {
    return null;
  }

  return (
    <div
      className={`bg-[#FFF9EB] dark:bg-[#1E190E] border-2 border-signal-ochre rounded-md p-3 mb-5 flex items-center justify-between shadow-[2px_2px_0px_#C58A1C] dark:shadow-[2px_2px_0px_rgba(0,0,0,0.6)] ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-signal-ochre text-white rounded-sm">
          <Clock className="w-4 h-4 animate-spin" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold financial-mono uppercase text-ink-900 tracking-wider">
              STALE DATA WARNING — DELAYED MARKET FEED
            </span>
            <span className="text-[10px] financial-mono bg-signal-ochre text-white px-1.5 py-0.2 rounded font-bold">
              14 MIN DELAY
            </span>
          </div>
          <p className="text-xs text-ink-600 mt-0.5">
            Upstream exchange feed was last updated 14 minutes ago. Never presenting simulated/stale data as live.
          </p>
        </div>
      </div>
      <button
        onClick={() => refreshMarketData()}
        disabled={isCheckingIn}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs financial-mono font-bold uppercase bg-ivory-100 hover:bg-ivory-50 text-ink-900 border border-ink-900 rounded-sm shadow-[1.5px_1.5px_0px_#121212] transition-all"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isCheckingIn ? 'animate-spin' : ''}`} />
        Poll Stream
      </button>
    </div>
  );
};
