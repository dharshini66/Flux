import React, { useState, useEffect } from 'react';
import { ChangeEvent } from '../../types';
import { api } from '../../services/api';
import { useMarket } from '../../context/MarketContext';
import { SeverityBadge } from '../common/SeverityBadge';
import { SignalStrengthMeter } from '../common/SignalStrengthMeter';
import { Sparkline } from '../common/Sparkline';
import {
  Activity,
  Filter,
  ArrowUpRight,
  HelpCircle,
  TrendingUp,
  BarChart2,
  Flame,
  Zap,
} from 'lucide-react';

export const ChangesFeedView: React.FC = () => {
  const { setSelectedStockSymbol, setSelectedExplainChange, summary } = useMarket();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [changes, setChanges] = useState<ChangeEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadChanges = async () => {
      try {
        setLoading(true);
        const res = await api.getChangesFeed(filterType);
        setChanges(res.changes);
      } catch (err) {
        console.error('Failed to load changes feed:', err);
      } finally {
        setLoading(false);
      }
    };
    loadChanges();
  }, [filterType, summary]);

  const filterOptions = [
    { id: 'ALL', label: 'All Signals' },
    { id: 'HIGH_IMPACT', label: 'High Impact Only' },
    { id: 'PRICE', label: 'Price Velocity' },
    { id: 'VOLUME', label: 'Unusual Volume' },
    { id: 'VOLATILITY', label: 'Volatility Breaches' },
    { id: 'NEW_52W_HIGH', label: '52-Week High/Low' },
  ];

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ivory-300">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] financial-mono font-bold text-cobalt-500 uppercase tracking-widest">
              INTELLIGENCE LAYER
            </span>
            <span className="text-[9px] financial-mono bg-ivory-300 text-ink-700 px-1.5 py-0.2 rounded font-bold uppercase">
              RANKED BY SIGNIFICANCE
            </span>
          </div>
          <h2 className="editorial-headline text-3xl font-bold text-ink-900 mt-0.5">
            Meaningful Changes Feed
          </h2>
          <p className="text-xs text-ink-600 mt-1 max-w-xl">
            Signals ordered strictly by composite multi-factor mathematical significance
            rather than routine chronological recency.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilterType(opt.id)}
              className={`px-3 py-1 rounded-sm text-xs financial-mono font-bold uppercase transition-all ${
                filterType === opt.id
                  ? 'bg-ink-900 text-white shadow-retro-sm'
                  : 'bg-ivory-100 hover:bg-ivory-50 text-ink-700 border border-ivory-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Changes Feed List */}
      <div className="space-y-3">
        {changes.map((c) => {
          const isPositive = c.price_change_pct >= 0;
          return (
            <div
              key={c.symbol}
              className="retro-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Column: Symbol, Badge, & Headline */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg font-extrabold financial-mono text-ink-900">
                    {c.symbol}
                  </span>
                  <SeverityBadge severity={c.severity} />
                  <span className="text-xs font-semibold text-ink-600">
                    {c.company_name}
                  </span>
                </div>

                <div className="text-sm font-bold text-ink-900 leading-snug">
                  {c.headline}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-700">
                  {c.summary_bullets.map((b, idx) => (
                    <span key={idx} className="flex items-center gap-1">
                      <span className="text-cobalt-500 font-bold">▪</span>
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Price Delta, Score & Triggers */}
              <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-ivory-300">
                {/* Sparkline & Delta */}
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span
                      className={`text-xl font-extrabold financial-mono ${
                        isPositive ? 'text-signal-green' : 'text-signal-red'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {c.price_change_pct.toFixed(1)}%
                    </span>
                    <Sparkline isPositive={isPositive} width={48} height={18} />
                  </div>
                  <span className="text-[11px] financial-mono text-ink-400 block">
                    Score: {c.significance_score.toFixed(2)} / 1.00
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedExplainChange(c)}
                    className="px-3 py-1.5 bg-cobalt-50 hover:bg-cobalt-100 text-cobalt-500 border border-cobalt-100 rounded-sm text-xs financial-mono font-bold uppercase transition-colors"
                  >
                    Why this matters
                  </button>

                  <button
                    onClick={() => setSelectedStockSymbol(c.symbol)}
                    className="p-1.5 bg-ivory-200 hover:bg-ivory-300 border border-ink-900 rounded-sm text-ink-900 shadow-[1px_1px_0px_#121212] transition-all"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {changes.length === 0 && !loading && (
          <div className="bg-ivory-100 border border-editorial rounded-md p-8 text-center my-4">
            <h3 className="editorial-headline text-xl font-bold text-ink-900">
              No matching signals under filter '{filterType}'
            </h3>
            <p className="text-xs text-ink-600 mt-1">
              Select 'All Signals' or adjust your significance filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
