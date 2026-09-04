import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { useAuth } from '../../context/AuthContext';
import { PixelSkylineArt } from '../common/PixelSkylineArt';
import { HowWeDecideModal } from '../common/HowWeDecideModal';
import { Sparkles, TrendingUp, BarChart2, Flame, ArrowUpRight, RefreshCw } from 'lucide-react';

export const EditorialHero: React.FC = () => {
  const { summary, performCheckIn, isCheckingIn } = useMarket();
  const { user } = useAuth();
  const [isHowWeDecideOpen, setIsHowWeDecideOpen] = useState<boolean>(false);

  const isFirstVisit = summary?.is_first_visit || false;
  const meaningfulCount = summary?.meaningful_changes_count || 0;
  const bd = summary?.breakdown || {
    price_movements: 3,
    unusual_volume: 1,
    new_52w_highs: 1,
    volatility_events: 1,
  };

  const countStr = meaningfulCount < 10 ? `0${meaningfulCount}` : `${meaningfulCount}`;
  const userName = user?.full_name ? user.full_name.split(' ')[0].toUpperCase() : 'KAVITA';

  return (
    <>
      <section className="bg-ivory-100 border border-editorial-dark rounded-md p-5 lg:p-6 mb-6 shadow-retro relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Editorial Headline & Big Counter */}
          <div className="lg:col-span-7 space-y-3">
            
            {/* Greeting & Timestamp Tag */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs financial-mono font-extrabold text-cobalt-600 uppercase tracking-widest flex items-center gap-1.5">
                <span>GOOD MORNING, {userName}</span>
                <span>☀️</span>
              </span>
              <span className="text-ink-300">·</span>
              <span className="text-[11px] financial-mono text-ink-600">
                {summary?.subheadline || 'Since your last visit at 01:46 PM, Sep 04'}
              </span>
            </div>

            {/* Large Editorial Headline */}
            <div>
              <h1 className="editorial-headline text-3xl lg:text-[2.6rem] font-bold text-ink-900 leading-tight">
                THE MARKET MOVED.{' '}
                <span className="text-cobalt-600 italic block sm:inline">
                  HERE'S WHAT MATTERS.
                </span>
              </h1>
            </div>

            {/* Prominent Counter and Breakdown Row */}
            <div className="pt-1">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-5xl lg:text-6xl font-extrabold financial-mono text-retropink-500 tracking-tighter drop-shadow-xs">
                    {countStr}
                  </span>
                  <div>
                    <span className="block text-xs font-bold financial-mono tracking-wider text-softpurple-600 uppercase">
                      MEANINGFUL CHANGES
                    </span>
                    <span className="text-[10.5px] financial-mono text-ink-500 uppercase">
                      SINCE YOUR LAST VISIT
                    </span>
                  </div>
                </div>

                {/* HOW WE DECIDE? Button */}
                <button
                  onClick={() => setIsHowWeDecideOpen(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-ivory-50 hover:bg-white text-cobalt-600 border border-cobalt-500/60 rounded-xs text-[11px] financial-mono font-bold uppercase transition-all shadow-subtle hover:border-cobalt-600"
                >
                  <span>HOW WE DECIDE?</span>
                  <ArrowUpRight className="w-3 h-3 text-cobalt-600" />
                </button>
              </div>

              {/* Compact Breakdown Chips */}
              <div className="flex flex-wrap items-center gap-2.5 mt-3.5 pt-3 border-t border-ivory-300">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ivory-200 border border-ivory-300 rounded-sm text-xs financial-mono font-medium text-ink-800">
                  <TrendingUp className="w-3.5 h-3.5 text-signal-green" />
                  <span>
                    <strong>{bd.price_movements < 10 ? `0${bd.price_movements}` : bd.price_movements}</strong> price movements
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ivory-200 border border-ivory-300 rounded-sm text-xs financial-mono font-medium text-ink-800">
                  <BarChart2 className="w-3.5 h-3.5 text-signal-ochre" />
                  <span>
                    <strong>{bd.unusual_volume < 10 ? `0${bd.unusual_volume}` : bd.unusual_volume}</strong> unusual volume
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ivory-200 border border-ivory-300 rounded-sm text-xs financial-mono font-medium text-ink-800">
                  <Flame className="w-3.5 h-3.5 text-retropink-500" />
                  <span>
                    <strong>{bd.new_52w_highs < 10 ? `0${bd.new_52w_highs}` : bd.new_52w_highs}</strong> new 52-week high
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
