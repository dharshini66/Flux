import React, { useState } from 'react';
import { useWatchlist } from '../../context/WatchlistContext';
import { X, Plus, Trash2, Layers } from 'lucide-react';

interface ManageWatchlistsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageWatchlistsModal: React.FC<ManageWatchlistsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { watchlists, createWatchlist } = useWatchlist();
  const [newWatchlistName, setNewWatchlistName] = useState<string>('');
  const [newWatchlistDesc, setNewWatchlistDesc] = useState<string>('');
  const [creating, setCreating] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWatchlistName.trim()) return;

    try {
      setCreating(true);
      await createWatchlist(newWatchlistName.trim(), newWatchlistDesc.trim());
      setNewWatchlistName('');
      setNewWatchlistDesc('');
    } catch (err) {
      console.error('Failed to create watchlist:', err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-xs">
      <div className="bg-ivory-100 border border-editorial-dark rounded-md w-full max-w-lg shadow-retro-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-ivory-200 border-b border-ivory-300">
          <div>
            <span className="text-[10px] financial-mono text-cobalt-500 font-bold uppercase tracking-wider block">
              PORTFOLIO CONFIGURATION
            </span>
            <h3 className="editorial-headline text-xl font-bold text-ink-900">
              Manage Watchlists
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-ivory-300 text-ink-700 rounded-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Watchlists */}
        <div className="p-4 max-h-56 overflow-y-auto divide-y divide-ivory-300">
          <div className="text-[10px] financial-mono font-bold text-ink-500 uppercase tracking-wider mb-2">
            Active Watchlists ({watchlists.length})
          </div>
          {watchlists.map((wl) => (
            <div key={wl.id} className="py-2.5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-ink-900">{wl.name}</span>
                <span className="text-[11px] financial-mono text-ink-400 block">
                  {wl.stocks_count} stocks · {wl.is_default ? 'Default' : 'Custom'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Create New Watchlist Form */}
        <form onSubmit={handleCreate} className="p-4 bg-ivory-50 border-t border-ivory-300 space-y-3">
          <div className="text-[10px] financial-mono font-bold text-cobalt-500 uppercase tracking-wider">
            + CREATE NEW WATCHLIST
          </div>
          <div>
            <input
              type="text"
              placeholder="Watchlist Name (e.g. Clean Energy, High Beta)..."
              value={newWatchlistName}
              onChange={(e) => setNewWatchlistName(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-ivory-300 focus:border-cobalt-500 text-xs financial-mono text-ink-900 rounded-sm outline-none"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Optional description / strategy notes..."
              value={newWatchlistDesc}
              onChange={(e) => setNewWatchlistDesc(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-ivory-300 focus:border-cobalt-500 text-xs text-ink-900 rounded-sm outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="submit"
              disabled={creating || !newWatchlistName.trim()}
              className="px-4 py-1.5 bg-cobalt-500 hover:bg-cobalt-600 disabled:opacity-50 text-white text-xs financial-mono font-bold uppercase rounded-sm shadow-[1.5px_1.5px_0px_#121212]"
            >
              {creating ? 'Creating...' : 'Create Watchlist'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="p-3 bg-ivory-200 border-t border-ivory-300 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-ivory-100 hover:bg-white text-ink-900 border border-ink-900 text-xs financial-mono font-bold uppercase rounded-sm shadow-[1.5px_1.5px_0px_#121212]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
