import React from 'react';
import { useMarket } from '../../context/MarketContext';
import { useAuth } from '../../context/AuthContext';
import { PixelSkylineArt } from '../common/PixelSkylineArt';
import { Sparkles, TrendingUp, BarChart2, Flame, RefreshCw } from 'lucide-react';

export const EditorialHero: React.FC = () => {
  const { summary, performCheckIn, isCheckingIn } = useMarket();
  const { user } = useAuth();

  const isFirstVisit = summary?.is_first_visit || false;
  const meaningfulCount = summary?.meaningful_changes_count || 0;
  const bd = summary?.breakdown || {
    price_movements: 2,
    unusual_volume: 1,
    new_52w_highs: 1,
    volatility_events: 1,
  };

  const countStr = meaningfulCount < 10 ? `0${meaningfulCount}` : `${meaningfulCount}`;
  const userName = user?.full_name ? user.full_name.split(' ')[0].toUpperCase() : 'ANALYST';

  return (
    <section className="bg-ivory-100 border border-editorial border-editorial-dark rounded-md p-6 lg:p-8 mb-6 shadow-retro relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Column: Editorial Headline & Big Counter */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Greeting & Timestamp Tag */}
          <div className="flex items-center gap-2">
            <span className="text-xs financial-mono font-extrabold text-cobalt-500 uppercase tracking-widest">
              GOOD MORNING, {userName}
            </span>
            <span className="text-ink-400">·</span>
            <span className="text-[11px] financial-mono text-ink-600">
              {summary?.subheadline || 'Since your previous baseline check-in'}
            </span>
          </div>

          {/* Large Editorial Headline */}
          {isFirstVisit ? (
            <div>
              <h1 className="editorial-headline text-3xl lg:text-4xl font-bold text-ink-900 leading-tight">
                YOUR WATCHLIST IS <span className="text-cobalt-500 underline decoration-retropink-500">READY</span>.
              </h1>
              <p className="text-sm text-ink-600 mt-2 max-w-xl">
                We have established your initial market baseline snapshot. When you return or when the market moves,
                FLUX will evaluate delta vectors and surface what actually changed.
              </p>
            </div>
          ) : (
            <div>
              <h1 className="editorial-headline text-3xl lg:text-4.5xl font-bold text-ink-900 leading-none">
                THE MARKET MOVED.{' '}
                <span className="text-cobalt-500 italic bg-cobalt-50 px-1 border-b-2 border-cobalt-500">
                  HERE'S WHAT MATTERS.
                </span>
              </h1>
            </div>
          )}

          {/* Prominent Counter and Breakdown Row */}
          {!isFirstVisit && (
            <div className="pt-2">
              <div className="flex flex-wrap items-baseline gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl lg:text-6xl font-extrabold financial-mono text-ink-900 tracking-tighter">
                    {countStr}
                  </span>
                  <div>
                    <span className="block text-xs font-bold financial-mono tracking-wider text-retropink-500 uppercase">
                      MEANINGFUL CHANGES
                    </span>
                    <span className="text-[11px] financial-mono text-ink-400 uppercase">
                      SINCE YOUR LAST VISIT
                    </span>
                  </div>
                </div>
              </div>

              {/* Compact Breakdown Chips */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-ivory-300">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ivory-200 border border-ivory-300 rounded-sm text-xs financial-mono font-medium text-ink-700">
                  <TrendingUp className="w-3.5 h-3.5 text-signal-green" />
                  <span>
                    <strong>{bd.price_movements < 10 ? `0${bd.price_movements}` : bd.price_movements}</strong> price movements
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ivory-200 border border-ivory-300 rounded-sm text-xs financial-mono font-medium text-ink-700">
                  <BarChart2 className="w-3.5 h-3.5 text-signal-ochre" />
                  <span>
                    <strong>{bd.unusual_volume < 10 ? `0${bd.unusual_volume}` : bd.unusual_volume}</strong> volume anomalies
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ivory-200 border border-ivory-300 rounded-sm text-xs financial-mono font-medium text-ink-700">
                  <Flame className="w-3.5 h-3.5 text-retropink-500" />
                  <span>
                    <strong>{bd.new_52w_highs < 10 ? `0${bd.new_52w_highs}` : bd.new_52w_highs}</strong> 52W high/low events
                  </span>
                </div>
              </div>
            </div>
          )}

          {isFirstVisit && (
            <div className="pt-2">
              <button
                onClick={() => performCheckIn(false)}
                disabled={isCheckingIn}
                className="flex items-center gap-2 px-4 py-2 bg-cobalt-500 hover:bg-cobalt-600 text-white text-xs financial-mono font-bold uppercase rounded-sm shadow-[2px_2px_0px_#121212] transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${isCheckingIn ? 'animate-spin' : ''}`} />
                <span>Trigger Market Shift Simulation</span>
              </button>
            </div>
          )}

        </div>

        {/* Right Column: Custom Pixel Skyline Illustration */}
        <div className="lg:col-span-5">
          <PixelSkylineArt />
        </div>

      </div>
    </section>
  );
};
