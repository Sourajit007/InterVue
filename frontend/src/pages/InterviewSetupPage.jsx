import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Code2,
  Layers,
  ChevronRight,
  Sparkles,
  BookOpen,
  Target,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { useApp } from '../context/AppContext';

const DIFFICULTY_OPTIONS = [
  {
    id: 'Beginner',
    label: 'Beginner',
    icon: BookOpen,
    color: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/40',
    activeBorder: 'border-emerald-400',
    glow: 'shadow-emerald-500/20',
    badge: 'cyan',
    description: 'Foundation concepts, basic implementations, and introductory system design.',
    tags: ['Core Concepts', 'Basic APIs', 'STAR Intro'],
    suitable: 'Fresh Grads · Juniors · Career Switchers',
  },
  {
    id: 'Intermediate',
    label: 'Intermediate',
    icon: Layers,
    color: 'from-blue-500/20 to-indigo-500/10',
    border: 'border-blue-500/40',
    activeBorder: 'border-blue-400',
    glow: 'shadow-blue-500/20',
    badge: 'blue',
    description: 'Architecture decisions, optimization trade-offs, and practical project deep-dives.',
    tags: ['Architecture', 'Trade-offs', 'Project Deep-Dive'],
    suitable: '1–4 yrs Experience · Mid-Level Engineers',
    recommended: true,
  },
  {
    id: 'Advanced',
    label: 'Advanced',
    icon: Zap,
    color: 'from-purple-500/20 to-violet-500/10',
    border: 'border-purple-500/40',
    activeBorder: 'border-purple-400',
    glow: 'shadow-purple-500/20',
    badge: 'purple',
    description: 'Internals, distributed systems, production incidents, and executive leadership.',
    tags: ['System Internals', 'Distributed Systems', 'Leadership'],
    suitable: '5+ yrs Experience · Senior / Staff Engineers',
  },
];

const InterviewSetupPage = () => {
  const { resumeData, generateInterview } = useApp();
  const navigate = useNavigate();

  const [selected, setSelected] = useState('Intermediate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    setLoading(true);
    setError('');
    try {
      await generateInterview(selected);
      navigate('/interview');
    } catch (err) {
      setError('Failed to generate questions. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedOption = DIFFICULTY_OPTIONS.find((o) => o.id === selected);

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#070a14] text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Personalised Interview
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Choose Your Difficulty
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            5 personalised questions will be generated from your resume — 2 Technical, 2 Project-based, and 1 Behavioural.
          </p>
        </div>

        {/* Resume Context Chip */}
        {resumeData?.candidateName && (
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <Target className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
              <span className="font-medium">{resumeData.candidateName}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">{resumeData.targetRole || 'Full Stack Engineer'}</span>
            </div>
            {resumeData?.skills?.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] text-slate-300"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Difficulty Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {DIFFICULTY_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isActive = selected === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`relative text-left p-5 rounded-2xl border bg-gradient-to-br transition-all duration-200 ${opt.color} ${
                  isActive
                    ? `${opt.activeBorder} shadow-lg ${opt.glow}`
                    : `${opt.border} hover:border-slate-600`
                }`}
              >
                {opt.recommended && (
                  <span className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full bg-blue-600 text-[10px] font-bold text-white tracking-wide">
                    RECOMMENDED
                  </span>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-white/10' : 'bg-slate-800/60'}`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  </div>
                  {isActive && (
                    <div className="w-5 h-5 rounded-full bg-white/20 border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>

                <h3 className={`font-bold text-base mb-1 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {opt.label}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{opt.description}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {opt.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 rounded-md bg-black/30 border border-white/10 text-[10px] text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-[10px] text-slate-500 font-medium">{opt.suitable}</p>
              </button>
            );
          })}
        </div>

        {/* Question Type Preview */}
        <div className="p-4 rounded-2xl bg-[#0b0f1d] border border-slate-800 space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Your 5-Question Session Preview
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {[
              { n: 1, type: 'Technical', color: 'bg-purple-500/15 border-purple-500/30 text-purple-300', label: 'Technical #1' },
              { n: 2, type: 'Technical', color: 'bg-purple-500/15 border-purple-500/30 text-purple-300', label: 'Technical #2' },
              { n: 3, type: 'Project', color: 'bg-blue-500/15 border-blue-500/30 text-blue-300', label: 'Project #1' },
              { n: 4, type: 'Project', color: 'bg-blue-500/15 border-blue-500/30 text-blue-300', label: 'Project #2' },
              { n: 5, type: 'HR', color: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300', label: 'Behavioural' },
            ].map((q) => (
              <div
                key={q.n}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center ${q.color}`}
              >
                <span className="text-[10px] font-bold opacity-60 mb-1">Q{q.n}</span>
                <span className="text-[11px] font-semibold">{q.label}</span>
                <span className="text-[10px] opacity-50 mt-0.5">{selected}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto"
          >
            ← Back to Dashboard
          </Button>

          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full sm:flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Questions…
              </>
            ) : (
              <>
                <Code2 className="w-4 h-4" />
                Start {selected} Interview
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        <p className="text-center text-[11px] text-slate-600">
          Questions are personalised from your uploaded resume · Webcam permission requested on start
        </p>
      </div>
    </div>
  );
};

export default InterviewSetupPage;

