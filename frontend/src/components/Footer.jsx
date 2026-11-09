import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Sparkles, Heart, Github, Twitter, Linkedin, Terminal } from 'lucide-react';
import Badge from './Badge';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#06080f] text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 p-0.5">
                <div className="w-full h-full bg-[#090d16] rounded-[6px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <span className="font-bold text-lg text-white">
                InterVue<span className="text-purple-400">.ai</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Next-generation AI mock interview platform powered by Gemini API. Tailored questions, ATS resume feedback, and real-time verbal evaluation.
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="purple" size="sm">
                MERN Stack
              </Badge>
              <Badge variant="blue" size="sm">
                Gemini 2.0
              </Badge>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/interview" className="hover:text-purple-400 transition-colors">
                  AI Mock Interview
                </Link>
              </li>
              <li>
                <Link to="/resume-upload" className="hover:text-purple-400 transition-colors">
                  Resume ATS Scanner
                </Link>
              </li>
              <li>
                <Link to="/resume-analysis" className="hover:text-purple-400 transition-colors">
                  Skill Gap Analysis
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-purple-400 transition-colors">
                  Performance Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Interview Tracks
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-purple-400 transition-colors cursor-pointer">
                Full Stack MERN Developer
              </li>
              <li className="hover:text-purple-400 transition-colors cursor-pointer">
                React Frontend Specialist
              </li>
              <li className="hover:text-purple-400 transition-colors cursor-pointer">
                Node.js & Backend Architecture
              </li>
              <li className="hover:text-purple-400 transition-colors cursor-pointer">
                System Design & Microservices
              </li>
            </ul>
          </div>

          {/* Tech & Security */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Security & Stack
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Enterprise-grade JWT authentication, local model sandbox testing, and zero-retention voice privacy.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="#" className="p-2 rounded-lg bg-slate-800/40 hover:text-white hover:bg-slate-800 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800/40 hover:text-white hover:bg-slate-800 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800/40 hover:text-white hover:bg-slate-800 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} InterVue AI Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Status</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;

