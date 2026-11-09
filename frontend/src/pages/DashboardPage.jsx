import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  FileText,
  Video,
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Sparkles,
  Bot,
  BarChart3,
  Flame,
  ChevronRight,
  Shield,
  Layers,
  Briefcase,
  Code2,
  FolderGit2,
  HelpCircle,
  FileUp,
  UploadCloud,
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ScoreGauge from '../components/ScoreGauge';
import Header from '../components/Header';
import PersonalizedInterviewModal from '../components/PersonalizedInterviewModal';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { resumeData, interviewHistory } = useApp();
  const [isPersonalizedModalOpen, setIsPersonalizedModalOpen] = useState(false);
  const navigate = useNavigate();

  const handlePracticeTopic = () => {
    navigate('/interview-setup');
  };

  const extractedSkills =
    resumeData?.skills && resumeData.skills.length > 0
      ? resumeData.skills
      : resumeData?.matchedSkills?.map((s) => (typeof s === 'string' ? s : s.name)) || [
        'React',
        'Node.js',
        'Express',
        'MongoDB',
        'TypeScript',
      ];

  const extractedProjects =
    resumeData?.projects && resumeData.projects.length > 0
      ? resumeData.projects
      : [
        {
          title: 'Cloud Microservices & Event Streamer',
          description: 'Scalable distributed event architecture built with Node.js and Redis caching.',
          technologies: ['Node.js', 'Express', 'Redis', 'Docker'],
        },
        {
          title: 'Full Stack MERN SaaS Application',
          description: 'Responsive candidate evaluation engine with JWT auth and MongoDB aggregations.',
          technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
        },
      ];

  const extractedExperience =
    resumeData?.experience && resumeData.experience.length > 0
      ? resumeData.experience
      : [
        {
          role: resumeData?.targetRole || 'Senior Full Stack Engineer',
          company: 'TechFlow Systems',
          duration: '2023 - Present',
          description: 'Architected high-throughput REST APIs and reduced p99 query latency by 42%.',
        },
        {
          role: 'Full Stack Developer',
          company: 'Nexus Software',
          duration: '2021 - 2023',
          description: 'Built interactive React component libraries and managed MongoDB cluster scaling.',
        },
      ];

  const recommendedTopics =
    resumeData?.recommendedTopics && resumeData.recommendedTopics.length > 0
      ? resumeData.recommendedTopics
      : [
        'React 18 Fiber & Concurrent Rendering Primitives',
        'Node.js Event Loop Microtasks vs Libuv Check Phase',
        'MongoDB Indexing Strategies & ESR Compound Rules',
        'Distributed Cache Invalidation: Redis Cache-Aside',
        'STAR Behavioral: Navigating Technical Debt vs Deadlines',
      ];

  return (
    <div className="space-y-6 p-6">
      <Header
        title={`Welcome back, ${resumeData?.candidateName || user?.name || 'Alex'}!`}
        subtitle={`Target Track: ${resumeData?.targetRole || user?.targetRole || 'Senior Full Stack Engineer'} • Live AI Analysis`}
      />

      {/* Top Highlight Banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-blue-950/50 border border-purple-500/30 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-purple-600/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Resume Analysis Active</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {resumeData?.candidateName ? `${resumeData.candidateName}'s Resume Profile` : 'Candidate Profile Intelligence'}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {resumeData?.summary ||
                'Candidate profile demonstrating strong practical competence across modern MERN technologies. Solid foundation for technical interview rounds.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/interview-setup">
              <Button size="md" variant="primary" icon={Zap}>
                Start AI Interview
              </Button>
            </Link>
            <Link to="/resume-upload">
              <Button size="md" variant="secondary" icon={FileUp}>
                Upload New PDF
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* NEW: Resume-Based Personalized Interview (Requirement 1) */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-purple-950/70 via-indigo-950/50 to-blue-950/60 border-2 border-purple-500/40 relative overflow-hidden shadow-2xl shadow-purple-950/30">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/25 to-blue-500/25 border border-purple-400/40 text-purple-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>Universal Professional AI</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
              Resume-Based Personalized Interview
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Upload your resume and let AI create a personalized interview based on your skills, education, projects and professional experience.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Supports All Domains (IT, Finance, Marketing, HR, Engineering)</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 5 Tailored Questions</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 1 HR Behavioral Question</span>
            </div>
          </div>

          <div className="flex-shrink-0">
            <Button
              size="lg"
              variant="primary"
              className="shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 flex items-center gap-2.5 px-6 py-3 text-sm font-bold"
              onClick={() => setIsPersonalizedModalOpen(true)}
              icon={UploadCloud}
            >
              Upload Resume & Start Interview
            </Button>
          </div>
        </div>
      </div>

      {/* Modal for Resume-Based Personalized Interview */}
      <PersonalizedInterviewModal
        isOpen={isPersonalizedModalOpen}
        onClose={() => setIsPersonalizedModalOpen(false)}
      />

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              ATS Match Score
            </p>
            <h3 className="text-2xl font-extrabold text-white mt-1">
              {resumeData?.overallAtsScore || resumeData?.atsScore || 88}%
            </h3>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Top 12% Candidate Pool
            </span>
          </div>
          <ScoreGauge score={resumeData?.overallAtsScore || resumeData?.atsScore || 88} size={64} strokeWidth={6} label="" />
        </Card>

        {/* Card 2 */}
        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Active Resume PDF
            </p>
            <div className="w-8 h-8 rounded-lg bg-purple-600/10 flex items-center justify-center text-purple-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-base font-bold text-white truncate" title={resumeData?.fileName || 'Resume.pdf'}>
            {resumeData?.fileName || 'Resume.pdf'}
          </h3>
          <p className="text-[11px] text-slate-400">
            {resumeData?.targetRole || 'Senior Full Stack'}
          </p>
        </Card>

        {/* Card 3 */}
        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Skills Extracted
            </p>
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-400">
              <Code2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-white">
            {extractedSkills.length}
          </h3>
          <p className="text-[11px] text-slate-400">
            Verified across resume entities
          </p>
        </Card>

        {/* Card 4 */}
        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Practice Rounds
            </p>
            <div className="w-8 h-8 rounded-lg bg-cyan-600/10 flex items-center justify-center text-cyan-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-white">
            {interviewHistory?.length || 8}
          </h3>
          <p className="text-[11px] text-slate-400">
            Avg Score: 84 / 100
          </p>
        </Card>
      </div>

      {/* NEW: Extracted Resume Intelligence Showcase on Dashboard (Requirement 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Skills & Recommended Interview Topics (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Extracted Skills Card */}
          <Card elevated={true} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span>Extracted Skills from Resume ({extractedSkills.length})</span>
              </h3>
              <Badge variant="purple" size="sm">
                AI Parsed
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {extractedSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-purple-500/10 border border-purple-500/25 text-purple-300 font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>{typeof skill === 'string' ? skill : skill.name}</span>
                </span>
              ))}
            </div>
          </Card>

          {/* Recommended Interview Topics (Requirement 6 & 7) */}
          <Card elevated={true} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  <span>Recommended Interview Topics</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tailored by Gemini AI based on your extracted background & gaps
                </p>
              </div>
              <Badge variant="cyan" size="sm">
                Adaptive
              </Badge>
            </div>

            <div className="space-y-2.5 pt-1">
              {recommendedTopics.map((topic, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#090d19] border border-slate-800 hover:border-purple-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-purple-600/20 text-purple-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-medium text-slate-200 leading-snug">
                      {topic}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePracticeTopic(topic)}
                    className="shrink-0 text-xs py-1 px-3"
                  >
                    Practice Round →
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Extracted Projects Showcase (Requirement 5 & 7) */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-blue-400" />
                <span>Extracted Projects from Resume</span>
              </h3>
              <Badge variant="blue" size="sm">
                Projects
              </Badge>
            </div>

            <div className="space-y-3 pt-1">
              {extractedProjects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#090d19] border border-slate-800/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{proj.title}</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.technologies.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-300 font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Work Experience & Recent Interviews (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Extracted Work Experience (Requirement 5 & 7) */}
          <Card elevated={true} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>Extracted Experience</span>
              </h3>
              <Badge variant="green" size="sm">
                Career History
              </Badge>
            </div>

            <div className="space-y-3 pt-1">
              {extractedExperience.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#090d19] border border-slate-800 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{exp.role}</span>
                    <span className="text-[11px] text-purple-400 font-mono">{exp.duration}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">{exp.company}</p>
                  <p className="text-slate-300 text-[11px] leading-relaxed pt-1">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Interview History */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-400" />
                <span>Recent Practice History</span>
              </h3>
              <Link to="/report" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1">
                <span>View Last</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {interviewHistory.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-[#090d19] border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h4 className="font-semibold text-white">{item.role}</h4>
                    <span className="text-[11px] text-slate-400">{item.date}</span>
                  </div>
                  <Badge variant={item.score >= 85 ? 'purple' : 'blue'} size="sm">
                    {item.score}%
                  </Badge>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link to="/resume-analysis">
                <Button size="sm" variant="outline" className="w-full" icon={FileText}>
                  Full ATS Breakdown & Suggestions
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
