import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  Zap,
  BookOpen,
  Loader2,
  FileCheck,
} from 'lucide-react';
import Button from './Button';
import Badge from './Badge';
import Card from './Card';
import { useApp } from '../context/AppContext';

const DIFFICULTY_OPTIONS = [
  {
    id: 'Beginner',
    label: 'Beginner',
    icon: BookOpen,
    color: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/40',
    activeBorder: 'border-emerald-400',
    description: 'Core domain principles, foundational methodologies, and introductory situational scenarios.',
    badge: 'green',
  },
  {
    id: 'Intermediate',
    label: 'Intermediate',
    icon: Layers,
    color: 'from-blue-500/20 to-indigo-500/10',
    border: 'border-blue-500/40',
    activeBorder: 'border-blue-400',
    description: 'Real-world problem solving, trade-offs, project execution, and variance management.',
    badge: 'blue',
    recommended: true,
  },
  {
    id: 'Advanced',
    label: 'Advanced',
    icon: Zap,
    color: 'from-purple-500/20 to-violet-500/10',
    border: 'border-purple-500/40',
    activeBorder: 'border-purple-400',
    description: 'Executive strategy, crisis leadership, risk mitigation, and complex stakeholder alignment.',
    badge: 'purple',
  },
];

export const PersonalizedInterviewModal = ({ isOpen, onClose }) => {
  const { uploadPdfResume, generateInterview } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState('upload'); // 'upload' | 'analyzing' | 'difficulty' | 'generating'
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [analyzedResume, setAnalyzedResume] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('Intermediate');

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file) => {
    setErrorMessage('');
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setErrorMessage('Invalid file format. Please upload a valid PDF document.');
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  // Step 2: Upload PDF and trigger Gemini analysis
  const handleStartAnalysis = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a PDF resume to proceed.');
      return;
    }

    setStep('analyzing');
    setErrorMessage('');
    setAnalysisStatus('Uploading PDF & extracting text with pdf-parse...');

    try {
      setAnalysisStatus('Analyzing professional domain, education, skills, and projects with Gemini AI...');
      const result = await uploadPdfResume(selectedFile);
      setAnalyzedResume(result);
      setStep('difficulty');
    } catch (err) {
      console.error('Personalized resume upload failed:', err);
      setErrorMessage(err.message || 'Could not analyze resume. Please ensure it is a valid PDF and try again.');
      setStep('upload');
    }
  };

  // Step 3: Generate 5 questions & redirect to interview
  const handleGenerateQuestions = async () => {
    setStep('generating');
    setErrorMessage('');
    try {
      await generateInterview(selectedDifficulty, {
        resumeData: analyzedResume,
        role: analyzedResume?.targetRole || analyzedResume?.professionalDomain,
      });

      onClose();
      navigate('/interview');
    } catch (err) {
      console.error('Failed to generate personalized questions:', err);
      setErrorMessage('Failed to generate personalized questions. Retrying...');
      setStep('difficulty');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0c1122] border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-[#0c1122]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Resume-Based Personalized Interview
                <Badge variant="purple" size="sm">Any Profession</Badge>
              </h3>
              <p className="text-xs text-slate-400">
                AI customizes questions strictly around your actual resume, domain, and experience
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {/* STEP 1: Upload PDF */}
          {step === 'upload' && (
            <div className="space-y-4">
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  dragActive
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-slate-800 hover:border-slate-700 bg-[#080b14]/60'
                }`}
              >
                <input
                  type="file"
                  id="modal-pdf-upload"
                  accept="application/pdf,.pdf"
                  onChange={handleFileInput}
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-inner">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Drop your PDF resume here, or{' '}
                      <label
                        htmlFor="modal-pdf-upload"
                        className="text-purple-400 hover:text-purple-300 cursor-pointer underline underline-offset-2"
                      >
                        browse files
                      </label>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports IT, Finance, Marketing, HR, Management, Engineering & Healthcare
                    </p>
                  </div>
                </div>
              </div>

              {/* Uploaded File Display */}
              {selectedFile && (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                        {selectedFile.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {(selectedFile.size / 1024).toFixed(1)} KB · PDF Resume Ready
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Start Personalized Interview Button */}
              <div className="pt-2">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2"
                  disabled={!selectedFile}
                  onClick={handleStartAnalysis}
                  icon={Sparkles}
                >
                  Start Personalized Interview
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Analyzing Animation */}
          {step === 'analyzing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                <Sparkles className="w-6 h-6 text-purple-400 absolute inset-0 m-auto" />
              </div>
              <div className="space-y-1.5 max-w-md">
                <h4 className="text-base font-bold text-white">Analyzing Your Resume Profile</h4>
                <p className="text-xs text-slate-400 animate-pulse">{analysisStatus}</p>
              </div>
            </div>
          )}

          {/* STEP 3: Detected Profile & Difficulty Selection */}
          {step === 'difficulty' && analyzedResume && (
            <div className="space-y-5">
              {/* Extracted Profile Snippet */}
              <div className="p-4 rounded-xl bg-[#080b14] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                      Identified Candidate & Domain
                    </span>
                    <h4 className="text-base font-extrabold text-white">
                      {analyzedResume.candidateName || 'Candidate'}
                    </h4>
                  </div>
                  <Badge variant="cyan" size="sm">
                    {analyzedResume.professionalDomain || 'Domain Specialist'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Briefcase className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{analyzedResume.targetRole || 'Professional'}</span>
                  </div>
                  {analyzedResume.education?.[0] && (
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{analyzedResume.education[0].degree}</span>
                    </div>
                  )}
                </div>

                {analyzedResume.skills && analyzedResume.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {analyzedResume.skills.slice(0, 5).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 border border-slate-700 text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Difficulty Options */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-300">
                  Select Question Difficulty:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {DIFFICULTY_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = selectedDifficulty === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedDifficulty(opt.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          isActive
                            ? `${opt.activeBorder} bg-purple-500/10 shadow-lg shadow-purple-500/10`
                            : 'border-slate-800 bg-[#080b14] hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                          {opt.recommended && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">
                              REC
                            </span>
                          )}
                        </div>
                        <h5 className="text-xs font-bold text-white">{opt.label}</h5>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {opt.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-[11px] text-purple-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-purple-400" />
                <span>
                  Generates exactly 5 questions tailored to your <strong>{analyzedResume.professionalDomain || 'domain'}</strong> profile (including project-specific, scenario, and HR questions).
                </span>
              </div>

              {/* Action */}
              <Button
                size="lg"
                variant="primary"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleGenerateQuestions}
                icon={ArrowRight}
              >
                Generate 5 Questions & Begin Interview
              </Button>
            </div>
          )}

          {/* STEP 4: Generating Questions */}
          {step === 'generating' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Crafting 5 Personalized Questions</h4>
                <p className="text-xs text-slate-400">
                  Aligning questions with your resume projects and {analyzedResume?.professionalDomain} domain...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalizedInterviewModal;

