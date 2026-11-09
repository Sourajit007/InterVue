# InterVue AI 🚀
### Modern AI-Powered Technical Interview Preparation & Resume ATS Platform

InterVue AI is a full-stack MERN application with Google Gemini 2.0 integration designed to help software engineers prepare for technical and behavioral interviews.

---

## 🛠 Tech Stack

* **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, React Router 6, Web Speech API (TTS & Speech-to-Text)
* **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs
* **AI Engine:** Google Gemini 2.0 Flash (`@google/generative-ai`)
* **Design System:** Modern dark-themed SaaS interface with purple (`#8b5cf6`) and blue (`#3b82f6`) accents, glassmorphic cards, and audio visualizers.

---

## 📁 Project Structure

```text
InterVue/
├── frontend/                     # React + Vite Client Application
│   ├── src/
│   │   ├── components/           # Reusable UI Components
│   │   │   ├── Navbar.jsx        # Public & App navigation
│   │   │   ├── Footer.jsx        # Platform footer
│   │   │   ├── Sidebar.jsx       # App sidebar navigation
│   │   │   ├── Header.jsx        # Authenticated page topbar
│   │   │   ├── Card.jsx          # Glassmorphic dark card
│   │   │   ├── Button.jsx        # Reusable button with variants
│   │   │   ├── Badge.jsx         # Status and pill tags
│   │   │   ├── ScoreGauge.jsx    # SVG animated score gauge
│   │   │   └── AudioWaveform.jsx # Voice activity visualizer
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication & JWT session
│   │   │   └── AppContext.jsx    # Resumes, questions, and reports
│   │   ├── data/
│   │   │   └── mockData.js       # Complete sample datasets & rubrics
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx       # 1. Landing Page
│   │   │   ├── AuthPage.jsx          # 2. Login / Register
│   │   │   ├── DashboardPage.jsx     # 3. Candidate Dashboard
│   │   │   ├── ResumeUploadPage.jsx  # 4. Resume Upload & Track Picker
│   │   │   ├── ResumeAnalysisPage.jsx# 5. ATS Diagnostic & Skill Gap
│   │   │   ├── InterviewPage.jsx     # 6. Live AI Mock Interview Room (Web Speech API)
│   │   │   └── ReportPage.jsx        # 7. Multi-Dimensional Report
│   │   ├── services/
│   │   │   └── api.js            # Frontend HTTP client layer connected to backend
│   │   ├── App.jsx               # Route configuration & layouts
│   │   ├── index.css             # Tailwind base & custom glow styles
│   │   └── main.jsx              # Entry point
│   ├── tailwind.config.js        # Theme colors & glow definitions
│   └── vite.config.js
│
└── backend/                      # Node.js + Express API (MVC Architecture)
    ├── src/
    │   ├── config/
    │   │   └── db.js             # Mongoose connection with fallback
    │   ├── controllers/
    │   │   ├── authController.js     # Register, Login (JWT + bcrypt), Profile
    │   │   ├── resumeController.js   # ATS scanning & analysis
    │   │   └── interviewController.js# Question generator & reports
    │   ├── middleware/
    │   │   └── authMiddleware.js # JWT Bearer verification
    │   ├── models/
    │   │   ├── User.js           # Candidate model with bcrypt hooks
    │   │   ├── Resume.js         # Resume entity model
    │   │   └── Interview.js      # Interview session model
    │   ├── routes/
    │   │   ├── authRoutes.js     # /api/auth
    │   │   ├── resumeRoutes.js   # /api/resumes
    │   │   └── interviewRoutes.js# /api/interviews
    │   ├── services/
    │   │   └── geminiService.js  # Gemini 2.0 Flash prompt pipelines
    │   └── server.js             # Express app entry point
    ├── .env
    └── .env.example
```

---

## 🖥 7 Implemented Pages

1. **Landing Page (`/`)**: High-converting SaaS landing page with animated AI examiner simulation showcase, key metrics, feature grids, 3-step timeline, and CTA banners.
2. **Login / Register (`/auth`)**: Tabbed authentication with validation, password security, role selection, and a **1-Click Demo Login** button for instant testing.
3. **Dashboard (`/dashboard`)**: Candidate overview showing readiness index (86%), practice streak, ATS scores, recent interview history, competency progress bars, and quick actions.
4. **Resume Upload (`/resume-upload`)**: Drag-and-drop file upload zone, seniority track selector, interactive skill tag manager, and simulated ATS scanning animation.
5. **Resume Analysis (`/resume-analysis`)**: ATS score gauge (88%), sub-scores (keyword density, impact metrics, formatting, cloud depth), validated strengths, missing skill gaps, and auto-generated tailored questions.
6. **Live AI Interview Room (`/interview`)**: Interactive simulation featuring:
   * AI Examiner with dynamic voice visualizer waveform and **Web Speech API Text-to-Speech** (reads questions aloud).
   * **Microphone Speech-to-Text Recognition** allowing live voice dictation directly into candidate answers.
   * Webcam preview box with video/audio toggles.
   * Hint accordion system.
   * Countdown timers and question navigation (Q1-Q5).
7. **Performance Report (`/report`)**: Comprehensive hiring verdict ("Strong Hire"), 5-dimensional competency rubric, question-by-question candidate answer vs AI model answer comparison, PDF export, and share links.

---

## ⚡️ Quick Start Guide

### 1. Start Both Frontend and Backend

From the project root:

```bash
# Terminal 1: Start Backend (Port 5001)
npm run dev:backend

# Terminal 2: Start Frontend (Port 3000)
npm run dev:frontend
```

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend API:** [http://localhost:5001/api](http://localhost:5001/api)
* **Backend Health Check:** [http://localhost:5001/api/health](http://localhost:5001/api/health)
