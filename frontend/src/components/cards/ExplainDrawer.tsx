import React, { useState, useEffect } from 'react';
import { useMarket } from '../../context/MarketContext';
import { api } from '../../services/api';
import { ExplainResponse } from '../../types';
import { X, HelpCircle, ArrowUpRight, Cpu, Layers, CheckCircle2 } from 'lucide-react';
import { SeverityBadge } from '../common/SeverityBadge';
import { SignalStrengthMeter } from '../common/SignalStrengthMeter';

export const ExplainDrawer: React.FC = () => {
  const { selectedExplainChange, setSelectedExplainChange, setSelectedStockSymbol } = useMarket();
  const [data, setData] = useState<ExplainResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!selectedExplainChange) return;

    const loadExplain = async () => {
      try {
        setLoading(true);
        const fb = selectedExplainChange.factor_breakdown;
        const res = await api.explainChange({
          symbol: selectedExplainChange.symbol,
          previous_price: selectedExplainChange.previous_baseline_price,
          current_price: selectedExplainChange.current_price,
          current_volume: (selectedExplainChange.volume_ratio || 1.0) * 5_000_000,
          typical_volume: 5_000_000,
        });
        setData(res);
      } catch (err) {
        console.error('Failed to load explain data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadExplain();
  }, [selectedExplainChange]);

  if (!selectedExplainChange) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-ivory-100 border border-editorial-dark rounded-md w-full max-w-2xl shadow-retro-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-start justify-between p-5 bg-ivory-200 border-b border-ivory-300">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] financial-mono font-bold text-cobalt-500 uppercase tracking-wider block">
                FLUX TRANSPARENCY & DIAGNOSTICS
              </span>
              <SeverityBadge severity={selectedExplainChange.severity} />
            </div>
            <h3 className="editorial-headline text-2xl font-bold text-ink-900 mt-1">
              Why does {selectedExplainChange.symbol} matter right now?
            </h3>
            <span className="text-xs text-ink-600 block">
              {selectedExplainChange.company_name} · Score: {selectedExplainChange.significance_score.toFixed(2)} / 1.00
            </span>
          </div>

          <button
            onClick={() => setSelectedExplainChange(null)}
            className="p-1 hover:bg-ivory-300 text-ink-900 rounded-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Plain Language Editorial Synthesis */}
          <div className="bg-ivory-50 border border-ivory-300 rounded-sm p-4 shadow-subtle">
            <span className="text-[10px] financial-mono font-bold text-cobalt-500 uppercase tracking-wider block mb-1">
              EDITORIAL SYNTHESIS
            </span>
            <p className="text-sm text-ink-900 leading-relaxed">
              {selectedExplainChange.plain_language_explanation}
            </p>
          </div>

          {/* Key Signal Takeaways */}
          <div>
            <span className="text-[11px] financial-mono font-bold text-ink-900 uppercase tracking-wider block mb-2">
              DETECTED CATALYSTS & REASONS
            </span>
            <div className="space-y-2">
              {selectedExplainChange.summary_bullets.map((bullet, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 bg-ivory-200 border border-ivory-300 rounded-sm text-xs text-ink-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-signal-green shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Factor Decomposition Grid */}
          {data && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] financial-mono font-bold text-ink-900 uppercase tracking-wider">
                  MATHEMATICAL FACTOR ATTRIBUTION
                </span>
                <span className="text-[10px] financial-mono text-ink-500">
                  Formula: 0.35P + 0.25V + 0.15σ + 0.15L + 0.10C
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {data.factor_cards.map((fc, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-ivory-50 border border-ivory-300 rounded-sm space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold financial-mono text-ink-900">{fc.factor}</span>
                      <span className="font-bold financial-mono text-cobalt-500">
                        +{fc.score_allocated.toFixed(2)} pts
                      </span>
                    </div>
                    <div className="text-[11px] financial-mono text-retropink-500 font-semibold">
                      Metric: {fc.raw_metric}
                    </div>
                    <p className="text-[10px] text-ink-600 leading-snug">{fc.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Non-Recommendation Disclaimer */}
          <div className="p-3 bg-ivory-200 border border-editorial rounded-sm text-[11px] text-ink-500 financial-mono">
            <strong>NOTICE:</strong> FLUX computes market significance metrics purely for informational and
            filtering purposes. This does not constitute a buy/sell recommendation or financial advice.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-ivory-200 border-t border-ivory-300 flex items-center justify-between">
          <button
            onClick={() => {
              const sym = selectedExplainChange.symbol;
              setSelectedExplainChange(null);
              setSelectedStockSymbol(sym);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cobalt-500 hover:bg-cobalt-600 text-white text-xs financial-mono font-bold uppercase rounded-sm shadow-[1.5px_1.5px_0px_#121212]"
          >
            <span>Open Interactive Chart</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setSelectedExplainChange(null)}
            className="px-4 py-1.5 bg-ivory-100 hover:bg-white text-ink-900 border border-ink-900 text-xs financial-mono font-bold uppercase rounded-sm shadow-[1.5px_1.5px_0px_#121212]"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
