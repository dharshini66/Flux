import React from 'react';

interface PixelSkylineArtProps {
  className?: string;
}

export const PixelSkylineArt: React.FC<PixelSkylineArtProps> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden rounded-md border border-ivory-300 bg-ivory-100 p-2 ${className}`}>
      <svg
        viewBox="0 0 320 120"
        className="w-full h-auto select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        {/* Background Sky & Warm Dusk Gradient */}
        <rect width="320" height="120" fill="#F3EFE5" />
        <rect y="0" width="320" height="40" fill="#EBE4D5" opacity="0.6" />

        {/* Pixel Clouds */}
        <rect x="30" y="16" width="32" height="6" fill="#FFFFFF" opacity="0.8" />
        <rect x="36" y="12" width="20" height="4" fill="#FFFFFF" opacity="0.8" />
        <rect x="220" y="22" width="40" height="6" fill="#FFFFFF" opacity="0.8" />
        <rect x="230" y="18" width="24" height="4" fill="#FFFFFF" opacity="0.8" />

        {/* Distant Skyline (Cobalt & Soft Purple Tones) */}
        <rect x="20" y="44" width="24" height="60" fill="#D2C8B4" />
        <rect x="52" y="32" width="36" height="72" fill="#C5BAA2" />
        <rect x="96" y="48" width="20" height="56" fill="#D2C8B4" />
        <rect x="124" y="28" width="44" height="76" fill="#B8AD94" />
        <rect x="176" y="38" width="32" height="66" fill="#C5BAA2" />
        <rect x="216" y="24" width="48" height="80" fill="#B8AD94" />
        <rect x="272" y="42" width="30" height="62" fill="#D2C8B4" />

        {/* Midground Skyline Buildings (Ink & Cobalt Accents) */}
        <rect x="38" y="56" width="28" height="50" fill="#1746D1" opacity="0.85" />
        <rect x="42" y="62" width="4" height="6" fill="#FAF8F3" />
        <rect x="50" y="62" width="4" height="6" fill="#FAF8F3" />
        <rect x="42" y="74" width="4" height="6" fill="#FAF8F3" />
        <rect x="50" y="74" width="4" height="6" fill="#FAF8F3" />

        {/* Tower with Signal Antenna */}
        <rect x="140" y="40" width="30" height="66" fill="#121212" />
        <rect x="154" y="20" width="2" height="20" fill="#121212" />
        <rect x="153" y="18" width="4" height="2" fill="#E85AA5" />
        {/* Glowing Signal Blip */}
        <rect x="152" y="16" width="6" height="2" fill="#E85AA5" opacity="0.8" />

        {/* Window Grid Lights on Tower */}
        <rect x="146" y="48" width="4" height="6" fill="#E85AA5" />
        <rect x="158" y="48" width="4" height="6" fill="#1746D1" />
        <rect x="146" y="60" width="4" height="6" fill="#FAF8F3" />
        <rect x="158" y="60" width="4" height="6" fill="#E85AA5" />
        <rect x="146" y="72" width="4" height="6" fill="#1746D1" />
        <rect x="158" y="72" width="4" height="6" fill="#FAF8F3" />

        {/* Exchange Spire */}
        <rect x="232" y="36" width="32" height="70" fill="#1746D1" />
        <rect x="238" y="44" width="6" height="8" fill="#FAF8F3" />
        <rect x="250" y="44" width="6" height="8" fill="#FAF8F3" />
        <rect x="238" y="58" width="6" height="8" fill="#FAF8F3" />
        <rect x="250" y="58" width="6" height="8" fill="#FAF8F3" />

        {/* Foreground Rooftop Platform */}
        <rect x="0" y="96" width="320" height="24" fill="#121212" />
        <rect x="0" y="94" width="320" height="2" fill="#1746D1" />

        {/* Rooftop Railing */}
        <rect x="6" y="86" width="2" height="10" fill="#4A4A4A" />
        <rect x="22" y="86" width="2" height="10" fill="#4A4A4A" />
        <rect x="38" y="86" width="2" height="10" fill="#4A4A4A" />
        <rect x="54" y="86" width="2" height="10" fill="#4A4A4A" />
        <rect x="6" y="86" width="50" height="2" fill="#4A4A4A" />

        {/* Pixel Character Sitting on Rooftop Edge */}
        {/* Head & Cap */}
        <rect x="80" y="72" width="8" height="6" fill="#E85AA5" />
        <rect x="78" y="74" width="10" height="4" fill="#1746D1" />
        {/* Face */}
        <rect x="82" y="76" width="6" height="4" fill="#F3EFE5" />
        {/* Jacket/Body */}
        <rect x="78" y="80" width="10" height="10" fill="#1746D1" />
        {/* Legs dangling over edge */}
        <rect x="84" y="90" width="4" height="10" fill="#121212" />
        <rect x="86" y="98" width="4" height="4" fill="#E85AA5" />

        {/* Laptop / Terminal Glow */}
        <rect x="74" y="82" width="6" height="4" fill="#FAF8F3" />
        <rect x="72" y="80" width="8" height="2" fill="#E85AA5" />

        {/* Retro Grid Scanlines on Bottom */}
        <rect x="0" y="112" width="320" height="1" fill="#2A2A2A" />
        <rect x="0" y="116" width="320" height="1" fill="#2A2A2A" />
      </svg>
      <div className="flex items-center justify-between mt-1 px-1">
        <span className="text-[10px] financial-mono font-bold text-ink-700 tracking-wider">
          "A CALMER WAY TO WATCH THE MARKETS." <span className="text-cobalt-600">— FLUX</span>
        </span>
        <span className="inline-flex items-center gap-1 text-[9px] financial-mono text-cobalt-500 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-signal-green animate-pulse"></span>
          REAL-TIME
        </span>
      </div>
    </div>
  );
};
