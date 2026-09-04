import React from 'react';
import { Severity } from '../../types';

interface SignalStrengthMeterProps {
  level: number; // 1 to 5
  severity: Severity;
  showText?: boolean;
}

export const SignalStrengthMeter: React.FC<SignalStrengthMeterProps> = ({
  level,
  severity,
  showText = true,
}) => {
  const getDotColor = (index: number) => {
    if (index >= level) return 'text-ink-200';
    if (severity === 'CRITICAL') return 'text-retropink-500';
    if (severity === 'HIGH') return 'text-cobalt-500';
    if (severity === 'MODERATE') return 'text-signal-ochre';
    return 'text-ink-600';
  };

  return (
    <div className="inline-flex items-center gap-1.5 financial-mono text-xs">
      <div className="flex gap-0.5 text-sm tracking-tighter select-none">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={`transition-colors duration-150 ${getDotColor(i)}`}>
            ●
          </span>
        ))}
      </div>
      {showText && (
        <span className="text-[11px] font-semibold text-ink-600 uppercase tracking-wider ml-1">
          {severity === 'CRITICAL' ? 'CRITICAL FLUX' : `${severity} FLUX`}
        </span>
      )}
    </div>
  );
};
