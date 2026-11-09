import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Share2,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Zap,
  TrendingUp,
  Star,
  Code2,
  FolderGit2,
  Users,
  Lightbulb,
  ShieldAlert,
  Target,
  MessageSquare,
  Brain,
  BookOpen,
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ScoreGauge from '../components/ScoreGauge';
import Header from '../components/Header';
import { useApp } from '../context/AppContext';

/* ─── Helpers ─────────────────────────────────────────────────── */
const scoreColor = (s) =>
  s >= 80 ? 'text-emerald-400' : s >= 60 ? 'text-amber-400' : 'text-red-400';

const scoreBg = (s) =>
  s >= 80
    ? 'bg-emerald-500/10 border-emerald-500/30'
    : s >= 60
    ? 'bg-amber-500/10 border-amber-500/30'
    : 'bg-red-500/10 border-red-500/30';

const gradeColor = (grade) => {
  if (!grade) return 'green';
  if (grade.includes('Strong')) return 'green';
  if (grade === 'Hire') return 'blue';
  if (grade.includes('Leaning')) return 'cyan';
  if (grade.includes('Needs')) return 'amber';
  return 'red';
};

const TYPE_ICON = { Technical: Code2, Project: FolderGit2, HR: Users };
const TYPE_BADGE = { Technical: 'purple', Project: 'blue', HR: 'cyan' };

const DimensionBar = ({ label, score, benchmark, color, icon: Icon }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
        {label}
      </div>
      <div className="flex items-center gap-2">
        {benchmark && (
          <span className="text-[10px] text-slate-600 font-mono">target {benchmark}%</span>
        )}
        <span className={`text-xs font-bold ${scoreColor(score)}`}>{score}%</span>
      </div>
    </div>
    <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
      {/* Benchmark marker */}
      {benchmark && (
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-600 z-10"
          style={{ left: `${benchmark}%` }}
        />
      )}
      <div
        className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700`}
        style={{ width: `${Math.min(score, 100)}%` }}
      />
    </div>
  </div>
);

const ScoreRing = ({ score, size = 56 }) => {
  const pct = Math.min(Math.max(score, 0), 10);
  const color =
    pct >= 7 ? '#10b981' : pct >= 5 ? '#f59e0b' : '#ef4444';
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const filled = (pct / 10) * circ;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={6}
        strokeDasharray={circ}
        strokeDashoffset={circ - filled}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <text
        x="50%" y="50%"
        dominantBaseline="middle" textAnchor="middle"
        className="rotate-90"
        style={{
          transform: `rotate(90deg) translate(0, 0)`,
          fontSize: size < 50 ? 10 : 13,
          fontWeight: 700,
          fill: color,
          transformOrigin: `${size / 2}px ${size / 2}px`,
        }}
      >
        {pct}/10
      </text>
    </svg>
  );
};

/* ─── Main Report Page ────────────────────────────────────────── */
export const ReportPage = () => {
  const { currentReport, proctoringEvents } = useApp();
  const [expandedQ, setExpandedQ] = useState(0);
  const [copied, setCopied] = useState(false);

  const report = currentReport || {};
  const reviews = report.questionReviews || [];
  const tabSwitches = (proctoringEvents || []).filter((e) => e.type === 'tab_switch').length
    || report.proctoringFlags || 0;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-6xl mx-auto print:p-0">
      <Header
        title="AI Performance Evaluation Report"
        subtitle={`${report.candidateName || 'Candidate'} · ${report.role || 'Software Engineer'} · ${report.date || 'Today'}`}
      />

      {/* ── Hero Banner ───────────────────────────────────────────── */}
      <div className="rounded-2xl p-6 sm:p-8 bg-[#0d1326] border border-purple-500/30 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Score Gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center gap-3 p-4 border-b md:border-b-0 md:border-r border-slate-800">
          <ScoreGauge
            score={report.overallScore || 0}
            size={148}
            strokeWidth={12}
            label="OVERALL SCORE"
            subtext={report.readinessLevel || '—'}
          />
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-xs text-slate-500 font-mono">
              {report.answeredCount ?? reviews.length}/{report.totalQuestions ?? reviews.length} answered
            </span>
            {tabSwitches > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                <ShieldAlert className="w-3 h-3" />
                {tabSwitches} tab switch{tabSwitches > 1 ? 'es' : ''} logged
              </span>
            )}
          </div>
        </div>

        {/* Verdict */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={gradeColor(report.grade)} size="lg" icon={Award}>
                {report.grade || 'Pending'}
              </Badge>
              <Badge variant="purple" size="md">
                {report.role || 'Software Engineer'}
              </Badge>
            </div>
            <div className="flex items-center gap-2 print:hidden">
              <Button size="sm" variant="secondary" onClick={handleShare} icon={Share2}>
                {copied ? 'Copied!' : 'Share'}
              </Button>
              <Button size="sm" variant="primary" onClick={() => window.print()} icon={Download}>
                Export PDF
              </Button>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">{report.summaryVerdict}</p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-800/80">
            {report.duration && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                {report.duration}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Evaluated by Gemini AI
            </span>
          </div>
        </div>
      </div>

      {/* ── 4-Dimension Score Breakdown ───────────────────────────── */}
      <Card className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            Evaluation Dimensions
          </h3>
          <span className="text-xs text-slate-500">Scored out of 100%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(report.metricBreakdown || []).map((m, i) => {
            const icons = [Code2, Brain, MessageSquare, Target];
            return (
              <div key={i} className="p-3.5 rounded-xl bg-[#090d19] border border-slate-800">
                <DimensionBar
                  label={m.label}
                  score={m.score}
                  benchmark={m.benchmark}
                  color={m.color}
                  icon={icons[i]}
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Strengths & Improvements ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Key Strengths
          </h3>
          <ul className="space-y-2">
            {(report.keyStrengths || []).map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                <Star className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            Areas to Improve
          </h3>
          <ul className="space-y-2">
            {(report.areasForImprovement || []).map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                <AlertCircle className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                {a}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* ── Per-Question Reviews ──────────────────────────────────── */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            Question-by-Question Breakdown
          </h3>
          <span className="text-xs text-slate-500">Click a question to expand full analysis</span>
        </div>

        <div className="space-y-3">
          {reviews.map((q, idx) => {
            const isOpen = expandedQ === idx;
            const QIcon = TYPE_ICON[q.type] || Code2;
            const qBadge = TYPE_BADGE[q.type] || 'purple';
            const displayScore = q.scoreOutOf10 ?? Math.round((q.score || 0) / 10);
            const pct = q.score || (displayScore * 10);
            const passed = q.passed ?? pct >= 60;

            return (
              <div
                key={idx}
                className={`rounded-xl border overflow-hidden transition-all duration-200 ${
                  isOpen ? 'border-purple-500/40' : 'border-slate-800'
                }`}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => setExpandedQ(isOpen ? null : idx)}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-slate-800/30 transition-colors bg-[#090d19]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Score ring */}
                    <div className="shrink-0">
                      <ScoreRing score={displayScore} size={52} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge variant={qBadge} size="sm">
                          <QIcon className="w-3 h-3 mr-0.5 inline" />
                          {q.type || 'Technical'}
                        </Badge>
                        <Badge variant="neutral" size="sm">{q.difficulty || 'Intermediate'}</Badge>
                        <Badge variant="neutral" size="sm">Q{q.qIndex}</Badge>
                        {passed ? (
                          <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-3 h-3" /> Passed
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 text-[10px] text-red-400 font-semibold">
                            <XCircle className="w-3 h-3" /> Needs Work
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-white leading-snug truncate">
                        {q.question}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-slate-500">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Expanded Content */}
                {isOpen && (
                  <div className="border-t border-slate-800/80 bg-[#0c1122] p-5 space-y-5">

                    {/* 4-Dimension Mini Scores */}
                    {q.scores && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { key: 'technicalCorrectness',    label: 'Technical',      icon: Code2 },
                          { key: 'conceptualUnderstanding', label: 'Conceptual',     icon: Brain },
                          { key: 'communication',           label: 'Communication',  icon: MessageSquare },
                          { key: 'answerRelevance',         label: 'Relevance',      icon: Target },
                        ].map(({ key, label, icon: Icon }) => {
                          const val = q.scores[key] ?? 0;
                          return (
                            <div
                              key={key}
                              className={`p-2.5 rounded-xl border text-center ${scoreBg(val * 10)}`}
                            >
                              <Icon className="w-3.5 h-3.5 mx-auto mb-1 text-slate-400" />
                              <p className={`text-base font-bold ${scoreColor(val * 10)}`}>{val}<span className="text-[10px] text-slate-500">/10</span></p>
                              <p className="text-[10px] text-slate-500 mt-0.5">{label}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Candidate Answer */}
                    {q.candidateAnswer && (
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Your Answer</p>
                        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                          <p className="text-xs text-slate-300 italic leading-relaxed">
                            "{q.candidateAnswer.length > 400 ? q.candidateAnswer.slice(0, 400) + '…' : q.candidateAnswer}"
                          </p>
                        </div>
                        {q.candidateAnswerSummary && (
                          <p className="text-[11px] text-slate-500 italic">{q.candidateAnswerSummary}</p>
                        )}
                      </div>
                    )}

                    {/* AI Critique */}
                    {q.aiCritique && (
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Gemini Evaluation
                        </p>
                        <p className="text-xs text-slate-300 leading-relaxed">{q.aiCritique}</p>
                      </div>
                    )}

                    {/* Strengths / Weaknesses */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.strengths?.length > 0 && (
                        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Strengths
                          </p>
                          <ul className="space-y-1">
                            {q.strengths.map((s, i) => (
                              <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed">
                                <span className="text-emerald-400 mt-0.5">✓</span> {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {q.weaknesses?.length > 0 && (
                        <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
                          <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Weaknesses
                          </p>
                          <ul className="space-y-1">
                            {q.weaknesses.map((w, i) => (
                              <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed">
                                <span className="text-red-400 mt-0.5">✗</span> {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Improvements */}
                    {q.improvements?.length > 0 && (
                      <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-2">
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" /> Suggested Improvements
                        </p>
                        <ul className="space-y-1">
                          {q.improvements.map((imp, i) => (
                            <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed">
                              <span className="text-blue-400 mt-0.5">→</span> {imp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Ideal Answer */}
                    {q.idealAnswer && (
                      <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 space-y-2">
                        <p className="text-[10px] font-bold text-purple-300 uppercase tracking-widest flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> Ideal Answer
                        </p>
                        <p className="text-xs text-slate-300 leading-relaxed">{q.idealAnswer}</p>
                      </div>
                    )}

                    {/* Staff Tip */}
                    {q.modelAnswerTip && q.modelAnswerTip !== q.improvements?.[0] && (
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                        <Star className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-200 leading-relaxed">
                          <span className="font-semibold">Staff Engineer Tip: </span>
                          {q.modelAnswerTip}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Proctoring Summary ───────────────────────────────────── */}
      {tabSwitches > 0 && (
        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Proctoring Summary
          </h3>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-300">
                {tabSwitches} tab switch{tabSwitches > 1 ? 'es' : ''} detected during the session.
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Switching browser tabs during a live interview is flagged automatically. These events were logged.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* ── Bottom Navigation ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 print:hidden">
        <Link to="/dashboard" className="w-full sm:w-auto">
          <Button variant="secondary" size="md" className="w-full sm:w-auto">
            Back to Dashboard
          </Button>
        </Link>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link to="/resume-upload" className="w-full sm:w-auto">
            <Button variant="outline" size="md" icon={RotateCcw} className="w-full sm:w-auto">
              Upload New Resume
            </Button>
          </Link>
          <Link to="/interview-setup" className="w-full sm:w-auto">
            <Button variant="primary" size="md" icon={Zap} iconPosition="right" className="w-full sm:w-auto">
              Retake Interview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
