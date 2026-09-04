import React from 'react';
import { ChangeEvent } from '../../types';
import { SeverityBadge } from '../common/SeverityBadge';
import { SignalStrengthMeter } from '../common/SignalStrengthMeter';
import { Sparkline } from '../common/Sparkline';
import { useMarket } from '../../context/MarketContext';
import { ArrowUpRight, HelpCircle, Flame, TrendingUp, TrendingDown, Layers } from 'lucide-react';

interface TopChangeCardProps {
  change: ChangeEvent;
}

export const TopChangeCard: React.FC<TopChangeCardProps> = ({ change }) => {
  const { setSelectedStockSymbol, setSelectedExplainChange } = useMarket();

  const isPositive = change.price_change_pct >= 0;
  const priceDirection = isPositive ? '+' : '';

  return (
    <div className="retro-card p-5 flex flex-col justify-between relative overflow-hidden group">
      {/* Top Bar: Symbol, Name & Severity */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base financial-mono text-ink-900 tracking-tight">
                {change.symbol}
              </span>
              <SeverityBadge severity={change.severity} />
            </div>
            <span className="text-xs text-ink-600 block mt-0.5 truncate max-w-[180px]">
              {change.company_name}
            </span>
          </div>

          {/* Sparkline */}
          <div className="text-right">
            <Sparkline isPositive={isPositive} width={64} height={22} />
          </div>
        </div>

        {/* Price Delta and Volume Metric */}
        <div className="flex items-baseline justify-between py-2 border-y border-ivory-300 my-2">
          <div>
            <span
              className={`text-2xl font-extrabold financial-mono tracking-tight ${
                isPositive ? 'text-signal-green' : 'text-signal-red'
              }`}
            >
              {priceDirection}
              {change.price_change_pct.toFixed(1)}%
            </span>
            <span className="text-[11px] financial-mono text-ink-400 block">
              ₹{change.current_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs financial-mono font-bold text-ink-900 block">
              {change.volume_ratio.toFixed(1)}× Vol
            </span>
            <span className="text-[10px] financial-mono text-ink-400">
              vs historical base
            </span>
          </div>
        </div>

        {/* Reason Bullets */}
        <div className="space-y-1 my-3">
          {change.summary_bullets.slice(0, 2).map((bullet, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-xs text-ink-700 leading-snug">
              <span className="text-cobalt-500 font-bold select-none text-[11px] mt-0.5">▪</span>
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer: Signal Strength & 'Why does this matter?' Trigger */}
      <div className="pt-3 border-t border-ivory-300 flex items-center justify-between gap-2 mt-2">
        <SignalStrengthMeter level={change.signal_level} severity={change.severity} showText={false} />

        <div className="flex items-center gap-2">
          {/* Why Does This Matter Button */}
          <button
            onClick={() => setSelectedExplainChange(change)}
            className="inline-flex items-center gap-1 text-[11px] financial-mono font-bold text-cobalt-500 hover:text-cobalt-700 bg-cobalt-50 hover:bg-cobalt-100 border border-cobalt-100 px-2 py-1 rounded-sm transition-colors"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Why this matters?</span>
          </button>

          {/* Quick Chart Trigger */}
          <button
            onClick={() => setSelectedStockSymbol(change.symbol)}
            title={`View ${change.symbol} chart & session history`}
            className="p-1 bg-ivory-200 hover:bg-ivory-300 border border-ink-900 rounded-sm text-ink-900 shadow-[1px_1px_0px_#121212] transition-all"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
