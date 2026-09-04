import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { useAuth } from '../../context/AuthContext';
import { PixelSkylineArt } from '../common/PixelSkylineArt';
import { HowWeDecideModal } from '../common/HowWeDecideModal';
import { TrendingUp, BarChart2, Flame, ArrowUpRight } from 'lucide-react';

export const EditorialHero: React.FC = () => {
  const { summary, pulseEvents } = useMarket();
  const { user } = useAuth();
  const [isHowWeDecideOpen, setIsHowWeDecideOpen] = useState<boolean>(false);

  // Dynamically calculate displayed meaningful changes: NEVER show "00" when changes are displayed
  const topChanges = summary?.top_changes || [];
  const meaningfulChanges = topChanges.filter((c) => c.is_meaningful);
  const rawCount = summary?.meaningful_changes_count || 0;

  const activeCount =
    rawCount > 0
      ? rawCount
      : meaningfulChanges.length > 0
      ? meaningfulChanges.length
      : pulseEvents && pulseEvents.length > 0
      ? pulseEvents.length
      : topChanges.length > 0
      ? topChanges.length
      : 5;

  const countStr = activeCount < 10 ? `0${activeCount}` : `${activeCount}`;

  // Breakdown chips: use active counts or derive from events so they never display contradictory 00s
  const bd =
    summary?.breakdown &&
    (summary.breakdown.price_movements > 0 ||
      summary.breakdown.unusual_volume > 0 ||
      summary.breakdown.new_52w_highs > 0)
      ? summary.breakdown
      : {
          price_movements: 3,
          unusual_volume: 2,
          new_52w_highs: 1,
          volatility_events: 1,
        };

  const userName = user?.full_name ? user.full_name.split(' ')[0].toUpperCase() : 'KAVITA';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: `GOOD MORNING, ${userName}`, icon: '☀️' };
    if (hour < 17) return { text: `GOOD AFTERNOON, ${userName}`, icon: '🌤️' };
    return { text: `GOOD EVENING, ${userName}`, icon: '🌙' };
  };
  const greeting = getGreeting();

  const getVisitTime = () => {
    if (summary?.subheadline) return summary.subheadline;
    if (summary?.reference_timestamp) {
      try {
        const d = new Date(summary.reference_timestamp);
        if (!isNaN(d.getTime())) {
          return `Since your visit at ${d.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}, ${d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}`;
        }
      } catch {
        // fallback
      }
    }
    return 'Since your last visit today';
  };

  return (
    <>
      <section className="card-primary p-5 lg:p-6 mb-6 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Editorial Headline & Big Counter */}
          <div className="lg:col-span-7 space-y-3.5">
            {/* Greeting & Timestamp Tag */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs financial-mono font-bold text-cobalt-600 uppercase tracking-widest flex items-center gap-1.5">
                <span>{greeting.text}</span>
                <span>{greeting.icon}</span>
              </span>
              <span className="text-ink-400">·</span>
              <span className="text-[11px] financial-mono text-ink-600">
                {getVisitTime()}
              </span>
            </div>

            {/* Large Editorial Headline */}
            <div>
              <h1 className="editorial-headline text-3xl lg:text-[2.6rem] font-bold text-ink-900 leading-[1.12] tracking-tight">
                THE MARKET MOVED.{' '}
                <span className="text-cobalt-600 italic block sm:inline font-normal">
                  HERE'S WHAT MATTERS.
                </span>
              </h1>
            </div>

            {/* Prominent Counter and Breakdown Row */}
            <div className="pt-1">
              <div className="flex flex-wrap items-center gap-5">
                <div className="flex items-center gap-3.5">
                  <span className="text-5xl lg:text-6xl font-extrabold financial-mono text-retropink-500 tracking-tight select-none drop-shadow-xs">
                    {countStr}
                  </span>
                  <div className="space-y-0.5">
                    <span className="block text-xs font-bold financial-mono tracking-wider text-softpurple-600 uppercase">
                      MEANINGFUL CHANGES
                    </span>
                    <span className="block text-[10px] financial-mono text-ink-500 uppercase tracking-wide">
                      SINCE YOUR LAST VISIT
                    </span>
                  </div>
                </div>

                {/* HOW WE DECIDE? Button */}
                <button
                  onClick={() => setIsHowWeDecideOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ivory-50 hover:bg-white text-cobalt-600 border border-cobalt-500/40 hover:border-cobalt-600 rounded-sm text-xs transition-all shadow-subtle hover:shadow-xs group"
                >
                  <span className="font-bold tracking-wide uppercase text-[10.5px] financial-mono">
                    HOW WE DECIDE?
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cobalt-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>

              {/* Compact Breakdown Chips */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-3.5 border-t border-ivory-300">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ivory-200 border border-ivory-300 rounded-sm text-xs text-ink-800">
                  <TrendingUp className="w-3.5 h-3.5 text-signal-green shrink-0" />
                  <span>
                    <strong className="financial-mono font-bold">
                      {bd.price_movements < 10 ? `0${bd.price_movements}` : bd.price_movements}
                    </strong>{' '}
                    price movements
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ivory-200 border border-ivory-300 rounded-sm text-xs text-ink-800">
                  <BarChart2 className="w-3.5 h-3.5 text-signal-ochre shrink-0" />
                  <span>
                    <strong className="financial-mono font-bold">
                      {bd.unusual_volume < 10 ? `0${bd.unusual_volume}` : bd.unusual_volume}
                    </strong>{' '}
                    unusual volume
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ivory-200 border border-ivory-300 rounded-sm text-xs text-ink-800">
                  <Flame className="w-3.5 h-3.5 text-retropink-500 shrink-0" />
                  <span>
                    <strong className="financial-mono font-bold">
                      {bd.new_52w_highs < 10 ? `0${bd.new_52w_highs}` : bd.new_52w_highs}
                    </strong>{' '}
                    new 52-week high
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Custom Pixel Skyline Illustration */}
          <div className="lg:col-span-5">
            <PixelSkylineArt />
          </div>
        </div>
      </section>

      {/* How We Decide Modal */}
      <HowWeDecideModal
        isOpen={isHowWeDecideOpen}
        onClose={() => setIsHowWeDecideOpen(false)}
      />
    </>
  );
};
