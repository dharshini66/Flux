import React from 'react';
import { useWatchlist } from '../../context/WatchlistContext';
import { Plus, Settings, Layers } from 'lucide-react';

interface WatchlistTabsProps {
  onAddStockClick: () => void;
  onManageWatchlistsClick: () => void;
}

export const WatchlistTabs: React.FC<WatchlistTabsProps> = ({
  onAddStockClick,
  onManageWatchlistsClick,
}) => {
  const { watchlists, activeWatchlist, setActiveWatchlistId } = useWatchlist();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
        {watchlists.map((wl) => {
          const isActive = activeWatchlist?.id === wl.id;
          return (
            <button
              key={wl.id}
              onClick={() => setActiveWatchlistId(wl.id)}
              className={`px-3 py-1.5 rounded-sm text-xs financial-mono font-bold uppercase transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-ink-900 text-white shadow-retro-sm'
                  : 'bg-ivory-100 hover:bg-ivory-50 text-ink-700 border border-ivory-300'
              }`}
            >
              <span>{wl.name}</span>
              <span
                className={`text-[9px] px-1 py-0.2 rounded ${
                  isActive ? 'bg-cobalt-500 text-white' : 'bg-ivory-200 text-ink-500'
                }`}
              >
                {wl.stocks_count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onAddStockClick}
          className="flex items-center gap-1 px-3 py-1.5 bg-cobalt-500 hover:bg-cobalt-600 text-white text-xs financial-mono font-bold uppercase rounded-sm border border-ink-900 shadow-[1.5px_1.5px_0px_#121212] transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Stock</span>
        </button>

        <button
          onClick={onManageWatchlistsClick}
          title="Create or manage watchlists"
          className="p-1.5 bg-ivory-100 hover:bg-ivory-200 text-ink-700 border border-ivory-300 rounded-sm shadow-subtle transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
