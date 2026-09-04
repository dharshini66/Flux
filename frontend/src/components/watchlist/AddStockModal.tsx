import React, { useState } from 'react';
import { useWatchlist } from '../../context/WatchlistContext';
import { X, Search, Plus, Check } from 'lucide-react';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStockModal: React.FC<AddStockModalProps> = ({ isOpen, onClose }) => {
  const { activeWatchlist, addStock } = useWatchlist();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [addingSymbol, setAddingSymbol] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !activeWatchlist) return null;

  const catalog = [
    { symbol: 'INFY', name: 'Infosys Limited', sector: 'Information Technology' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'Information Technology' },
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', sector: 'Energy & Retail' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', sector: 'Banking' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', sector: 'Banking' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Limited', sector: 'Automobile' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Limited', sector: 'Telecom' },
    { symbol: 'ITC', name: 'ITC Limited', sector: 'Consumer Goods' },
    { symbol: 'WIPRO', name: 'Wipro Limited', sector: 'Information Technology' },
    { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking' },
  ];

  const existingSymbols = new Set(activeWatchlist.stocks.map((s) => s.symbol));

  const filtered = catalog.filter(
    (c) =>
      c.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = async (symbol: string) => {
    try {
      setAddingSymbol(symbol);
      setErrorMsg(null);
      await addStock(activeWatchlist.id, symbol);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add stock');
    } finally {
      setAddingSymbol(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-xs">
      <div className="bg-ivory-100 border border-editorial-dark rounded-md w-full max-w-lg shadow-retro-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-ivory-200 border-b border-ivory-300">
          <div>
            <span className="text-[10px] financial-mono text-cobalt-500 font-bold uppercase tracking-wider block">
              ADD EQUITY TO WATCHLIST
            </span>
            <h3 className="editorial-headline text-xl font-bold text-ink-900">
              {activeWatchlist.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-ivory-300 text-ink-700 rounded-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-ivory-300 bg-ivory-50">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-ink-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search symbol (e.g. TCS, RELIANCE)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-ivory-300 focus:border-cobalt-500 text-xs financial-mono text-ink-900 rounded-sm outline-none"
              autoFocus
            />
          </div>
          {errorMsg && (
            <p className="text-xs financial-mono text-signal-red mt-2 font-semibold">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Stock List */}
        <div className="max-h-72 overflow-y-auto divide-y divide-ivory-300 p-2">
          {filtered.map((stock) => {
            const alreadyInWatchlist = existingSymbols.has(stock.symbol);
            return (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-2.5 hover:bg-ivory-200 rounded-sm transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs financial-mono text-ink-900">
                      {stock.symbol}
                    </span>
                    <span className="text-[10px] financial-mono text-ink-500 uppercase">
                      {stock.sector}
                    </span>
                  </div>
                  <span className="text-xs text-ink-600 block">{stock.name}</span>
                </div>

                {alreadyInWatchlist ? (
                  <span className="inline-flex items-center gap-1 text-[11px] financial-mono text-signal-green font-bold bg-green-50 border border-signal-green/20 px-2 py-0.5 rounded-sm">
                    <Check className="w-3 h-3" />
                    Added
                  </span>
                ) : (
                  <button
                    onClick={() => handleAdd(stock.symbol)}
                    disabled={addingSymbol === stock.symbol}
                    className="flex items-center gap-1 px-3 py-1 bg-cobalt-500 hover:bg-cobalt-600 text-white text-xs financial-mono font-bold uppercase rounded-sm shadow-[1.5px_1.5px_0px_#121212] transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{addingSymbol === stock.symbol ? 'Adding...' : 'Add'}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-ivory-200 border-t border-ivory-300 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-ivory-100 hover:bg-white text-ink-900 border border-ink-900 text-xs financial-mono font-bold uppercase rounded-sm shadow-[1.5px_1.5px_0px_#121212]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
