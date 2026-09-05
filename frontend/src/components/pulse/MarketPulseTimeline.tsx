import React, { useState } from 'react';
import { MarketPulseEvent } from '../../types';
import { useMarket } from '../../context/MarketContext';
import { Activity, Zap, ArrowUpRight } from 'lucide-react';
import { SeverityBadge } from '../common/SeverityBadge';

export const MarketPulseTimeline: React.FC = () => {
  const { pulseEvents, setSelectedStockSymbol } = useMarket();
  const [activeEvent, setActiveEvent] = useState<MarketPulseEvent | null>(pulseEvents[1] || null);

  const hourMarks = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'];

  return (
    <section className="card-secondary p-4 sm:p-5 shadow-subtle">
      {/* Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-ivory-300 dark:border-[#303746]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-cobalt-500 text-white rounded-sm flex items-center justify-center shadow-[1px_1px_0px_#121212] select-none">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-ink-900 dark:text-[#F4F1E8] tracking-tight uppercase flex items-center gap-2">
              <span>THE MARKET PULSE</span>
              <span className="text-[9px] financial-mono bg-ivory-300 dark:bg-[#202633] text-ink-700 dark:text-[#F4F1E8] px-1.5 py-0.5 rounded font-bold">
                SIGNATURE TIMELINE
              </span>
            </h2>
            <span className="text-[10.5px] font-sans text-ink-500 dark:text-[#737B8A]">
              Session Event Velocity & Anomaly Distribution
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3.5 text-xs font-sans text-ink-600 dark:text-[#A8AFBD]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-retropink-500 border border-ink-900 dark:border-[#303746]"></span>
            <span className="text-[11px] font-medium">Critical</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cobalt-500 border border-ink-900 dark:border-[#303746]"></span>
            <span className="text-[11px] font-medium">High</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-signal-ochre border border-ink-900 dark:border-[#303746]"></span>
            <span className="text-[11px] font-medium">Moderate</span>
          </span>
        </div>
      </div>

      {/* Horizontal Interactive Timeline Axis */}
      <div className="relative pt-5 pb-3.5 px-3 sm:px-4 bg-ivory-50 dark:bg-[#1B202B] border border-ivory-300 dark:border-[#303746] rounded-sm scanline-bg">
        {/* Timeline Horizontal Rail with Circular Nodes */}
        <div className="relative h-1 bg-ivory-300 dark:bg-[#303746] rounded-full mb-6">
          {/* Active session progress bar */}
          <div className="absolute left-0 top-0 bottom-0 w-3/4 bg-gradient-to-r from-cobalt-600 via-softpurple-500 to-retropink-500 rounded-full"></div>

          {/* Circular time nodes along the rail */}
          <div className="absolute inset-0 flex justify-between items-center -top-1 px-1 pointer-events-none">
            {hourMarks.map((hm, i) => (
              <div
                key={hm}
                className={`w-3 h-3 rounded-full border-2 border-ink-900 dark:border-[#151922] transition-all ${
                  i < 3 ? 'bg-cobalt-500 shadow-[0_0_4px_rgba(76,114,255,0.5)]' : 'bg-ivory-100 dark:bg-[#202633]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Time Hour Markers */}
        <div className="flex justify-between text-[10px] financial-mono text-ink-500 dark:text-[#737B8A] font-bold uppercase -mt-4 mb-4">
          {hourMarks.map((hm) => (
            <div key={hm} className="flex flex-col items-center">
              <span>{hm}</span>
            </div>
          ))}
        </div>

        {/* Event Cards on the Timeline - Optimized horizontal space & multi-line wrapping */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 xl:gap-3">
          {pulseEvents.map((evt) => {
            const isSelected = activeEvent?.id === evt.id;
            const bubbleBg =
              evt.severity === 'CRITICAL'
                ? 'bg-retropink-500 text-white border-retropink-600'
                : evt.severity === 'HIGH'
                ? 'bg-cobalt-500 text-white border-cobalt-600'
                : 'bg-signal-ochre text-white border-amber-600';

            return (
              <button
                key={evt.id}
                onClick={() => setActiveEvent(evt)}
                className={`p-3 rounded-sm border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white dark:bg-[#1E2533] border-cobalt-600 dark:border-[#4C72FF] shadow-retro-sm ring-1 ring-cobalt-500/50 scale-[1.01]'
                    : 'bg-ivory-100 dark:bg-[#181E29] hover:bg-white dark:hover:bg-[#202736] border-ivory-300 dark:border-[#2C3444] hover:border-editorial-dark dark:hover:border-[#4C72FF]/50 shadow-[1px_1px_0px_#E5DFD1] dark:shadow-none'
                }`}
              >
                {/* Line 1: Time & Symbol Badge */}
                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                  <span className="text-[10px] financial-mono font-semibold text-ink-500 dark:text-[#737B8A] tracking-tight">
                    {evt.time_label}
                  </span>
                  <span
                    className={`text-[9px] financial-mono font-bold px-1.5 py-0.5 rounded-xs border shrink-0 ${bubbleBg}`}
                  >
                    {evt.symbol}
                  </span>
                </div>

                {/* Line 2: Event Title (Readable sans-serif, natural 2-3 line wrap, NO aggressive clamp) */}
                <div className="text-[11.5px] sm:text-[12px] font-semibold text-ink-900 dark:text-[#F4F1E8] leading-[1.3] font-sans my-1.5 min-h-[2.85rem] flex-1">
                  {evt.event_title}
                </div>

                {/* Line 3: Delta & Score */}
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-ivory-300 dark:border-[#2C3444] text-[10px] financial-mono">
                  <span
                    className={`font-bold text-[11px] ${
                      evt.price_delta.startsWith('+') ? 'text-signal-green' : 'text-signal-red'
                    }`}
                  >
                    {evt.price_delta}
                  </span>
                  <span className="text-ink-500 dark:text-[#737B8A] text-[9.5px]">
                    Score: <strong className="text-ink-900 dark:text-[#F4F1E8] font-bold text-[10px] ml-0.5">{evt.significance_score.toFixed(2)}</strong>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Pulse Event Details Drawer */}
      {activeEvent && (
        <div className="mt-4 p-3.5 bg-ivory-200 dark:bg-[#1B202B] border border-ivory-300 dark:border-[#303746] rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-subtle">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-cobalt-500 text-white rounded-sm mt-0.5 select-none shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs financial-mono font-bold text-ink-900 dark:text-[#F4F1E8]">
                  {activeEvent.time_label} · {activeEvent.symbol}
                </span>
                <SeverityBadge severity={activeEvent.severity} />
                <span
                  className={`text-xs financial-mono font-bold ${
                    activeEvent.price_delta.startsWith('+') ? 'text-signal-green' : 'text-signal-red'
                  }`}
                >
                  {activeEvent.price_delta}
                </span>
              </div>
              <p className="text-xs text-ink-700 dark:text-[#D4D8E0] mt-1 font-sans leading-relaxed">
                {activeEvent.detail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSelectedStockSymbol(activeEvent.symbol)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-ivory-100 dark:bg-[#202633] hover:bg-white dark:hover:bg-[#283142] text-ink-900 dark:text-[#F4F1E8] border border-ink-900 dark:border-[#4C72FF]/50 rounded-sm text-xs font-bold uppercase shadow-[1.5px_1.5px_0px_#121212] dark:shadow-none transition-all"
            >
              <span className="financial-mono text-[11px]">Inspect {activeEvent.symbol}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
