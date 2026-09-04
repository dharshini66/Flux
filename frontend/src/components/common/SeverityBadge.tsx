import React from 'react';
import { Severity } from '../../types';

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, className = '' }) => {
  const getStyles = () => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-retropink-500 text-white border-ink-900 shadow-[1.5px_1.5px_0px_#121212]';
      case 'HIGH':
        return 'bg-cobalt-500 text-white border-ink-900 shadow-[1.5px_1.5px_0px_#121212]';
      case 'MODERATE':
        return 'bg-signal-ochre text-white border-ink-900 shadow-[1.5px_1.5px_0px_#121212]';
      case 'NORMAL':
      default:
        return 'bg-ivory-200 text-ink-600 border-ivory-300';
    }
  };

  return (
    <span
      className={`inline-flex items-center justify-center text-[10px] financial-mono font-bold tracking-wider uppercase px-2 py-0.5 border rounded-sm ${getStyles()} ${className}`}
    >
      {severity === 'CRITICAL' ? 'CRITICAL' : severity === 'HIGH' ? 'HIGH IMPACT' : severity}
    </span>
  );
};
