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
  Briefcase,
  Clock,
  CheckCircle2,
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
    description: 'Foundation concepts, terminology, and core situational scenarios.',
    tags: ['Core Concepts', 'Basic Scenarios', 'STAR Intro'],
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
    description: 'Problem-solving trade-offs, variance investigation, and project execution.',
    tags: ['Applied Knowledge', 'Trade-offs', 'Project Deep-Dive'],
    suitable: '1–4 yrs Experience · Mid-Level Specialists',
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
    description: 'Executive strategy, crisis leadership, risk mitigation, and scaling.',
    tags: ['Strategic Depth', 'Risk Mitigation', 'Leadership'],
    suitable: '5+ yrs Experience · Senior Specialists / Leads',
  },
];

const EXPERIENCE_LEVELS = [
  'Beginner / Fresher (0 years)',
  'Intermediate (1–3 years)',
  'Experienced (3–5 years)',
  'Senior (5+ years)',
];

const COMMON_ROLE_SUGGESTIONS = [
  'English Teacher',
  'Accountant',
  'MERN Stack Developer',
  'HR Manager',
  'Marketing Executive',
  'Mechanical Engineer',
];

export const InterviewSetupPage = () => {
  const { resumeData, generateInterview } = useApp();
  const navigate = useNavigate();

  // Dynamic role initialized from resume if available or default
  const suggestedRole = resumeData?.targetRole || resumeData?.professionalDomain || 'Software Developer';
  const [targetRole, setTargetRole] = useState(suggestedRole);
  const [experienceLevel, setExperienceLevel] = useState('Intermediate (1–3 years)');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Intermediate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    if (!targetRole.trim()) {
      setError('Please enter or select a target job role.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await generateInterview(selectedDifficulty, {
        role: targetRole.trim(),
        experienceLevel,
        resumeData: resumeData || null,
      });
      navigate('/interview');
    } catch (err) {
      setError('Failed to generate interview questions. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#070a14] text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Custom Mock Interview
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Custom Mock Interview Setup
          </h1>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Configure your target profession, experience seniority, and question difficulty. AI customizes all 5 questions strictly for your chosen role.
          </p>
        </div>

        {/* STEP 1: Dynamic Target Job Role & Experience Level */}
        <div className="p-6 rounded-2xl bg-[#0c1122] border border-slate-800 space-y-5 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Target Job Role (Free-text / Searchable) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-purple-400" />
                  Target Job Role
                </span>
                {resumeData?.targetRole && (
                  <span className="text-[10px] text-purple-400 font-normal">
                    Resume Analysis Active
                  </span>
                )}
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. English Teacher, Accountant, Software Developer..."
                  className="w-full bg-[#070a14] border border-slate-700 hover:border-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors"
                />
              </div>

              {/* Resume suggestion pill */}
              {resumeData?.targetRole && targetRole !== resumeData.targetRole && (
                <button
                  type="button"
                  onClick={() => setTargetRole(resumeData.targetRole)}
                  className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Use role from resume: <strong>{resumeData.targetRole}</strong></span>
                </button>
              )}

              {/* Quick Suggestion Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500 self-center mr-1">Quick select:</span>
                {COMMON_ROLE_SUGGESTIONS.map((roleName) => (
                  <button
                    key={roleName}
                    type="button"
                    onClick={() => setTargetRole(roleName)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] transition-all ${
                      targetRole.toLowerCase() === roleName.toLowerCase()
                        ? 'bg-purple-600 text-white font-semibold'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                    }`}
                  >
                    {roleName}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-400" />
                Experience Level
              </label>

              <div className="relative">
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full bg-[#070a14] border border-slate-700 hover:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2.5 text-sm text-white transition-colors"
                >
                  {EXPERIENCE_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-[11px] text-slate-400 pt-1">
                Calibrates question depth, technical expectations, and seniority grading.
              </p>
            </div>
          </div>

          {/* Active Context Chip */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-300 flex-wrap">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Target Track: <strong className="text-white">{targetRole || 'Not specified'}</strong></span>
            <span className="text-slate-500">•</span>
            <span>Seniority: <strong className="text-white">{experienceLevel}</strong></span>
            {resumeData?.candidateName && (
              <>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">Candidate: {resumeData.candidateName}</span>
              </>
            )}
          </div>
        </div>

        {/* STEP 2: Difficulty Selection Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Select Question Difficulty
            </label>
            <span className="text-xs text-slate-400">Current: <strong>{selectedDifficulty}</strong></span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {DIFFICULTY_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isActive = selectedDifficulty === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedDifficulty(opt.id)}
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
        </div>

        {/* 5-Question Session Preview */}
        <div className="p-4 rounded-2xl bg-[#0b0f1d] border border-slate-800 space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center justify-between">
            <span>5-Question Session Blueprint for {targetRole || 'Your Role'}</span>
            <span className="text-[11px] text-purple-400 normal-case">{selectedDifficulty} Level</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {[
              { n: 1, type: 'Technical / Domain', color: 'bg-purple-500/15 border-purple-500/30 text-purple-300', label: 'Domain Principles' },
              { n: 2, type: 'Technical / Scenario', color: 'bg-purple-500/15 border-purple-500/30 text-purple-300', label: 'Practical Scenario' },
              { n: 3, type: 'Project', color: 'bg-blue-500/15 border-blue-500/30 text-blue-300', label: 'Project Deep-Dive' },
              { n: 4, type: 'Project / Trade-offs', color: 'bg-blue-500/15 border-blue-500/30 text-blue-300', label: 'Execution Trade-offs' },
              { n: 5, type: 'HR', color: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300', label: 'Behavioural (STAR)' },
            ].map((q) => (
              <div
                key={q.n}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center ${q.color}`}
              >
                <span className="text-[10px] font-bold opacity-60 mb-1">Q{q.n}</span>
                <span className="text-[11px] font-semibold">{q.label}</span>
                <span className="text-[10px] opacity-50 mt-0.5">{selectedDifficulty}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto"
          >
            ← Back to Dashboard
          </Button>

          <button
            type="button"
            onClick={handleStart}
            disabled={loading}
            className="w-full sm:flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Questions for {targetRole}…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Start {selectedDifficulty} Interview ({targetRole})
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        <p className="text-center text-[11px] text-slate-600">
          Role-tailored questions calibrated to {experienceLevel} · Webcam and Speech-to-Text active in room
        </p>
      </div>
    </div>
  );
};

export default InterviewSetupPage;
