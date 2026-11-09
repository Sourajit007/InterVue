import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Bot, ArrowRight, Menu, X, Shield, Terminal, Zap } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const isPublicPage = location.pathname === '/' || location.pathname === '/auth';

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#080b14]/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 p-0.5 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform duration-200" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                InterVue<span className="text-purple-400">.ai</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider font-semibold -mt-1 uppercase">
                AI Interview Prep
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link
              to="/"
              className={`hover:text-purple-400 transition-colors ${
                location.pathname === '/' ? 'text-purple-400' : ''
              }`}
            >
              Overview
            </Link>
            <Link
              to="/dashboard"
              className={`hover:text-purple-400 transition-colors ${
                location.pathname.startsWith('/dashboard') ? 'text-purple-400' : ''
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/resume-upload"
              className={`hover:text-purple-400 transition-colors ${
                location.pathname.startsWith('/resume') ? 'text-purple-400' : ''
              }`}
            >
              Upload Resume
            </Link>
            <Link
              to="/interview-setup"
              className={`hover:text-purple-400 transition-colors ${
                location.pathname.startsWith('/interview') ? 'text-purple-400' : ''
              }`}
            >
              Mock Interview
            </Link>
            <Link
              to="/report"
              className={`hover:text-purple-400 transition-colors ${
                location.pathname.startsWith('/report') ? 'text-purple-400' : ''
              }`}
            >
              Reports
            </Link>
          </div>

          {/* Action CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors">
                    <img
                      src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                      alt={user?.name || "User"}
                      className="w-7 h-7 rounded-full object-cover border border-purple-500/40"
                    />
                    <span className="text-xs font-semibold text-slate-200">
                      {user?.name || 'Alex'}
                    </span>
                  </div>
                </Link>
                <Link to="/interview-setup">
                  <Button size="sm" variant="primary" icon={Zap}>
                    Practice Now
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?mode=register">
                  <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0c101d] px-4 pt-3 pb-5 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-purple-950/30"
          >
            Overview
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-purple-950/30"
          >
            Dashboard
          </Link>
          <Link
            to="/resume-upload"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-purple-950/30"
          >
            Upload Resume
          </Link>
          <Link
            to="/interview-setup"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-purple-950/30"
          >
            AI Interview Room
          </Link>
          <Link
            to="/report"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-purple-950/30"
          >
            Performance Reports
          </Link>
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full">
                  Sign In / Register
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;

