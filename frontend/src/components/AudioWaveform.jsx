import React from 'react';

export const AudioWaveform = ({ isActive = false, color = 'purple', count = 18 }) => {
  const bars = Array.from({ length: count });

  const colorMap = {
    purple: 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]',
    blue: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]',
    cyan: 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]',
  };

  return (
    <div className="flex items-center justify-center gap-1.5 h-10 px-4">
      {bars.map((_, i) => {
        // Pseudo-random height animation delay
        const delay = (i * 0.08) % 1;
        const defaultHeight = isActive ? 'h-7' : 'h-2';

        return (
          <span
            key={i}
            className={`w-1 rounded-full transition-all duration-300 ${colorMap[color] || colorMap.purple} ${
              isActive ? 'animate-wave' : 'opacity-30'
            }`}
            style={{
              animationDelay: `${delay}s`,
              animationDuration: `${0.8 + ((i % 4) * 0.25)}s`,
              height: isActive ? `${Math.max(20, Math.sin(i) * 32 + 10)}px` : '6px',
            }}
          />
        );
      })}
    </div>
  );
};
export default AudioWaveform;

