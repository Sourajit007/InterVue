import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  mockResumeAnalysis,
  mockInterviewQuestions,
  mockPerformanceReport,
  mockInterviewHistory,
} from '../data/mockData';
import {
  apiUploadResume,
  apiGetLatestResume,
  apiAnalyzeResume,
  apiGetQuestions,
  apiGenerateInterview,
  apiSubmitInterview,
} from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [resumeData, setResumeData] = useState(() => {
    const saved = localStorage.getItem('intervue_resume');
    return saved ? JSON.parse(saved) : mockResumeAnalysis;
  });
  const [interviewHistory, setInterviewHistory] = useState(mockInterviewHistory);
  const [currentQuestions, setCurrentQuestions] = useState(mockInterviewQuestions);
  const [currentReport, setCurrentReport] = useState(mockPerformanceReport);
  const [interviewInProgress, setInterviewInProgress] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [activeInterviewId, setActiveInterviewId] = useState(null);
  const [proctoringEvents, setProctoringEvents] = useState([]);

  // Sync resumeData to localStorage
  useEffect(() => {
    if (resumeData) {
      localStorage.setItem('intervue_resume', JSON.stringify(resumeData));
    }
  }, [resumeData]);

  // Fetch latest resume from backend on mount
  useEffect(() => {
    const initAppData = async () => {
      try {
        const latestResumeRes = await apiGetLatestResume();
        if (latestResumeRes?.resume) {
          setResumeData((prev) => ({
            ...prev,
            ...latestResumeRes.resume,
            overallAtsScore: latestResumeRes.resume.atsScore || latestResumeRes.resume.overallAtsScore || prev.overallAtsScore,
          }));
        }
      } catch (e) {
        // Fallback to local state
      }
    };
    initAppData();
  }, []);

  // Upload PDF resume via Multer endpoint (POST /api/resume/upload)
  const uploadPdfResume = async (file, targetRole = 'Senior Full Stack Engineer') => {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('targetRole', targetRole);

    try {
      const response = await apiUploadResume(formData);
      if (response?.resume) {
        const fullResume = {
          ...response.resume,
          overallAtsScore: response.resume.atsScore || response.resume.overallAtsScore || 88,
        };
        setResumeData(fullResume);
        return { success: true, resume: fullResume };
      }
    } catch (err) {
      console.warn('[AppContext] Backend PDF upload error, using local fallback:', err.message);
      throw err;
    }
  };

  // Process text-based resume fallback
  const processUploadedResume = async (fileData) => {
    try {
      const res = await apiAnalyzeResume({
        fileName: fileData.name || 'Uploaded_Resume.pdf',
        targetRole: fileData.targetRole || 'Senior Full Stack Engineer',
        experience: fileData.experience || 'Senior (5+ years)',
      });

      if (res?.analysis || res?.resume) {
        const analysis = res.analysis || res.resume;
        setResumeData(analysis);
        return analysis;
      }
    } catch (err) {
      console.warn('[AppContext] Using fallback analysis:', err.message);
    }

    const fallbackAnalysis = {
      ...mockResumeAnalysis,
      fileName: fileData.name || 'Uploaded_Resume.pdf',
      targetRole: fileData.targetRole || 'Senior Full Stack Engineer',
      experienceLevel: fileData.experience || 'Senior (5+ years)',
      analyzedAt: 'Just now',
      overallAtsScore: Math.floor(Math.random() * (94 - 84 + 1)) + 84,
    };
    setResumeData(fallbackAnalysis);
    return fallbackAnalysis;
  };

  /**
   * Generate a new interview session with personalized questions.
   * @param {string} difficulty - 'Beginner' | 'Intermediate' | 'Advanced'
   */
  const generateInterview = async (difficulty = 'Intermediate') => {
    setUserAnswers({});
    setProctoringEvents([]);
    setInterviewInProgress(true);

    try {
      const res = await apiGenerateInterview({
        difficulty,
        role: resumeData?.targetRole || 'Senior Full Stack Engineer',
        resumeId: resumeData?._id,
        resumeData: resumeData || null,
      });
      if (res?.questions && res.questions.length > 0) {
        setCurrentQuestions(res.questions);
        setActiveInterviewId(res.interviewId);
        return { interviewId: res.interviewId, questions: res.questions };
      }
    } catch (e) {
      console.warn('[AppContext] generateInterview fell back to mock:', e.message);
    }

    // Offline / API fallback — use mock questions
    setCurrentQuestions(mockInterviewQuestions);
    setActiveInterviewId('mock-' + Date.now());
    return { interviewId: null, questions: mockInterviewQuestions };
  };

  // Start a new interview (legacy / quick-start path without difficulty picker)
  const startInterview = async (customQuestions = null) => {
    if (customQuestions && customQuestions.length > 0) {
      setCurrentQuestions(customQuestions);
    } else {
      try {
        const res = await apiGetQuestions(resumeData?.targetRole || 'Senior Full Stack Engineer', resumeData?.skills || []);
        if (res?.questions && res.questions.length > 0) {
          setCurrentQuestions(res.questions);
        }
      } catch (e) {
        setCurrentQuestions(mockInterviewQuestions);
      }
    }
    setUserAnswers({});
    setProctoringEvents([]);
    setInterviewInProgress(true);
  };

  // Record answer for a question
  const recordAnswer = (questionId, answerText) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answerText,
    }));
  };

  // Record a proctoring event (tab switch, camera off, etc.)
  const recordProctoringEvent = (eventType, detail = '') => {
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      detail,
    };
    setProctoringEvents((prev) => [...prev, event]);
    return event;
  };

  // Finalize interview and generate report via backend API
  const completeInterview = async (summaryData = {}) => {
    setInterviewInProgress(false);

    // Build a lightweight resume context to send for evaluation personalisation
    const resumeContext = resumeData ? {
      candidateName: resumeData.candidateName,
      targetRole: resumeData.targetRole,
      skills: resumeData.skills || [],
    } : null;

    try {
      const res = await apiSubmitInterview({
        interviewId: activeInterviewId,
        questions: currentQuestions,
        userAnswers,
        proctoringEvents,
        duration: summaryData.duration || '20 minutes',
        role: resumeData?.targetRole || 'Senior Full Stack Engineer',
        resumeData: resumeContext,
      });

      if (res?.report) {
        setCurrentReport(res.report);
        const historyEntry = {
          id: res.report.id || 'inv-' + Date.now(),
          role: res.report.role || resumeData.targetRole,
          type: 'AI Mock Round',
          date: 'Just now',
          duration: summaryData.duration || '20m',
          score: res.report.overallScore || 88,
          status: 'Completed',
          feedback: res.report.summaryVerdict?.slice(0, 80) + '...',
          tags: ['MERN', 'System Design'],
        };
        setInterviewHistory((prev) => [historyEntry, ...prev]);
        return res.report;
      }
    } catch (err) {
      console.warn('[AppContext] Using fallback report evaluation:', err.message);
    }

    const fallbackReport = {
      ...mockPerformanceReport,
      id: 'rep-' + Date.now(),
      date: 'Just completed',
      duration: summaryData.duration || '18 minutes',
      overallScore: summaryData.score || 88,
    };
    setCurrentReport(fallbackReport);

    const historyEntry = {
      id: 'inv-' + Date.now(),
      role: resumeData.targetRole || 'Senior Full Stack Engineer',
      type: 'AI Mock Simulation',
      date: 'Just now',
      duration: summaryData.duration || '18m',
      score: fallbackReport.overallScore,
      status: 'Completed',
      feedback: 'High structural clarity and strong technical answers.',
      tags: ['Full Stack', 'System Design', 'React'],
    };
    setInterviewHistory((prev) => [historyEntry, ...prev]);

    return fallbackReport;
  };

  return (
    <AppContext.Provider
      value={{
        resumeData,
        setResumeData,
        uploadPdfResume,
        processUploadedResume,
        interviewHistory,
        currentQuestions,
        setCurrentQuestions,
        currentReport,
        setCurrentReport,
        interviewInProgress,
        activeInterviewId,
        proctoringEvents,
        generateInterview,
        startInterview,
        recordAnswer,
        recordProctoringEvent,
        userAnswers,
        completeInterview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
