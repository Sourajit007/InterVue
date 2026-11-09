import React from 'react';

export const Badge = ({
  children,
  variant = 'purple',
  size = 'md',
  className = '',
  icon: Icon,
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  const variants = {
    purple: 'bg-purple-500/10 text-purple-300 border border-purple-500/30',
    blue: 'bg-blue-500/10 text-blue-300 border border-blue-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30',
    green: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-300 border border-amber-500/30',
    red: 'bg-rose-500/10 text-rose-300 border border-rose-500/30',
    neutral: 'bg-slate-800/80 text-slate-300 border border-slate-700/50',
    gradient: 'bg-gradient-to-r from-purple-500/15 to-blue-500/15 text-purple-200 border border-purple-500/30 shadow-sm shadow-purple-500/10',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizeStyles[size]} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
};
export default Badge;

