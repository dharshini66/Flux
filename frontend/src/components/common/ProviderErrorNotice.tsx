import React from 'react';
import { AlertOctagon } from 'lucide-react';

interface ProviderErrorNoticeProps {
  symbol: string;
  errorMessage?: string | null;
}

export const ProviderErrorNotice: React.FC<ProviderErrorNoticeProps> = ({ symbol, errorMessage }) => {
  return (
    <div className="bg-red-50 border border-signal-red/40 rounded px-2.5 py-1.5 flex items-center gap-2 text-xs">
      <AlertOctagon className="w-3.5 h-3.5 text-signal-red shrink-0" />
      <div className="flex-1 overflow-hidden">
        <span className="font-bold financial-mono text-signal-red uppercase text-[10px]">
          DATA UNAVAILABLE FOR {symbol}
        </span>
        <p className="text-[11px] text-ink-600 truncate">
          {errorMessage || 'Primary gateway timed out. Dashboard isolated to protect integrity.'}
        </p>
      </div>
    </div>
  );
};
