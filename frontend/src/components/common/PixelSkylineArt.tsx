import React from 'react';

interface PixelSkylineArtProps {
  className?: string;
}

export const PixelSkylineArt: React.FC<PixelSkylineArtProps> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden rounded-md border border-ivory-300 dark:border-[#303746] bg-ivory-100 dark:bg-[#12151D] p-2 transition-colors ${className}`}>
      <svg
        viewBox="0 0 320 120"
        className="w-full h-auto select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        {/* Background Sky & Warm Dusk / Night Gradient */}
        <rect width="320" height="120" className="fill-[#F3EFE5] dark:fill-[#10131A]" />
        <rect y="0" width="320" height="40" className="fill-[#EBE4D5] dark:fill-[#181E2A]" opacity="0.6" />

        {/* Pixel Clouds */}
        <rect x="30" y="16" width="32" height="6" className="fill-white dark:fill-[#303B4F]" opacity="0.8" />
        <rect x="36" y="12" width="20" height="4" className="fill-white dark:fill-[#303B4F]" opacity="0.8" />
        <rect x="220" y="22" width="40" height="6" className="fill-white dark:fill-[#303B4F]" opacity="0.8" />
        <rect x="230" y="18" width="24" height="4" className="fill-white dark:fill-[#303B4F]" opacity="0.8" />

        {/* Distant Skyline (Cobalt & Soft Purple Tones) */}
        <rect x="20" y="44" width="24" height="60" className="fill-[#D2C8B4] dark:fill-[#1F2636]" />
        <rect x="52" y="32" width="36" height="72" className="fill-[#C5BAA2] dark:fill-[#262E40]" />
        <rect x="96" y="48" width="20" height="56" className="fill-[#D2C8B4] dark:fill-[#1F2636]" />
        <rect x="124" y="28" width="44" height="76" className="fill-[#B8AD94] dark:fill-[#2A3449]" />
        <rect x="176" y="38" width="32" height="66" className="fill-[#C5BAA2] dark:fill-[#262E40]" />
        <rect x="216" y="24" width="48" height="80" className="fill-[#B8AD94] dark:fill-[#2A3449]" />
        <rect x="272" y="42" width="30" height="62" className="fill-[#D2C8B4] dark:fill-[#1F2636]" />

        {/* Midground Skyline Buildings (Ink & Cobalt Accents) */}
        <rect x="38" y="56" width="28" height="50" fill="#1746D1" opacity="0.85" />
        <rect x="42" y="62" width="4" height="6" className="fill-[#FAF8F3] dark:fill-[#E85AA5]" />
        <rect x="50" y="62" width="4" height="6" className="fill-[#FAF8F3] dark:fill-[#4C72FF]" />
        <rect x="42" y="74" width="4" height="6" className="fill-[#FAF8F3] dark:fill-[#4C72FF]" />
        <rect x="50" y="74" width="4" height="6" className="fill-[#FAF8F3] dark:fill-[#E85AA5]" />

        {/* Tower with Signal Antenna */}
        <rect x="140" y="40" width="30" height="66" className="fill-[#121212] dark:fill-[#181F2C]" />
        <rect x="154" y="20" width="2" height="20" className="fill-[#121212] dark:fill-[#4C72FF]" />
        <rect x="153" y="18" width="4" height="2" fill="#E85AA5" />
        {/* Glowing Signal Blip */}
        <rect x="152" y="16" width="6" height="2" fill="#E85AA5" opacity="0.9" />

        {/* Window Grid Lights on Tower */}
        <rect x="146" y="48" width="4" height="6" fill="#E85AA5" />
        <rect x="158" y="48" width="4" height="6" fill="#1746D1" />
        <rect x="146" y="60" width="4" height="6" className="fill-[#FAF8F3] dark:fill-[#8A78E8]" />
        <rect x="158" y="60" width="4" height="6" fill="#E85AA5" />
        <rect x="146" y="72" width="4" height="6" fill="#1746D1" />
        <rect x="158" y="72" width="4" height="6" className="fill-[#FAF8F3] dark:fill-[#4C72FF]" />

        {/* Exchange Spire */}
        <rect x="232" y="36" width="32" height="70" className="fill-[#1746D1] dark:fill-[#1F3366]" />
        <rect x="238" y="44" width="6" height="8" className="fill-[#FAF8F3] dark:fill-[#E85AA5]" />
        <rect x="250" y="44" width="6" height="8" className="fill-[#FAF8F3] dark:fill-[#8A78E8]" />
        <rect x="238" y="58" width="6" height="8" className="fill-[#FAF8F3] dark:fill-[#4C72FF]" />
        <rect x="250" y="58" width="6" height="8" className="fill-[#FAF8F3] dark:fill-[#E85AA5]" />

        {/* Foreground Rooftop Platform */}
        <rect x="0" y="96" width="320" height="24" className="fill-[#121212] dark:fill-[#0C0E14]" />
        <rect x="0" y="94" width="320" height="2" fill="#1746D1" />

        {/* Rooftop Railing */}
        <rect x="6" y="86" width="2" height="10" className="fill-[#4A4A4A] dark:fill-[#303746]" />
        <rect x="22" y="86" width="2" height="10" className="fill-[#4A4A4A] dark:fill-[#303746]" />
        <rect x="38" y="86" width="2" height="10" className="fill-[#4A4A4A] dark:fill-[#303746]" />
        <rect x="54" y="86" width="2" height="10" className="fill-[#4A4A4A] dark:fill-[#303746]" />
        <rect x="6" y="86" width="50" height="2" className="fill-[#4A4A4A] dark:fill-[#303746]" />

        {/* Pixel Character Sitting on Rooftop Edge */}
        {/* Head & Cap */}
        <rect x="80" y="72" width="8" height="6" fill="#E85AA5" />
        <rect x="78" y="74" width="10" height="4" fill="#1746D1" />
        {/* Face */}
        <rect x="82" y="76" width="6" height="4" className="fill-[#F3EFE5] dark:fill-[#E0D8C8]" />
        {/* Jacket/Body */}
        <rect x="78" y="80" width="10" height="10" fill="#1746D1" />
        {/* Legs dangling over edge */}
        <rect x="84" y="90" width="4" height="10" className="fill-[#121212] dark:fill-[#0C0E14]" />
        <rect x="86" y="98" width="4" height="4" fill="#E85AA5" />

        {/* Laptop / Terminal Glow */}
        <rect x="74" y="82" width="6" height="4" className="fill-[#FAF8F3] dark:fill-[#4C72FF]" />
        <rect x="72" y="80" width="8" height="2" fill="#E85AA5" />

        {/* Retro Grid Scanlines on Bottom */}
        <rect x="0" y="112" width="320" height="1" className="fill-[#2A2A2A] dark:fill-[#1E2433]" />
        <rect x="0" y="116" width="320" height="1" className="fill-[#2A2A2A] dark:fill-[#1E2433]" />
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
