import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  Zap,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Video,
  BarChart3,
  ShieldCheck,
  Cpu,
  Mic,
  Star,
  Users,
  Award,
  Play,
  Terminal,
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import AudioWaveform from '../components/AudioWaveform';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#080b14] text-slate-100 overflow-hidden">
      {/* Background radial gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-purple-600/15 via-blue-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/50 border border-purple-500/30 text-purple-300 text-xs font-semibold shadow-inner shadow-purple-500/10 animate-fade-in">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Next-Gen MERN + Gemini 2.0 Interview Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Ace Your Next Tech Interview with{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Adaptive AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Practice realistic, interactive voice and text technical interviews. InterVue AI analyzes your resume, asks tailored senior-level questions, and delivers actionable rubric feedback in real-time.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/interview-setup">
              <Button size="lg" variant="primary" icon={Zap} iconPosition="left" className="w-full sm:w-auto">
                Start Mock Interview
              </Button>
            </Link>
            <Link to="/resume-upload">
              <Button size="lg" variant="secondary" icon={FileCheck2} iconPosition="left" className="w-full sm:w-auto">
                Upload Resume (ATS Scan)
              </Button>
            </Link>
          </div>

          {/* Micro social proof */}
          <div className="flex items-center justify-center gap-6 pt-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero setup required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full Stack & System Design</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant Gemini Rubric</span>
            </div>
          </div>
        </div>

        {/* Live Hero Simulation Card */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="relative rounded-2xl p-1 bg-gradient-to-r from-purple-500/30 via-indigo-500/20 to-blue-500/30 shadow-2xl shadow-purple-900/20">
            <div className="bg-[#0c1020] rounded-xl border border-slate-800 p-6 md:p-8 space-y-6">
              {/* Top window bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-medium text-slate-400 font-mono">
                    intervue-session://live-technical-round
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <Badge variant="purple" size="sm">
                    AI Examiner Speaking
                  </Badge>
                </div>
              </div>

              {/* AI Question Showcase */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                        Question 2 of 5 • Senior Full Stack (MERN)
                      </p>
                      <p className="text-base font-medium text-white mt-1 leading-snug">
                        "Can you explain React 18's Fiber reconciliation engine and how Automatic Batching optimizes rendering in async callbacks?"
                      </p>
                    </div>
                  </div>

                  {/* Audio Waveform */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-purple-400 animate-pulse" />
                      <span className="text-xs font-mono text-slate-300">
                        Synthesized AI Audio Voice
                      </span>
                    </div>
                    <AudioWaveform isActive={true} color="purple" count={14} />
                  </div>
                </div>

                {/* Score card sidebar preview */}
                <div className="p-4 rounded-xl bg-[#11172a] border border-purple-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Confidence Score</span>
                    <span className="text-xs font-bold text-emerald-400">92% High</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-full w-[92%]" />
                  </div>
                  <div className="text-[11px] text-slate-400 space-y-1">
                    <p className="flex items-center gap-1.5 text-slate-300">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      Key concepts detected:
                    </p>
                    <p className="text-purple-300 font-mono text-[10px]">
                      ✓ Linked List WorkInProgress Tree
                    </p>
                    <p className="text-blue-300 font-mono text-[10px]">
                      ✓ Universal React 18 Batching
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="border-y border-slate-800/80 bg-[#070a12]/90 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-3xl font-extrabold text-white bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              94%
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">Offer Acceptance Increase</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-white bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
              150k+
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">AI Mock Sessions Completed</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-white bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              88%
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">Average ATS Score Improvement</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-white bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              4.9 / 5
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">Candidate Satisfaction Rating</p>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="cyan" size="sm">
            Complete Preparation Ecosystem
          </Badge>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Built Specifically for High-Growth Tech Roles
          </h2>
          <p className="text-sm text-slate-400">
            From parsing the fine details in your resume to simulating high-pressure live coding and system design rounds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card hoverGlow={true} className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Adaptive Gemini 2.0 Interviewer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dynamically branches questions based on your depth. If you give a shallow answer, it asks targeted follow-ups just like a Senior Staff Engineer.
            </p>
            <div className="pt-2 text-xs font-semibold text-purple-400 flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
              <Link to="/interview-setup">Try interactive room →</Link>
            </div>
          </Card>

          {/* Card 2 */}
          <Card hoverGlow={true} className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Deep ATS Resume Scanner</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload your PDF/DOCX to uncover missing keywords, quantify impact metrics, and auto-generate specialized interview tracks matching your profile.
            </p>
            <div className="pt-2 text-xs font-semibold text-blue-400 flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
              <Link to="/resume-upload">Analyze your resume →</Link>
            </div>
          </Card>

          {/* Card 3 */}
          <Card hoverGlow={true} className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-600/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Multi-Dimensional Rubric Report</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get evaluated on 5 critical criteria: Technical Accuracy, Problem Solving, Communication, Confidence, and STAR Behavioral Structure.
            </p>
            <div className="pt-2 text-xs font-semibold text-cyan-400 flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
              <Link to="/report">View sample report →</Link>
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0e1c] border-y border-slate-800">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <Badge variant="purple" size="sm">
              Simple 3-Step Journey
            </Badge>
            <h2 className="text-3xl font-bold text-white">How InterVue AI Prepares You</h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Follow our proven methodology to transform your technical interviewing confidence in under a week.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#0f152a] border border-slate-800 space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm flex items-center justify-center shadow-lg shadow-purple-600/40">
                1
              </div>
              <h3 className="text-base font-bold text-white">Upload Your Resume & Select Track</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provide your target seniority (Junior to Staff) and focus area (MERN, Cloud, Microservices). Our engine matches industry standards.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#0f152a] border border-purple-500/30 space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-lg shadow-indigo-600/40">
                2
              </div>
              <h3 className="text-base font-bold text-white">Take Live Mock Interview Simulation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interact with the AI using live voice speech or typing. Experience realistic countdown timers, adaptive follow-ups, and hint systems.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#0f152a] border border-slate-800 space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-lg shadow-blue-600/40">
                3
              </div>
              <h3 className="text-base font-bold text-white">Review Detailed Actionable Report</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Study side-by-side ideal model answers, identify recurring speech filler habits, and download candidate preparation reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-purple-900/30 via-slate-900 to-[#0c1020] border border-purple-500/30 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Land Your Next Senior Engineer Offer?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Join thousands of developers leveling up their interview skills with personalized AI simulations today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/interview-setup">
              <Button size="lg" variant="primary" icon={Zap} iconPosition="left">
                Start Practicing Free Now
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="secondary">
                Explore Demo Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
export default LandingPage;

