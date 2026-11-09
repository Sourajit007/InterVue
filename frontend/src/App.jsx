import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ResumeUploadPage from './pages/ResumeUploadPage';
import ResumeAnalysisPage from './pages/ResumeAnalysisPage';
import InterviewSetupPage from './pages/InterviewSetupPage';
import InterviewPage from './pages/InterviewPage';
import ReportPage from './pages/ReportPage';
import PersonalizedInterviewPage from './pages/PersonalizedInterviewPage';
import { useAuth } from './context/AuthContext';

// Protected App Layout with Sidebar
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#080b14]">
      <Navbar />
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />
        <main className="flex-1 min-w-0 pb-16 overflow-y-auto">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

// Fullscreen layout for live interview room
const InterviewLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#070a14]">
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
};

// Public Layout
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#080b14]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export const App = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <Routes>
      {/* 1. Landing Page */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <LandingPage />
          </PublicLayout>
        }
      />

      {/* 2. Login / Register */}
      <Route
        path="/auth"
        element={
          <PublicLayout>
            <AuthPage />
          </PublicLayout>
        }
      />

      {/* 3. Dashboard */}
      <Route
        path="/dashboard"
        element={
          <AppLayout>
            <DashboardPage />
          </AppLayout>
        }
      />

      {/* 4. Resume Upload */}
      <Route
        path="/resume-upload"
        element={
          <AppLayout>
            <ResumeUploadPage />
          </AppLayout>
        }
      />

      {/* 5. Resume Analysis */}
      <Route
        path="/resume-analysis"
        element={
          <AppLayout>
            <ResumeAnalysisPage />
          </AppLayout>
        }
      />

      {/* 6. Interview Setup — difficulty picker */}
      <Route
        path="/interview-setup"
        element={
          <InterviewLayout>
            <InterviewSetupPage />
          </InterviewLayout>
        }
      />

      {/* 6b. Resume-Based Personalized Interview */}
      <Route
        path="/personalized-interview"
        element={
          <AppLayout>
            <PersonalizedInterviewPage />
          </AppLayout>
        }
      />

      {/* 7. Interview Interface */}
      <Route
        path="/interview"
        element={
          <InterviewLayout>
            <InterviewPage />
          </InterviewLayout>
        }
      />

      {/* 7. Performance Report */}      <Route
        path="/report"
        element={
          <AppLayout>
            <ReportPage />
          </AppLayout>
        }
      />

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

