import React, { useState } from 'react';
import { MarketPulseEvent } from '../../types';
import { useMarket } from '../../context/MarketContext';
import { Activity, Clock, Zap, Info, ArrowUpRight } from 'lucide-react';
import { SeverityBadge } from '../common/SeverityBadge';

export const MarketPulseTimeline: React.FC = () => {
  const { pulseEvents, setSelectedStockSymbol } = useMarket();
  const [activeEvent, setActiveEvent] = useState<MarketPulseEvent | null>(pulseEvents[1] || null);

  const hourMarks = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'];

  return (
    <section className="bg-ivory-100 border border-editorial rounded-md p-5 mb-6">
      {/* Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-ivory-300">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-cobalt-500 text-white rounded-sm shadow-[1px_1px_0px_#121212]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-ink-900 tracking-tight uppercase flex items-center gap-2">
              THE MARKET PULSE
              <span className="text-[9px] financial-mono bg-ivory-300 text-ink-700 px-1.5 py-0.5 rounded font-bold">
                SIGNATURE TIMELINE
              </span>
            </h2>
            <span className="text-[10px] financial-mono text-ink-400">
              Session Event Velocity & Anomaly Distribution
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs financial-mono text-ink-600">
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-retropink-500 border border-ink-900"></span>
            Critical
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cobalt-500 border border-ink-900"></span>
            High
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-signal-ochre border border-ink-900"></span>
            Moderate
          </span>
        </div>
      </div>

      {/* Horizontal Interactive Timeline Axis */}
      <div className="relative pt-6 pb-4 px-4 bg-ivory-50 border border-ivory-300 rounded-sm scanline-bg">
        
        {/* Timeline Horizontal Rail */}
        <div className="h-1 bg-ivory-300 relative rounded-full mb-8">
          {/* Active session progress bar */}
          <div className="absolute left-0 top-0 bottom-0 w-3/4 bg-cobalt-500 rounded-full"></div>
        </div>

        {/* Time Hour Markers */}
        <div className="flex justify-between text-[10px] financial-mono text-ink-400 font-bold uppercase -mt-5 mb-6">
          {hourMarks.map((hm) => (
            <div key={hm} className="flex flex-col items-center">
              <div className="w-1.5 h-3 bg-ink-400 mb-1"></div>
              <span>{hm}</span>
            </div>
          ))}
        </div>

        {/* Event Bubbles on the Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {pulseEvents.map((evt, idx) => {
            const isSelected = activeEvent?.id === evt.id;
            const bubbleBg =
              evt.severity === 'CRITICAL'
                ? 'bg-retropink-500 text-white'
                : evt.severity === 'HIGH'
                ? 'bg-cobalt-500 text-white'
                : 'bg-signal-ochre text-white';

            return (
              <button
                key={evt.id}
                onClick={() => setActiveEvent(evt)}
                className={`p-2.5 rounded-sm border text-left transition-all relative ${
                  isSelected
                    ? 'bg-ivory-200 border-editorial-dark shadow-retro-sm scale-[1.02]'
                    : 'bg-ivory-100 hover:bg-ivory-200 border-ivory-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] financial-mono font-bold text-ink-500">
                    {evt.time_label}
                  </span>
                  <span
                    className={`text-[9px] financial-mono font-bold px-1 py-0.2 rounded-sm border border-ink-900 ${bubbleBg}`}
                  >
                    {evt.symbol}
                  </span>
                </div>

                <div className="text-xs font-bold text-ink-900 leading-tight truncate">
                  {evt.event_title}
                </div>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-ivory-300 text-[10px] financial-mono">
                  <span className={evt.price_delta.startsWith('+') ? 'text-signal-green font-bold' : 'text-signal-red font-bold'}>
                    {evt.price_delta}
                  </span>
                  <span className="text-ink-400">Score: {evt.significance_score}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Pulse Event Details Drawer */}
      {activeEvent && (
        <div className="mt-4 p-3.5 bg-ivory-200 border border-editorial rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-subtle">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-cobalt-500 text-white rounded-sm mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs financial-mono font-bold text-ink-900">
                  {activeEvent.time_label} · {activeEvent.symbol}
                </span>
                <SeverityBadge severity={activeEvent.severity} />
                <span className="text-xs financial-mono font-bold text-signal-green">
                  {activeEvent.price_delta}
                </span>
              </div>
              <p className="text-xs text-ink-700 mt-0.5">{activeEvent.detail}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedStockSymbol(activeEvent.symbol)}
              className="flex items-center gap-1 px-3 py-1.5 bg-ivory-100 hover:bg-white text-ink-900 border border-ink-900 rounded-sm text-xs financial-mono font-bold uppercase shadow-[1.5px_1.5px_0px_#121212] transition-all"
            >
              <span>Inspect {activeEvent.symbol}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
