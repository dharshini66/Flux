import React from 'react';
import { WatchlistStockItem } from '../../types';
import { useWatchlist } from '../../context/WatchlistContext';
import { useMarket } from '../../context/MarketContext';
import { Sparkline } from '../common/Sparkline';
import { ProviderErrorNotice } from '../common/ProviderErrorNotice';
import { Star, ArrowUpRight, Trash2, Plus } from 'lucide-react';

interface WatchlistTableProps {
  onAddStockClick: () => void;
}

export const WatchlistTable: React.FC<WatchlistTableProps> = ({ onAddStockClick }) => {
  const { activeWatchlist, removeStock, togglePriority } = useWatchlist();
  const { setSelectedStockSymbol } = useMarket();

  if (!activeWatchlist || activeWatchlist.stocks.length === 0) {
    return (
      <div className="bg-ivory-100 border border-editorial rounded-md p-8 text-center my-4">
        <div className="max-w-md mx-auto space-y-3">
          <h3 className="editorial-headline text-xl font-bold text-ink-900">
            THIS WATCHLIST IS EMPTY
          </h3>
          <p className="text-xs text-ink-600">
            Add equities to monitor their meaningful price movements, volume spikes, and 52-week level breakouts.
          </p>
          <button
            onClick={onAddStockClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-cobalt-500 hover:bg-cobalt-600 text-white text-xs financial-mono font-bold uppercase rounded-sm shadow-[2px_2px_0px_#121212] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Stock Symbol</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory-100 border border-editorial rounded-md overflow-hidden shadow-subtle">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ivory-200 border-b border-ivory-300 text-[10px] financial-mono uppercase font-bold text-ink-600 tracking-wider">
              <th className="py-2.5 px-4 w-10 text-center">Pin</th>
              <th className="py-2.5 px-4">Symbol / Name</th>
              <th className="py-2.5 px-4 text-right">Price (₹)</th>
              <th className="py-2.5 px-4 text-right">1D Change</th>
              <th className="py-2.5 px-4 text-center">Trend</th>
              <th className="py-2.5 px-4 text-right">52W Range</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory-300 text-xs">
            {activeWatchlist.stocks.map((stock) => {
              const isPositive = stock.change_1d_pct >= 0;
              const isUnavailable = stock.freshness_status === 'UNAVAILABLE';

              return (
                <tr
                  key={stock.id}
                  className="hover:bg-ivory-50 transition-colors group"
                >
                  {/* Priority Star Toggle */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => togglePriority(activeWatchlist.id, stock.symbol)}
                      title={stock.is_priority ? 'Unpin stock' : 'Pin priority stock'}
                      className="p-1 text-ink-300 hover:text-signal-ochre transition-colors"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          stock.is_priority
                            ? 'fill-signal-ochre text-signal-ochre'
                            : 'text-ink-400'
                        }`}
                      />
                    </button>
                  </td>

                  {/* Symbol & Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedStockSymbol(stock.symbol)}
                        className="font-extrabold text-xs financial-mono text-ink-900 hover:text-cobalt-500 transition-colors uppercase"
                      >
                        {stock.symbol}
                      </button>
                      <span className="text-[10px] financial-mono bg-ivory-200 border border-ivory-300 text-ink-600 px-1 py-0.2 rounded-sm uppercase">
                        {stock.exchange}
                      </span>
                    </div>
                    <span className="text-[11px] text-ink-600 block truncate max-w-[200px]">
                      {stock.name}
                    </span>

                    {/* Per-Stock Failure Containment */}
                    {isUnavailable && (
                      <div className="mt-1">
                        <ProviderErrorNotice
                          symbol={stock.symbol}
                          errorMessage={stock.error_message}
                        />
                      </div>
                    )}
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 text-right financial-mono font-bold text-ink-900">
                    {isUnavailable ? (
                      <span className="text-ink-400">--</span>
                    ) : (
                      `₹${stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                    )}
                  </td>

                  {/* 1D Change */}
                  <td className="py-3 px-4 text-right financial-mono font-bold">
                    {isUnavailable ? (
                      <span className="text-ink-400">--</span>
                    ) : (
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded-sm ${
                          isPositive
                            ? 'text-signal-green bg-green-50 dark:bg-emerald-950/40 dark:text-[#35B58A]'
                            : 'text-signal-red bg-red-50 dark:bg-rose-950/40 dark:text-[#F06A6A]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {stock.change_1d_pct.toFixed(2)}%
                      </span>
                    )}
                  </td>

                  {/* Sparkline Trend */}
                  <td className="py-3 px-4 text-center">
                    {!isUnavailable && (
                      <div className="inline-block">
                        <Sparkline isPositive={isPositive} width={60} height={20} />
                      </div>
                    )}
                  </td>

                  {/* 52W High / Low Bar */}
                  <td className="py-3 px-4 text-right financial-mono text-[11px] text-ink-600 dark:text-[#A8AFBD]">
                    {stock.high_52w > 0 && (
                      <div>
                        <span>₹{stock.low_52w}</span>
                        <span className="mx-1 text-ink-400 dark:text-[#737B8A]">-</span>
                        <span className="font-semibold text-ink-900 dark:text-[#F4F1E8]">₹{stock.high_52w}</span>
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedStockSymbol(stock.symbol)}
                        title="View chart and details"
                        className="p-1 bg-ivory-200 hover:bg-ivory-300 dark:bg-[#1B202B] dark:hover:bg-[#202633] border border-ink-900 dark:border-[#303746] rounded-sm text-ink-900 dark:text-[#F4F1E8] shadow-[1px_1px_0px_#121212] dark:shadow-none transition-all"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeStock(activeWatchlist.id, stock.symbol)}
                        title="Remove from watchlist"
                        className="p-1 bg-ivory-200 hover:bg-red-50 hover:text-signal-red dark:bg-[#1B202B] dark:hover:bg-rose-950/40 dark:hover:text-signal-red border border-ivory-300 dark:border-[#303746] rounded-sm text-ink-400 dark:text-[#737B8A] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
