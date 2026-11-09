import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Bot,
  AlertTriangle,
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Header from '../components/Header';
import { useApp } from '../context/AppContext';

export const ResumeUploadPage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [experience, setExperience] = useState('Intermediate (1–3 years)');
  const [skills, setSkills] = useState(['Communication', 'Problem Solving', 'Leadership']);
  const [customSkill, setCustomSkill] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { uploadPdfResume, processUploadedResume } = useApp();
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setErrorMessage('');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        setErrorMessage('Only PDF resumes are supported.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleFileInput = (e) => {
    setErrorMessage('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        setErrorMessage('Only PDF resumes are supported.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      setSkills([...skills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setErrorMessage('');
    setAnalysisStep('Uploading PDF to Multer backend & parsing with pdf-parse...');

    try {
      if (selectedFile) {
        // Send real PDF to backend Multer endpoint
        setAnalysisStep('Extracting candidate text, skills, projects, and experience via Gemini 2.0...');
        await uploadPdfResume(selectedFile, targetRole);
      } else {
        // Text/fallback analysis
        setAnalysisStep('Extracting resume entities & keywords with Gemini AI...');
        await processUploadedResume({
          name: 'Alex_Rivera_FullStack_Resume.pdf',
          targetRole,
          experience,
          skills,
        });
      }

      setAnalysisStep('Analysis complete! Redirecting to Resume ATS Diagnostic...');
      setTimeout(() => {
        setAnalyzing(false);
        navigate('/resume-analysis');
      }, 700);
    } catch (err) {
      setAnalyzing(false);
      setErrorMessage(err.message || 'Failed to upload and analyze PDF resume');
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      <Header
        title="Resume Upload & AI Diagnostic"
        subtitle="Upload your PDF resume to extract skills, projects, experience, and generate tailored interview rounds"
      />

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Drag & Drop Area (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card elevated={true} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-purple-400" />
                <span>Step 1: Upload PDF Resume</span>
              </h3>
              <Badge variant="purple" size="sm">
                Multer + pdf-parse + Gemini
              </Badge>
            </div>

            {/* Dropzone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer relative ${dragActive
                ? 'border-purple-400 bg-purple-950/20'
                : 'border-slate-800 hover:border-purple-500/50 bg-[#0a0e1c]/70'
                }`}
            >
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {selectedFile ? selectedFile.name : 'Click to select or drag and drop your PDF resume'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Accepts official PDF documents (Max 10MB)
                  </p>
                </div>
                {!selectedFile && (
                  <Button size="sm" variant="outline" className="pointer-events-none">
                    Select PDF from Computer
                  </Button>
                )}
              </div>
            </div>

            {/* File Selected Badge */}
            {selectedFile && (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-400">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{selectedFile.name}</p>
                    <p className="text-[11px] text-slate-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for text extraction & Gemini API
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </Card>

          {/* Job Description (Optional) */}
          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Target Job Description (Optional)</span>
                <Badge variant="blue" size="sm">
                  Recommended
                </Badge>
              </h3>
              <span className="text-[11px] text-slate-400">For laser-targeted ATS matching</span>
            </div>
            <textarea
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description to benchmark against your uploaded PDF..."
              className="w-full bg-[#0a0e1c] border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </Card>
        </div>

        {/* Right Column: Role Configuration & Trigger */}
        <div className="space-y-6">
          <Card elevated={true} className="p-6 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span>Step 2: Target Criteria</span>
            </h3>

            {/* Target Job Role Free-text Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Target Job Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. English Teacher, Accountant, HR Manager, Software Developer..."
                className="w-full bg-[#0a0e1c] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 placeholder-slate-500"
              />
              <div className="flex flex-wrap gap-1 pt-1">
                {['English Teacher', 'Accountant', 'HR Manager', 'Marketing Executive', 'MERN Stack Developer', 'Mechanical Engineer'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setTargetRole(role)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-purple-500/50 transition-colors"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Experience Level</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-[#0a0e1c] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Beginner / Fresher (0 years)">Beginner / Fresher (0 years)</option>
                <option value="Intermediate (1–3 years)">Intermediate (1–3 years)</option>
                <option value="Experienced (3–5 years)">Experienced (3–5 years)</option>
                <option value="Senior (5+ years)">Senior (5+ years)</option>
              </select>
            </div>

            {/* Focus Skills Tags */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Skills Focus</label>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-purple-500/10 border border-purple-500/30 text-purple-300"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-rose-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Add tag input */}
              <form onSubmit={addSkill} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add skill (e.g. Redis, Docker)..."
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  className="flex-1 bg-[#0a0e1c] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <Button size="sm" variant="secondary" type="submit">
                  Add
                </Button>
              </form>
            </div>

            {/* Analysis In Progress Indicator */}
            {analyzing ? (
              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-3 text-center">
                <div className="inline-flex p-3 rounded-full bg-purple-600/20 text-purple-400 animate-spin">
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-purple-300 animate-pulse">
                  {analysisStep}
                </p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-full w-full animate-pulse" />
                </div>
              </div>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleAnalyze}
                className="w-full"
                icon={Sparkles}
                iconPosition="left"
              >
                Scan & Run AI Analysis
              </Button>
            )}

            <div className="flex items-center gap-2 text-[11px] text-slate-400 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Parsed with pdf-parse and Gemini AI; saved in MongoDB</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default ResumeUploadPage;
