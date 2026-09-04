import React, { useState, useEffect } from 'react';
import { Search, Radio, Camera, User, Bell, ChevronDown, CheckCircle2, Sun, Moon } from 'lucide-react';
import { useMarket } from '../../context/MarketContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  onSearchSelect?: (symbol: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchSelect }) => {
  const { marketStatus, activeScenario, performCheckIn, isCheckingIn, setSelectedStockSymbol } = useMarket();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
    <header className="sticky top-0 z-30 bg-ivory-100 border-b border-ivory-300 px-4 lg:px-8 py-2.5">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-cobalt-500 text-white font-extrabold flex items-center justify-center rounded-sm shadow-[1.5px_1.5px_0px_#121212] select-none text-xs financial-mono">
              FL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-xl text-ink-900 leading-none">
                  FLUX
                </span>
                <span className="text-[9px] font-bold financial-mono bg-ivory-300 text-ink-700 px-1.5 py-0.5 rounded-xs uppercase tracking-wider">
                  INTELLIGENCE
                </span>
              </div>
              <span className="text-[10px] financial-mono tracking-widest text-cobalt-600 font-bold block uppercase">
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
              className="w-full pl-9 pr-4 py-1.5 bg-ivory-200 border border-ivory-300 focus:border-cobalt-500 focus:bg-white text-xs text-ink-900 rounded-sm outline-none transition-all placeholder:text-ink-400 font-sans"
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
                    <span className="text-ink-700 font-sans">{s.name}</span>
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

        {/* Right Section: Telemetry, Snapshot Trigger, Notification & Profile */}
        <div className="flex items-center gap-3">
          {/* Baseline Captured Notification Pill */}
          {justCheckedIn && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200 flex items-center gap-1.5 px-2.5 py-1 bg-signal-green text-white text-[10px] financial-mono font-bold uppercase rounded-sm shadow-[1.5px_1.5px_0px_#121212]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>BASELINE CAPTURED · {timeStr || '09:24'} IST</span>
            </div>
          )}

          {/* Market Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-ivory-200 border border-ivory-300 rounded-sm text-xs">
            <Radio className="w-3.5 h-3.5 text-signal-green animate-pulse shrink-0" />
            <span className="font-bold text-[11px] financial-mono text-ink-800">NSE // LIVE</span>
            <span className="text-ink-400">|</span>
            <span className="text-ink-600 text-[11px] financial-mono">{timeStr || '09:45:00'} IST</span>
          </div>

          {/* Snapshot Check-In Trigger with Subtitle & Tooltip */}
          <div className="relative group">
            <button
              onClick={handleManualCheckIn}
              disabled={isCheckingIn}
              title="Capture baseline snapshot and discover new deltas since this visit"
              className={`flex items-center gap-2.5 px-3.5 py-1.5 text-xs rounded-sm border border-ink-900 transition-all ${
                justCheckedIn
                  ? 'bg-signal-green text-white shadow-[1.5px_1.5px_0px_#121212]'
                  : 'bg-cobalt-500 hover:bg-cobalt-600 text-white shadow-[2px_2px_0px_#121212] active:translate-x-0.5 active:translate-y-0.5'
              }`}
            >
              {justCheckedIn ? (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <div className="text-left flex flex-col">
                    <span className="financial-mono font-bold leading-none tracking-wide text-[11px] uppercase">
                      BASELINE CAPTURED
                    </span>
                    <span className="text-[9px] font-sans font-normal text-white/90 leading-none mt-0.5">
                      new delta point set
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <Camera className={`w-4 h-4 shrink-0 ${isCheckingIn ? 'animate-spin' : ''}`} />
                  <div className="text-left flex flex-col">
                    <span className="financial-mono font-bold leading-none tracking-wide text-[11px] uppercase">
                      CHECK IN
                    </span>
                    <span className="text-[9px] font-sans font-normal text-white/90 leading-none mt-0.5 hidden sm:inline">
                      see what's changed
                    </span>
                  </div>
                </>
              )}
            </button>
            {/* Tooltip */}
            <div className="absolute top-full right-0 mt-1.5 hidden group-hover:block z-50 bg-ink-900 text-white text-[10px] financial-mono px-2.5 py-1 rounded-sm shadow-retro whitespace-nowrap pointer-events-none">
              Freeze baseline snapshot to discover new deltas
            </div>
          </div>

          {/* Notification Bell with Pink Badge */}
          <button
            title="1 new critical market signal"
            className="relative p-2 bg-ivory-200 hover:bg-ivory-300 border border-ivory-300 rounded-sm text-ink-700 hover:text-ink-900 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-retropink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-ivory-100 financial-mono">
              1
            </span>
          </button>

          {/* Theme Toggle (Light Ivory / Dark Terminal) */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Editorial Mode' : 'Switch to Dark Terminal Mode'}
            className="relative p-2 bg-ivory-200 hover:bg-ivory-300 border border-ivory-300 rounded-sm text-ink-700 hover:text-ink-900 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-ink-700" />
            )}
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-ivory-300">
            <div className="w-7 h-7 bg-ivory-200 border border-ink-900 rounded-sm flex items-center justify-center font-bold text-xs financial-mono text-ink-900 shadow-[1px_1px_0px_#121212]">
              {user?.username?.substring(0, 2).toUpperCase() || 'KS'}
            </div>
            <div className="hidden lg:block text-left leading-tight">
              <span className="block text-xs font-bold text-ink-900 font-sans">
                {user?.full_name || 'Kavita Sharma'}
              </span>
              <span className="text-[10px] financial-mono text-cobalt-600 font-semibold">
                XP: {user?.experience_points || 320} · {user?.role || 'Lead Analyst'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
