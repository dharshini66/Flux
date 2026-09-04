import React, { useEffect, useState } from 'react';
import { X, Cpu, CheckCircle2, Sliders, Shield, Zap } from 'lucide-react';
import { api } from '../../services/api';

interface HowWeDecideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowWeDecideModal: React.FC<HowWeDecideModalProps> = ({ isOpen, onClose }) => {
  const [weights, setWeights] = useState({
    price_move: 0.35,
    volume_anomaly: 0.25,
    volatility: 0.15,
    price_level: 0.15,
    contextual: 0.10,
  });

  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/v1/changes/thresholds')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.weights) {
          setWeights(data.weights);
        }
      })
      .catch((err) => console.log('Using default thresholds'));
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-ivory-100 border-2 border-editorial-dark rounded-md w-full max-w-lg shadow-[6px_6px_0px_#121212] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-ivory-200 border-b border-ivory-300">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-cobalt-500 text-white rounded-sm flex items-center justify-center text-xs font-bold shadow-[1px_1px_0px_#121212]">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-ink-900 uppercase tracking-tight financial-mono flex items-center gap-2">
                FLUX SIGNAL ENGINE
                <span className="text-[9px] bg-retropink-500 text-white px-1.5 py-0.2 rounded-sm font-bold">
                  TRANSPARENCY
                </span>
              </h3>
              <span className="text-[10px] financial-mono text-ink-500">
                Multi-Factor Significance Scoring Algorithm
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-ivory-300 text-ink-900 rounded-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          
          <div>
            <span className="text-[10px] financial-mono font-bold text-softpurple-500 uppercase tracking-widest block mb-1">
              DECISION MODEL
            </span>
            <h4 className="text-base font-bold text-ink-900">Why was this marked?</h4>
            <p className="text-xs text-ink-600 mt-1 leading-relaxed">
              FLUX combines multiple independent market signals into a composite normalized score to distinguish true institutional divergence from routine daily drift.
            </p>
          </div>

          {/* Factor Breakdown Weights Table */}
          <div className="bg-ivory-50 border border-ivory-300 rounded-sm p-3.5 space-y-2.5">
            <span className="text-[10px] financial-mono font-bold text-ink-700 uppercase tracking-wider block border-b border-ivory-300 pb-1">
              WEIGHTED FACTOR ATTRIBUTION
            </span>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-ink-800">Price movement (velocity vs 0.4% noise)</span>
                <span className="font-bold text-cobalt-600">{(weights.price_move * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-ivory-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cobalt-500 h-full" style={{ width: `${weights.price_move * 100}%` }}></div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-ink-800">Volume anomaly (vs 30-day baseline)</span>
                <span className="font-bold text-retropink-500">{(weights.volume_anomaly * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-ivory-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-retropink-500 h-full" style={{ width: `${weights.volume_anomaly * 100}%` }}></div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-ink-800">Volatility expansion (vs typical ATR)</span>
                <span className="font-bold text-softpurple-500">{(weights.volatility * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-ivory-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-softpurple-500 h-full" style={{ width: `${weights.volatility * 100}%` }}></div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-ink-800">Price level extremes (52W High / Low / Gap)</span>
                <span className="font-bold text-signal-ochre">{(weights.price_level * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-ivory-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-signal-ochre h-full" style={{ width: `${weights.price_level * 100}%` }}></div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-ink-800">Contextual synergy (multi-signal catalyst)</span>
                <span className="font-bold text-signal-green">{(weights.contextual * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-ivory-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-signal-green h-full" style={{ width: `${weights.contextual * 100}%` }}></div>
              </div>
            </div>
          </div>

          {/* Sample Score Card */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-ivory-200 border border-ivory-300 rounded-sm">
              <span className="text-[10px] financial-mono text-ink-500 uppercase block font-bold">
                SIGNAL SCORE
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-extrabold financial-mono text-ink-900">0.82</span>
                <span className="text-xs financial-mono text-ink-400">/ 1.00</span>
              </div>
              <span className="text-[10px] financial-mono text-cobalt-600 block mt-1">
                ● ● ● ● ○ Level 4
              </span>
            </div>

            <div className="p-3 bg-ivory-200 border border-ivory-300 rounded-sm">
              <span className="text-[10px] financial-mono text-ink-500 uppercase block font-bold">
                CLASSIFICATION
              </span>
              <span className="inline-block mt-1 text-sm font-extrabold financial-mono px-2 py-0.5 bg-cobalt-500 text-white rounded-sm">
                HIGH IMPACT
              </span>
              <span className="text-[10px] financial-mono text-ink-600 block mt-1">
                Prioritized over routine noise
              </span>
            </div>
          </div>

          <div className="p-3 bg-ivory-50 border border-ivory-300 rounded-sm text-[11px] text-ink-600 leading-relaxed">
            <span className="font-bold text-ink-900">Engineering Philosophy:</span> Rather than alerting on every single tick, FLUX enforces a minimum 0.4% noise floor and evaluates volume, volatility, and boundaries so you only see what deserves your attention.
          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 bg-ivory-200 border-t border-ivory-300 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-cobalt-500 hover:bg-cobalt-600 text-white text-xs financial-mono font-bold uppercase rounded-sm shadow-[1.5px_1.5px_0px_#121212] transition-all"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
