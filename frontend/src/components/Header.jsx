import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Bell, Search, Sparkles, Plus, Terminal } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';
import { useAuth } from '../context/AuthContext';

export const Header = ({ title = 'Dashboard', subtitle = 'Welcome back to your preparation center' }) => {
  const { user } = useAuth();

  return (
    <header className="px-6 py-4 border-b border-slate-800/80 bg-[#080b14]/70 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>{title}</span>
          <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-purple-500" />
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick status pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/20 text-xs text-purple-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>AI Interview Engine Online</span>
        </div>

        {/* Action Button: Start Practice */}
        <Link to="/interview">
          <Button size="sm" variant="primary" icon={Zap}>
            Start Interview
          </Button>
        </Link>
      </div>
    </header>
  );
};
export default Header;

