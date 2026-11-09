import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  Download,
  Share2,
  Layers,
  HelpCircle,
  FileText,
  RotateCcw,
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ScoreGauge from '../components/ScoreGauge';
import Header from '../components/Header';
import { useApp } from '../context/AppContext';

export const ResumeAnalysisPage = () => {
  const { resumeData } = useApp();
  const navigate = useNavigate();

  const handleStartTailoredInterview = () => {
    navigate('/interview-setup');
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <Header
        title="Resume ATS Diagnostic & Skill Gap Report"
        subtitle={`Evaluation for ${resumeData?.targetRole || 'Senior Full Stack Engineer'} • ${resumeData?.fileName || 'Resume.pdf'}`}
      />

      {/* Top ATS Scorecard Banner */}
      <div className="rounded-2xl p-6 bg-[#0d1326] border border-purple-500/30 shadow-xl grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        {/* Overall Score Circle */}
        <div className="flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-slate-800">
          <ScoreGauge
            score={resumeData?.overallAtsScore || 88}
            size={130}
            strokeWidth={11}
            label="ATS MATCH"
            subtext="Top 12% in Senior Pool"
          />
        </div>

        {/* Sub-Score Bars (2 cols) */}
        <div className="md:col-span-2 space-y-3.5">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">Target Role Keyword Density</span>
              <span className="text-purple-400">{resumeData?.subScores?.keywordMatch || 92}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full"
                style={{ width: `${resumeData?.subScores?.keywordMatch || 92}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">Quantified Business Impact & Metrics</span>
              <span className="text-blue-400">{resumeData?.subScores?.impactMetrics || 85}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full"
                style={{ width: `${resumeData?.subScores?.impactMetrics || 85}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">ATS Parsing & Single-Column Structure</span>
              <span className="text-emerald-400">{resumeData?.subScores?.formattingAts || 95}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                style={{ width: `${resumeData?.subScores?.formattingAts || 95}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">Senior Architecture & Cloud Depth</span>
              <span className="text-cyan-400">{resumeData?.subScores?.techDepth || 82}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
                style={{ width: `${resumeData?.subScores?.techDepth || 82}%` }}
              />
            </div>
          </div>
        </div>

        {/* CTA Launch Session */}
        <div className="flex flex-col gap-3 justify-center items-center md:items-end text-center md:text-right">
          <Badge variant="purple" size="md" icon={Sparkles}>
            AI Questions Ready
          </Badge>
          <p className="text-xs text-slate-400 max-w-xs">
            We generated 5 targeted interview questions tailored to your gaps.
          </p>
          <Button
            size="md"
            variant="primary"
            onClick={handleStartTailoredInterview}
            icon={Zap}
            className="w-full md:w-auto"
          >
            Launch Tailored Mock
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <Card className="p-6 space-y-3 bg-[#0d1222]">
        <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Gemini 2.0 Candidate Positioning Assessment</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {resumeData?.summary}
        </p>
      </Card>

      {/* Two columns: Skills Matched vs Missing/Weak */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Validated Candidate Strengths ({resumeData?.matchedSkills?.length || 8})</span>
            </h3>
            <Badge variant="green" size="sm">
              ATS Pass
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {resumeData?.matchedSkills?.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="font-medium">{skill.name}</span>
                <span className="text-[10px] text-emerald-500 font-mono">({skill.level})</span>
              </span>
            ))}
          </div>
        </Card>

        {/* Missing / High-Value Additions */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Recommended Competency Additions</span>
            </h3>
            <Badge variant="amber" size="sm">
              High Impact
            </Badge>
          </div>
          <div className="space-y-2.5">
            {resumeData?.missingSkills?.map((skill, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
              >
                <span className="font-semibold text-amber-300">{skill.name}</span>
                <span className="text-slate-400 text-[11px]">{skill.reason}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bullet Strengths */}
        <Card className="p-6 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Notable Resume High Points</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {resumeData?.strengths?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Bullet Improvements */}
        <Card className="p-6 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span>Optimization Opportunities</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {resumeData?.improvements?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Tailored Interview Questions Ready */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>Synthesized Interview Questions for this Profile</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              These questions will be asked in your live AI mock interview room.
            </p>
          </div>
          <Button size="sm" variant="primary" onClick={handleStartTailoredInterview} icon={Zap}>
            Practice These Questions
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {resumeData?.tailoredQuestions?.map((q, idx) => (
            <div
              key={q.id}
              className="p-4 rounded-xl bg-[#0a0f1d] border border-slate-800 hover:border-purple-500/30 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between text-[11px]">
                <Badge variant="purple" size="sm">
                  {q.category}
                </Badge>
                <span className="text-slate-400 font-mono">Q{idx + 1} • {q.difficulty}</span>
              </div>
              <p className="text-xs font-medium text-slate-200 leading-snug">"{q.question}"</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <Link to="/resume-upload">
          <Button variant="secondary" size="md" icon={RotateCcw}>
            Upload Another Resume
          </Button>
        </Link>
        <Button variant="primary" size="md" onClick={handleStartTailoredInterview} icon={ArrowRight} iconPosition="right">
          Begin Live AI Interview
        </Button>
      </div>
    </div>
  );
};
export default ResumeAnalysisPage;

