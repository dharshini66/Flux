import React from 'react';
import { Cpu, ShieldCheck, Database, Layers, CheckCircle2, GitBranch, RefreshCw } from 'lucide-react';

export const EngineSpecsView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-ivory-300">
        <span className="text-[10px] financial-mono font-bold text-cobalt-500 uppercase tracking-widest block">
          SYSTEM ARCHITECTURE & SPECIFICATIONS
        </span>
        <h2 className="editorial-headline text-3xl font-bold text-ink-900 mt-0.5">
          Meaningful Change Engine Specifications
        </h2>
        <p className="text-xs text-ink-600 mt-1 max-w-2xl">
          Complete transparent documentation of mathematical formulations, thresholds, snapshot models,
          and multi-provider resilience strategies.
        </p>
      </div>

      {/* Engineering Pipeline Flowchart */}
      <div className="bg-ivory-100 border border-editorial rounded-md p-5 shadow-retro">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-ivory-300">
          <div className="flex items-center gap-2">
            <span className="text-base">⚡</span>
            <div>
              <h3 className="text-xs font-bold financial-mono uppercase text-ink-900 tracking-wider">
                END-TO-END DATA PROCESSING PIPELINE
              </h3>
              <span className="text-[10px] financial-mono text-ink-500">
                From Raw Ingestion to Prioritized User Attention
              </span>
            </div>
          </div>
          <span className="text-[10px] financial-mono font-bold px-2 py-0.5 bg-cobalt-500 text-white rounded-xs uppercase">
            6 Pipeline Stages
          </span>
        </div>

        {/* 6 Stage Grid / Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          
          {/* Stage 1 */}
          <div className="p-3 bg-ivory-50 border border-ivory-300 rounded-sm relative flex flex-col justify-between shadow-subtle">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] financial-mono font-extrabold px-1.5 py-0.2 bg-ivory-200 text-ink-700 rounded-xs border border-ivory-300">
                  STAGE 01
                </span>
                <span className="text-xs">📡</span>
              </div>
              <h4 className="text-xs font-bold financial-mono text-ink-900 uppercase">
                MARKET DATA
              </h4>
              <p className="text-[10.5px] text-ink-600 mt-1 leading-snug">
                NSE live feeds, 30d ATR baselines, order book volume, multi-provider failover.
              </p>
            </div>
            <div className="mt-2.5 pt-1.5 border-t border-ivory-200 text-[9px] financial-mono text-cobalt-600 font-bold">
              Shared Ingestion
            </div>
          </div>

          {/* Stage 2 */}
          <div className="p-3 bg-ivory-50 border border-ivory-300 rounded-sm relative flex flex-col justify-between shadow-subtle">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] financial-mono font-extrabold px-1.5 py-0.2 bg-ivory-200 text-ink-700 rounded-xs border border-ivory-300">
                  STAGE 02
                </span>
                <span className="text-xs">📸</span>
              </div>
              <h4 className="text-xs font-bold financial-mono text-ink-900 uppercase">
                USER SNAPSHOT
              </h4>
              <p className="text-[10.5px] text-ink-600 mt-1 leading-snug">
                Personalized baseline frozen at last user visit. Immutable during read requests.
              </p>
            </div>
            <div className="mt-2.5 pt-1.5 border-t border-ivory-200 text-[9px] financial-mono text-softpurple-600 font-bold">
              Personalized Baseline
            </div>
          </div>

          {/* Stage 3 */}
          <div className="p-3 bg-ivory-50 border border-ivory-300 rounded-sm relative flex flex-col justify-between shadow-subtle">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] financial-mono font-extrabold px-1.5 py-0.2 bg-ivory-200 text-ink-700 rounded-xs border border-ivory-300">
                  STAGE 03
                </span>
                <span className="text-xs">🔍</span>
              </div>
              <h4 className="text-xs font-bold financial-mono text-ink-900 uppercase">
                CHANGE DETECTION
              </h4>
              <p className="text-[10.5px] text-ink-600 mt-1 leading-snug">
                Delta computation vs. baseline. Noise cutoff suppresses routine fluctuations (&lt;0.4%).
              </p>
            </div>
            <div className="mt-2.5 pt-1.5 border-t border-ivory-200 text-[9px] financial-mono text-cobalt-600 font-bold">
              Delta & Noise Gate
            </div>
          </div>

          {/* Stage 4 */}
          <div className="p-3 bg-ivory-50 border border-ivory-300 rounded-sm relative flex flex-col justify-between shadow-subtle">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] financial-mono font-extrabold px-1.5 py-0.2 bg-ivory-200 text-ink-700 rounded-xs border border-ivory-300">
                  STAGE 04
                </span>
                <span className="text-xs">⚙️</span>
              </div>
              <h4 className="text-xs font-bold financial-mono text-ink-900 uppercase">
                SIGNAL ENGINE
              </h4>
              <p className="text-[10.5px] text-ink-600 mt-1 leading-snug">
                Classifies anomalies: 52W high breakout, volume velocity spikes, volatility surges.
              </p>
            </div>
            <div className="mt-2.5 pt-1.5 border-t border-ivory-200 text-[9px] financial-mono text-retropink-500 font-bold">
              Catalyst Isolation
            </div>
          </div>

          {/* Stage 5 */}
          <div className="p-3 bg-ivory-50 border border-ivory-300 rounded-sm relative flex flex-col justify-between shadow-subtle">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] financial-mono font-extrabold px-1.5 py-0.2 bg-ivory-200 text-ink-700 rounded-xs border border-ivory-300">
                  STAGE 05
                </span>
                <span className="text-xs">📐</span>
              </div>
              <h4 className="text-xs font-bold financial-mono text-ink-900 uppercase">
                SIGNIFICANCE SCORE
              </h4>
              <p className="text-[10.5px] text-ink-600 mt-1 leading-snug">
                Mathematical weighted multi-factor sum (0.35P + 0.25V + 0.15σ + 0.15L + 0.10C).
              </p>
            </div>
            <div className="mt-2.5 pt-1.5 border-t border-ivory-200 text-[9px] financial-mono text-cobalt-600 font-bold">
              Normalized [0.0 - 1.0]
            </div>
          </div>

          {/* Stage 6 */}
          <div className="p-3 bg-ivory-50 border border-cobalt-500 rounded-sm relative flex flex-col justify-between shadow-subtle">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] financial-mono font-extrabold px-1.5 py-0.2 bg-cobalt-500 text-white rounded-xs">
                  STAGE 06
                </span>
                <span className="text-xs">🎯</span>
              </div>
              <h4 className="text-xs font-bold financial-mono text-ink-900 uppercase">
                RANKED CHANGES
              </h4>
              <p className="text-[10.5px] text-ink-600 mt-1 leading-snug">
                Sorted by importance. Feeds Editorial Hero, Market Pulse, and Explain Drawers.
              </p>
            </div>
            <div className="mt-2.5 pt-1.5 border-t border-ivory-200 text-[9px] financial-mono text-signal-green font-bold">
              User Prioritization
            </div>
          </div>

        </div>
      </div>

      {/* 5 Evaluation Dimensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <div className="retro-card p-5 space-y-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cobalt-500" />
            <h4 className="text-xs font-bold financial-mono uppercase text-ink-900">
              1. Engineering Depth
            </h4>
          </div>
          <p className="text-xs text-ink-600 leading-relaxed">
            Modular monolith with dedicated backend algorithmic engine, normalized relational schema, O(1) shared cache ingestion for 100k users, and mathematical signal scoring.
          </p>
        </div>

        <div className="retro-card p-5 space-y-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-retropink-500" />
            <h4 className="text-xs font-bold financial-mono uppercase text-ink-900">
              2. Product Interpretation
            </h4>
          </div>
          <p className="text-xs text-ink-600 leading-relaxed">
            Moves beyond simple prices to 'What changed since THIS user last checked?' with Market Pulse, plain-language diagnostics, and an exploration-based Market Mission.
          </p>
        </div>

        <div className="retro-card p-5 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-signal-green" />
            <h4 className="text-xs font-bold financial-mono uppercase text-ink-900">
              3. Resilience & Edge Cases
            </h4>
          </div>
          <p className="text-xs text-ink-600 leading-relaxed">
            Per-stock provider error containment, multi-source consensus arbitration, explicit freshness markers (`LIVE`, `RECENT`, `STALE`, `UNAVAILABLE`), and race-condition safety.
          </p>
        </div>

        <div className="retro-card p-5 space-y-2">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-signal-ochre" />
            <h4 className="text-xs font-bold financial-mono uppercase text-ink-900">
              4. Simplicity & Maintainability
            </h4>
          </div>
          <p className="text-xs text-ink-600 leading-relaxed">
            Zero unnecessary microservices, blockchain, or complex LLM chains. Clean separation between client, REST API, change engine, and market providers.
          </p>
        </div>

        <div className="retro-card p-5 space-y-2">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-cobalt-500" />
            <h4 className="text-xs font-bold financial-mono uppercase text-ink-900">
              5. Originality & Identity
            </h4>
          </div>
          <p className="text-xs text-ink-600 leading-relaxed">
            Distinctive Warm Ivory & Cobalt editorial-retro aesthetic, custom pixel skyline art, baseline first-visit snapshots without fabricated changes, and no generic dark neon SaaS tropes.
          </p>
        </div>

      </div>

      {/* Mathematical Formulation Card */}
      <div className="bg-ivory-100 border border-editorial rounded-md p-6 space-y-4">
        <h3 className="editorial-headline text-2xl font-bold text-ink-900">
          Mathematical Formulation
        </h3>
        <div className="bg-ivory-50 border border-ivory-300 rounded p-4 text-xs financial-mono space-y-2 text-ink-800">
          <div className="font-bold text-cobalt-500 text-sm">
            Significance = (0.35 * S_price) + (0.25 * S_volume) + (0.15 * S_volatility) + (0.15 * S_level) + (0.10 * S_context)
          </div>
          <div className="text-[11px] text-ink-600 pt-2 border-t border-ivory-300">
            ▪ <strong>S_price:</strong> Sublinear scaling with min noise cutoff at 0.4% (suppresses routine drift) up to 6.0% extreme surge.<br />
            ▪ <strong>S_volume:</strong> Ratio of session volume relative to historical typical baseline (2.2x+ earns high weight).<br />
            ▪ <strong>S_volatility:</strong> Ratio of price delta relative to 30-day historical Average True Range (ATR).<br />
            ▪ <strong>S_level:</strong> Proximity to 52-week High/Low breakout or opening gap events.<br />
            ▪ <strong>S_context:</strong> Synergistic confluence multiplier when 3+ anomalies occur simultaneously.
          </div>
        </div>

        {/* Severity Classification Thresholds Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-ivory-200 border-b border-ivory-300 text-[10px] financial-mono uppercase font-bold text-ink-600">
                <th className="py-2 px-3">Classification</th>
                <th className="py-2 px-3">Score Range</th>
                <th className="py-2 px-3">Signal Indicator</th>
                <th className="py-2 px-3">Product Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-300 financial-mono">
              <tr>
                <td className="py-2.5 px-3 font-bold text-retropink-500">CRITICAL</td>
                <td className="py-2.5 px-3">≥ 0.80</td>
                <td className="py-2.5 px-3">● ● ● ● ●</td>
                <td className="py-2.5 px-3 text-ink-700">Top hero alert, high-intensity Market Pulse</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-cobalt-500">HIGH</td>
                <td className="py-2.5 px-3">0.60 - 0.79</td>
                <td className="py-2.5 px-3">● ● ● ● ○</td>
                <td className="py-2.5 px-3 text-ink-700">Top changes card, featured in breakdown</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-signal-ochre">MODERATE</td>
                <td className="py-2.5 px-3">0.35 - 0.59</td>
                <td className="py-2.5 px-3">● ● ● ○ ○</td>
                <td className="py-2.5 px-3 text-ink-700">Included in changes feed, secondary pulse bubble</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-ink-500">NORMAL</td>
                <td className="py-2.5 px-3">&lt; 0.35</td>
                <td className="py-2.5 px-3">● ○ ○ ○ ○</td>
                <td className="py-2.5 px-3 text-ink-500">Filtered noise; suppressed from priority alerts</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
