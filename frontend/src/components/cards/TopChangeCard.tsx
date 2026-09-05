import React from 'react';
import { ChangeEvent } from '../../types';
import { SeverityBadge } from '../common/SeverityBadge';
import { SignalStrengthMeter } from '../common/SignalStrengthMeter';
import { Sparkline } from '../common/Sparkline';
import { useMarket } from '../../context/MarketContext';
import { ArrowUpRight, HelpCircle } from 'lucide-react';

interface TopChangeCardProps {
  change: ChangeEvent;
}

export const TopChangeCard: React.FC<TopChangeCardProps> = ({ change }) => {
  const { setSelectedStockSymbol, setSelectedExplainChange } = useMarket();

  const isPositive = change.price_change_pct >= 0;
  const priceDirection = isPositive ? '+' : '';

  return (
    <div className="card-secondary p-4 lg:p-5 flex flex-col justify-between relative overflow-hidden group hover:border-ink-900 transition-all">
      {/* Top Bar: Symbol, Name & Severity */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base financial-mono text-ink-900 tracking-tight">
                {change.symbol}
              </span>
              <SeverityBadge severity={change.severity} />
            </div>
            <span className="text-xs font-sans text-ink-600 block mt-0.5 truncate max-w-[180px]">
              {change.company_name}
            </span>
          </div>

          {/* Sparkline */}
          <div className="text-right">
            <Sparkline isPositive={isPositive} width={64} height={22} />
          </div>
        </div>

        {/* Price Delta and Volume Metric */}
        <div className="flex items-baseline justify-between py-2.5 border-y border-ivory-300 my-2.5">
          <div>
            <span
              className={`text-2xl font-extrabold financial-mono tracking-tight ${
                isPositive ? 'text-signal-green' : 'text-signal-red'
              }`}
            >
              {priceDirection}
              {change.price_change_pct.toFixed(1)}%
            </span>
            <span className="text-[11px] financial-mono text-ink-500 block mt-0.5">
              ₹{change.current_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs financial-mono font-bold text-ink-900 block">
              {change.volume_ratio.toFixed(1)}× Vol
            </span>
            <span className="text-[10px] font-sans text-ink-400">
              vs historical base
            </span>
          </div>
        </div>

        {/* Reason Bullets */}
        <div className="space-y-1.5 my-3">
          {change.summary_bullets.slice(0, 2).map((bullet, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-xs text-ink-700 leading-snug font-sans">
              <span className="text-cobalt-600 font-bold select-none text-[11px] mt-0.5 font-mono">▪</span>
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer: Signal Strength & 'Why does this matter?' Trigger */}
      <div className="pt-3 border-t border-ivory-300 dark:border-[#303746] flex items-center justify-between gap-2 mt-2">
        <SignalStrengthMeter level={change.signal_level} severity={change.severity} showText={false} />

        <div className="flex items-center gap-1.5">
          {/* Why Does This Matter Button */}
          <button
            onClick={() => setSelectedExplainChange(change)}
            className="inline-flex items-center gap-1 text-[11px] font-sans font-medium text-cobalt-600 dark:text-[#6284FF] hover:text-cobalt-800 dark:hover:text-[#93C5FD] bg-cobalt-50 dark:bg-[#1B2338] hover:bg-cobalt-100/80 dark:hover:bg-[#222E4A] border border-cobalt-200/80 dark:border-cobalt-500/30 px-2.5 py-1 rounded-sm transition-colors"
          >
            <HelpCircle className="w-3 h-3 text-cobalt-600 dark:text-[#6284FF]" />
            <span>Why this matters?</span>
          </button>

          {/* Quick Chart Trigger */}
          <button
            onClick={() => setSelectedStockSymbol(change.symbol)}
            title={`View ${change.symbol} chart & session history`}
            className="p-1 bg-ivory-100 dark:bg-[#1B202B] hover:bg-white dark:hover:bg-[#202633] border border-ink-900 dark:border-[#303746] rounded-sm text-ink-900 dark:text-[#F4F1E8] shadow-[1px_1px_0px_#121212] dark:shadow-none transition-all"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
