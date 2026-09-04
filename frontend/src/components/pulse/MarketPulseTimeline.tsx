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
    <section className="card-secondary p-5 mb-6 shadow-subtle">
      {/* Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-ivory-300">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-cobalt-500 text-white rounded-sm flex items-center justify-center shadow-[1px_1px_0px_#121212] select-none">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-ink-900 tracking-tight uppercase flex items-center gap-2">
              <span>THE MARKET PULSE</span>
              <span className="text-[9px] financial-mono bg-ivory-300 text-ink-700 px-1.5 py-0.5 rounded font-bold">
                SIGNATURE TIMELINE
              </span>
            </h2>
            <span className="text-[10.5px] font-sans text-ink-500">
              Session Event Velocity & Anomaly Distribution
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3.5 text-xs font-sans text-ink-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-retropink-500 border border-ink-900"></span>
            <span className="text-[11px] font-medium">Critical</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cobalt-500 border border-ink-900"></span>
            <span className="text-[11px] font-medium">High</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-signal-ochre border border-ink-900"></span>
            <span className="text-[11px] font-medium">Moderate</span>
          </span>
        </div>
      </div>

      {/* Horizontal Interactive Timeline Axis */}
      <div className="relative pt-6 pb-4 px-4 bg-ivory-50 border border-ivory-300 rounded-sm scanline-bg">
        {/* Timeline Horizontal Rail with Circular Nodes */}
        <div className="relative h-1 bg-ivory-300 rounded-full mb-8">
          {/* Active session progress bar */}
          <div className="absolute left-0 top-0 bottom-0 w-3/4 bg-gradient-to-r from-cobalt-600 via-softpurple-500 to-retropink-500 rounded-full"></div>

          {/* Circular time nodes along the rail */}
          <div className="absolute inset-0 flex justify-between items-center -top-1 px-1 pointer-events-none">
            {hourMarks.map((hm, i) => (
              <div
                key={hm}
                className={`w-3 h-3 rounded-full border-2 border-ink-900 transition-all ${
                  i < 3 ? 'bg-cobalt-500 shadow-[0_0_4px_rgba(23,70,209,0.4)]' : 'bg-ivory-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Time Hour Markers */}
        <div className="flex justify-between text-[10px] financial-mono text-ink-500 font-bold uppercase -mt-5 mb-5">
          {hourMarks.map((hm) => (
            <div key={hm} className="flex flex-col items-center">
              <span>{hm}</span>
            </div>
          ))}
        </div>

        {/* Event Cards on the Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
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
                className={`p-3.5 rounded-sm border text-left transition-all relative ${
                  isSelected
                    ? 'bg-white border-cobalt-500 shadow-retro ring-1 ring-cobalt-400 scale-[1.01]'
                    : 'bg-ivory-100 hover:bg-white/80 border-ivory-300 hover:border-ivory-400'
                }`}
              >
                {/* Line 1: Time & Symbol Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] financial-mono font-semibold text-ink-500">
                    {evt.time_label}
                  </span>
                  <span
                    className={`text-[9px] financial-mono font-bold px-1.5 py-0.5 rounded-xs border ${bubbleBg}`}
                  >
                    {evt.symbol}
                  </span>
                </div>

                {/* Line 2: Event Title (Readable sans-serif, breathing room) */}
                <div className="text-[11.5px] font-semibold text-ink-900 leading-snug font-sans min-h-[2.4rem] line-clamp-2">
                  {evt.event_title}
                </div>

                {/* Line 3: Delta & Score */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-ivory-300 text-[10.5px] financial-mono">
                  <span
                    className={`font-bold ${
                      evt.price_delta.startsWith('+') ? 'text-signal-green' : 'text-signal-red'
                    }`}
                  >
                    {evt.price_delta}
                  </span>
                  <span className="text-ink-500">
                    Score: <strong className="text-ink-900 font-bold">{evt.significance_score.toFixed(2)}</strong>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Pulse Event Details Drawer */}
      {activeEvent && (
        <div className="mt-4 p-3.5 bg-ivory-200 border border-ivory-300 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-subtle">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-cobalt-500 text-white rounded-sm mt-0.5 select-none shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs financial-mono font-bold text-ink-900">
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
              <p className="text-xs text-ink-700 mt-1 font-sans leading-relaxed">
                {activeEvent.detail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSelectedStockSymbol(activeEvent.symbol)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-ivory-100 hover:bg-white text-ink-900 border border-ink-900 rounded-sm text-xs font-bold uppercase shadow-[1.5px_1.5px_0px_#121212] transition-all"
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
