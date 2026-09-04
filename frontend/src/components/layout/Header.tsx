import React, { useState, useEffect } from 'react';
import { Search, Radio, Camera, User, Bell, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useMarket } from '../../context/MarketContext';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onSearchSelect?: (symbol: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchSelect }) => {
  const { marketStatus, activeScenario, performCheckIn, isCheckingIn, setSelectedStockSymbol } = useMarket();
  const { user } = useAuth();
  const [timeStr, setTimeStr] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [justCheckedIn, setJustCheckedIn] = useState<boolean>(false);

  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      setTimeStr(
        d.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleManualCheckIn = async () => {
    await performCheckIn(false);
    setJustCheckedIn(true);
    setTimeout(() => setJustCheckedIn(false), 3000);
  };

  const searchableStocks = [
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

  const filteredStocks = searchableStocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-30 bg-ivory-100 border-b border-ivory-300 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-cobalt-500 text-white font-bold flex items-center justify-center rounded-sm shadow-[1.5px_1.5px_0px_#121212] select-none text-xs financial-mono">
              SG
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg text-ink-900 leading-none">
                  FLUX
                </span>
                <span className="text-[9px] font-bold financial-mono bg-ivory-300 text-ink-700 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                  INTELLIGENCE
                </span>
              </div>
              <span className="text-[10px] financial-mono tracking-widest text-cobalt-500 font-semibold block uppercase">
                KNOW WHAT CHANGED.
              </span>
            </div>
          </div>
        </div>

        {/* Global Stock Search */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-ink-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search equity symbol or company (e.g. INFY, TCS)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              className="w-full pl-9 pr-4 py-1.5 bg-ivory-200 border border-ivory-300 focus:border-cobalt-500 focus:bg-white text-xs text-ink-900 rounded-sm outline-none transition-all placeholder:text-ink-400 financial-mono"
            />
          </div>

          {/* Search Dropdown */}
          {searchOpen && searchQuery && (
            <div
              className="absolute left-0 right-0 top-full mt-1 bg-ivory-50 border border-editorial-dark rounded-sm shadow-retro-lg z-50 max-h-64 overflow-y-auto"
              onMouseLeave={() => setSearchOpen(false)}
            >
              {filteredStocks.map((s) => (
                <button
                  key={s.symbol}
                  onClick={() => {
                    setSelectedStockSymbol(s.symbol);
                    setSearchQuery('');
                    setSearchOpen(false);
                    if (onSearchSelect) onSearchSelect(s.symbol);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-ivory-200 border-b border-ivory-300 last:border-b-0 flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <span className="font-bold financial-mono text-ink-900 mr-2">{s.symbol}</span>
                    <span className="text-ink-600">{s.name}</span>
                  </div>
                  <span className="text-[10px] financial-mono text-ink-400 uppercase">{s.sector}</span>
                </button>
              ))}
              {filteredStocks.length === 0 && (
                <div className="p-3 text-xs text-ink-400 text-center financial-mono">
                  No matching equities found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section: Telemetry, Snapshot Trigger & Profile */}
        <div className="flex items-center gap-3">
          
          {/* Market Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-ivory-200 border border-ivory-300 rounded-sm text-xs financial-mono">
            <Radio className="w-3.5 h-3.5 text-signal-green animate-pulse" />
            <span className="font-bold text-[11px] text-ink-700">NSE // LIVE</span>
            <span className="text-ink-400">|</span>
            <span className="text-ink-600 text-[11px]">{timeStr || '09:45:00'} IST</span>
          </div>

          {/* Snapshot Check-In Trigger */}
          <button
            onClick={handleManualCheckIn}
            disabled={isCheckingIn}
            title="Freeze baseline snapshot and discover new deltas since this visit"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs financial-mono font-bold uppercase rounded-sm border border-ink-900 transition-all ${
              justCheckedIn
                ? 'bg-signal-green text-white shadow-[1.5px_1.5px_0px_#121212]'
                : 'bg-cobalt-500 hover:bg-cobalt-600 text-white shadow-[2px_2px_0px_#121212] active:translate-x-0.5 active:translate-y-0.5'
            }`}
          >
            {justCheckedIn ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Captured</span>
              </>
            ) : (
              <>
                <Camera className={`w-3.5 h-3.5 ${isCheckingIn ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline">Check In</span>
              </>
            )}
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-ivory-300">
            <div className="w-7 h-7 bg-ivory-200 border border-ink-900 rounded-sm flex items-center justify-center font-bold text-xs financial-mono text-ink-900 shadow-[1px_1px_0px_#121212]">
              {user?.username?.substring(0, 2).toUpperCase() || 'AN'}
            </div>
            <div className="hidden lg:block text-left leading-tight">
              <span className="block text-xs font-bold text-ink-900">
                {user?.full_name || 'Kavita Sharma'}
              </span>
              <span className="text-[10px] financial-mono text-cobalt-500 font-semibold">
                XP: {user?.experience_points || 120} · {user?.role || 'Lead Analyst'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
