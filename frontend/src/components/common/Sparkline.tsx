import React from 'react';

interface SparklineProps {
  data?: number[];
  isPositive: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  isPositive,
  width = 68,
  height = 24,
  className = '',
}) => {
  // Generate deterministic synthetic path points if array not provided
  const points = data && data.length > 0 ? data : isPositive ? [10, 12, 11, 15, 14, 18, 17, 22] : [22, 19, 20, 16, 17, 13, 14, 10];

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const padding = 2;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  const svgPoints = points
    .map((val, idx) => {
      const x = padding + (idx / (points.length - 1)) * innerWidth;
      const y = height - padding - ((val - min) / range) * innerHeight;
      return `${x},${y}`;
    })
    .join(' ');

  const strokeColor = isPositive ? 'rgb(var(--color-signal-green))' : 'rgb(var(--color-signal-red))';
  const fillColor = isPositive ? 'rgb(var(--color-signal-green) / 0.12)' : 'rgb(var(--color-signal-red) / 0.12)';

  // Closed area path
  const firstX = padding;
  const lastX = width - padding;
  const areaPath = `M ${firstX},${height} L ${svgPoints.split(' ')[0]} ${svgPoints} L ${lastX},${height} Z`;

  return (
    <svg width={width} height={height} className={`overflow-visible ${className}`}>
      <path d={areaPath} fill={fillColor} />
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={svgPoints}
      />
    </svg>
  );
};
