import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileUp,
  FileCheck2,
  Video,
  BarChart3,
  Bot,
  LogOut,
  Sparkles,
  Zap,
  Target,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import Badge from './Badge';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { resumeData } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/resume-upload',
      label: 'Upload Resume',
      icon: FileUp,
      badge: null,
    },
    {
      to: '/resume-analysis',
      label: 'Resume Analysis',
      icon: FileCheck2,
      badge: `${resumeData?.overallAtsScore || 88}% ATS`,
      badgeVariant: 'purple',
    },
    {
      to: '/interview-setup',
      label: 'AI Interview Room',
      icon: Video,
      badge: 'Live',
      badgeVariant: 'blue',
    },
    {
      to: '/report',
      label: 'Performance Report',
      icon: BarChart3,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#0a0e1c] border-r border-slate-800/80 flex flex-col justify-between h-[calc(100vh-4.5rem)] sticky top-[4.5rem]">
      {/* Top Nav links */}
      <div className="p-4 space-y-6">
        {/* User preview widget */}
        <div className="p-3.5 rounded-xl bg-[#0f152a] border border-purple-500/20 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-purple-600/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={user?.name || "Candidate"}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/40"
            />
            <div className="overflow-hidden">
              <h3 className="text-sm font-semibold text-white truncate">
                {user?.name || 'Alex Rivera'}
              </h3>
              <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                <Target className="w-3 h-3 text-purple-400 shrink-0" />
                <span>{user?.targetRole || 'Full Stack Engineer'}</span>
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Readiness Score</span>
            <span className="font-bold text-purple-400">{user?.readinessScore || 86}%</span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/10 text-white border border-purple-500/30 shadow-sm shadow-purple-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-purple-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge variant={item.badgeVariant || 'purple'} size="sm">
                    {item.badge}
                  </Badge>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Bottom Promo & Sign out */}
      <div className="p-4 space-y-3">
        {/* Gemini Pro Callout */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-950/40 to-blue-950/30 border border-purple-500/20 text-xs">
          <div className="flex items-center gap-1.5 text-purple-300 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Gemini 2.0 Flash</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Real-time audio evaluation and semantic feedback model active.
          </p>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;

