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

  // Dynamically calculate displayed meaningful changes: strictly sync with displayed cards
  const topChanges = summary?.top_changes || [];
  const meaningfulChanges = topChanges.filter((c) => c.is_meaningful);
  const rawCount = summary?.meaningful_changes_count ?? 0;

  // Counter strictly uses the backend meaningful_changes_count as the source of truth
  const activeCount = rawCount;
  const countStr = activeCount < 10 ? `0${activeCount}` : `${activeCount}`;

  // Breakdown chips: strictly reflect meaningful signals from backend summary breakdown
  const bd =
    activeCount === 0
      ? { price_movements: 0, unusual_volume: 0, new_52w_highs: 0, volatility_events: 0 }
      : summary?.breakdown || {
          price_movements: 0,
          unusual_volume: 0,
          new_52w_highs: 0,
          volatility_events: 0,
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
      <section className="card-primary p-4 lg:p-5 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Left Column: Editorial Headline & Big Counter */}
          <div className="lg:col-span-7 space-y-3">
            {/* Greeting & Timestamp Tag */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] financial-mono font-bold text-cobalt-600 dark:text-[#4C72FF] uppercase tracking-widest flex items-center gap-1.5">
                <span>{greeting.text}</span>
                <span>{greeting.icon}</span>
              </span>
              <span className="text-ink-400 dark:text-[#737B8A]">·</span>
              <span className="text-[10.5px] financial-mono text-ink-600 dark:text-[#A8AFBD]">
                {getVisitTime()}
              </span>
            </div>

            {/* Editorial Headline Hierarchy */}
            <div className="space-y-0.5">
              <h1 className="editorial-headline text-2xl lg:text-[2.15rem] font-bold text-ink-900 dark:text-[#F4F1E8] leading-[1.1] tracking-tight block">
                THE MARKET MOVED.
              </h1>
              <span className="editorial-headline text-xl lg:text-[1.7rem] text-cobalt-600 dark:text-[#4C72FF] font-normal italic leading-[1.15] tracking-tight block">
                HERE'S WHAT MATTERS.
              </span>
            </div>

            {/* Prominent Counter and Action Row */}
            <div className="pt-0.5">
              <div className="flex flex-wrap items-center justify-between sm:justify-start gap-4 sm:gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-4xl lg:text-5xl font-extrabold financial-mono text-retropink-500 tracking-tight select-none drop-shadow-xs">
                    {countStr}
                  </span>
                  <div className="space-y-0.5">
                    <span className="block text-[11px] font-bold financial-mono tracking-wider text-softpurple-600 dark:text-[#8A78E8] uppercase">
                      MEANINGFUL CHANGES
                    </span>
                    <span className="block text-[9.5px] financial-mono text-ink-500 dark:text-[#737B8A] uppercase tracking-wide">
                      SINCE YOUR LAST VISIT
                    </span>
                  </div>
                </div>

                {/* HOW WE DECIDE? Button */}
                <button
                  onClick={() => setIsHowWeDecideOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ivory-50 dark:bg-[#1B202B] hover:bg-white dark:hover:bg-[#202633] text-cobalt-600 dark:text-[#4C72FF] border border-cobalt-500/40 dark:border-[#4C72FF]/40 hover:border-cobalt-600 rounded-sm text-xs transition-all shadow-subtle hover:shadow-xs group"
                >
                  <span className="font-bold tracking-wide uppercase text-[10.5px] financial-mono">
                    HOW WE DECIDE?
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cobalt-500 dark:text-[#4C72FF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>

              {/* Compact Breakdown Chips */}
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-ivory-300 dark:border-[#303746]">
                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-ivory-200 dark:bg-[#1B202B] border border-ivory-300 dark:border-[#303746] rounded-sm text-[11px] text-ink-800 dark:text-[#F4F1E8]">
                  <TrendingUp className="w-3 h-3 text-signal-green shrink-0" />
                  <span>
                    <strong className="financial-mono font-bold">
                      {bd.price_movements < 10 ? `0${bd.price_movements}` : bd.price_movements}
                    </strong>{' '}
                    price movements
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-ivory-200 dark:bg-[#1B202B] border border-ivory-300 dark:border-[#303746] rounded-sm text-[11px] text-ink-800 dark:text-[#F4F1E8]">
                  <BarChart2 className="w-3 h-3 text-signal-ochre shrink-0" />
                  <span>
                    <strong className="financial-mono font-bold">
                      {bd.unusual_volume < 10 ? `0${bd.unusual_volume}` : bd.unusual_volume}
                    </strong>{' '}
                    unusual volume
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-ivory-200 dark:bg-[#1B202B] border border-ivory-300 dark:border-[#303746] rounded-sm text-[11px] text-ink-800 dark:text-[#F4F1E8]">
                  <Flame className="w-3 h-3 text-retropink-500 shrink-0" />
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
