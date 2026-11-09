import React from 'react';

export const ScoreGauge = ({
  score = 85,
  size = 120,
  strokeWidth = 10,
  label = 'Score',
  subtext = '',
  colorGradient = 'purpleBlue',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const gradientIds = {
    purpleBlue: 'grad-purple-blue',
    cyanBlue: 'grad-cyan-blue',
    emerald: 'grad-emerald',
  };

  const getScoreColorText = (s) => {
    if (s >= 85) return 'text-purple-400';
    if (s >= 70) return 'text-blue-400';
    return 'text-amber-400';
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="w-full h-full -rotate-90 transform"
          viewBox={`0 0 ${size} ${size}`}
        >
          <defs>
            <linearGradient id="grad-purple-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="grad-cyan-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientIds[colorGradient] || gradientIds.purpleBlue})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-bold tracking-tight ${getScoreColorText(score)}`} style={{ fontSize: size * 0.25 }}>
            {score}
            <span className="text-xs text-slate-400 font-normal ml-0.5">%</span>
          </span>
          {label && (
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider -mt-1">
              {label}
            </span>
          )}
        </div>
      </div>
      {subtext && (
        <span className="text-xs text-slate-400 mt-2 text-center font-medium">
          {subtext}
        </span>
      )}
    </div>
  );
};
export default ScoreGauge;

