import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverGlow = false,
  elevated = false,
  onClick,
  ...props
}) => {
  const base = elevated
    ? 'bg-[#0f1424]/90 border border-purple-500/20 shadow-xl'
    : 'bg-[#0c101d]/75 border border-slate-800/80 shadow-lg';

  const glowClass = hoverGlow
    ? 'transition-all duration-300 hover:border-purple-500/40 hover:shadow-purple-500/10 hover:-translate-y-0.5'
    : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl backdrop-blur-xl p-6 ${base} ${glowClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
export default Card;

