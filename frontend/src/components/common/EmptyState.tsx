import React from 'react';
import { Sparkles, ShieldCheck, Compass } from 'lucide-react';

interface EmptyStateProps {
  type: 'FIRST_VISIT' | 'NO_FLUX' | 'EMPTY_WATCHLIST' | 'MARKET_CLOSED';
  title?: string;
  description?: string;
  onAction?: () => void;
  actionText?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  onAction,
  actionText,
}) => {
  const getContent = () => {
    switch (type) {
      case 'FIRST_VISIT':
        return {
          icon: <Sparkles className="w-8 h-8 text-cobalt-500" />,
          title: title || 'YOUR WATCHLIST IS READY.',
          desc:
            description ||
            'We have established your baseline snapshot. When you return or when the market moves, FLUX will analyze what actually changed.',
          badge: 'BASELINE SYNCHRONIZED',
        };
      case 'NO_FLUX':
        return {
          icon: <ShieldCheck className="w-8 h-8 text-signal-green" />,
          title: title || 'NO FLUX. ROUTINE MARKET DRIFT.',
          desc:
            description ||
            'The market moved, but nothing exceeded significance thresholds. Zero noise, high confidence.',
          badge: 'FILTERED NOISE',
        };
      case 'MARKET_CLOSED':
        return {
          icon: <Compass className="w-8 h-8 text-retropink-500" />,
          title: title || 'MARKET SESSION CLOSED',
          desc:
            description ||
            'The exchange is currently closed. Showing closing snapshot values from 03:30 PM IST.',
          badge: 'POST-MARKET',
        };
      case 'EMPTY_WATCHLIST':
      default:
        return {
          icon: <Compass className="w-8 h-8 text-ink-600" />,
          title: title || 'NO STOCKS TRACKED YET',
          desc: description || 'Add stocks to this watchlist to begin receiving intelligent change signals.',
          badge: 'SETUP REQUIRED',
        };
    }
  };

  const c = getContent();

  return (
    <div className="bg-ivory-100 border border-editorial border-dashed rounded-md p-8 text-center flex flex-col items-center justify-center my-4">
      <div className="p-3 bg-ivory-200 border border-ivory-300 rounded-md mb-3 shadow-[2px_2px_0px_#121212]">
        {c.icon}
      </div>
      <span className="text-[10px] financial-mono font-bold tracking-widest text-cobalt-500 uppercase mb-1">
        {c.badge}
      </span>
      <h3 className="editorial-headline text-2xl font-bold text-ink-900 mb-2">{c.title}</h3>
      <p className="text-sm text-ink-600 max-w-md mb-4">{c.desc}</p>
      {onAction && actionText && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-cobalt-500 hover:bg-cobalt-600 text-white text-xs financial-mono font-bold uppercase rounded-sm shadow-[2px_2px_0px_#121212] transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
