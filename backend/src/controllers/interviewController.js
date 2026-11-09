import mongoose from 'mongoose';
import Interview from '../models/Interview.js';
import Resume from '../models/Resume.js';
import { getLatestInMemoryResume } from './resumeController.js';
import {
  generateQuestionsWithGemini,
  generatePersonalizedInterviewQuestions,
  evaluateInterviewWithGemini,
} from '../services/geminiService.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

// In-memory store for sessions when MongoDB is offline
const inMemoryInterviews = new Map();

const standardQuestions = [
  {
    id: 1,
    category: 'Node.js & Backend Architecture',
    difficulty: 'Advanced',
    question:
      'Can you walk me through the Node.js Event Loop phases, and explain how setImmediate() differs from process.nextTick()?',
    context: 'Senior backend roles test deep comprehension of the libuv threadpool and asynchronous scheduling.',
    hint: 'Think about microtasks versus macrotasks and which queue gets prioritized between event loop ticks.',
    sampleIdealAnswer:
      'The Node.js event loop consists of Timers, Pending I/O, Poll, Check, and Close callbacks. process.nextTick executes immediately after the current operation finishes on the microtask queue, whereas setImmediate runs in the Check phase.',
  },
  {
    id: 2,
    category: 'React Internals & Performance',
    difficulty: 'Advanced',
    question:
      "Explain React 18's Fiber architecture, concurrent rendering, and how automatic batching improves render efficiency.",
    context: 'Focus on virtual DOM diffing, interruptible rendering, and React 18 concurrency primitives.',
    hint: "Contrast React 16 synchronous stack reconciliation with Fiber's linked list work-in-progress tree.",
    sampleIdealAnswer:
      'Fiber restructured the reconciliation engine into an incremental linked-list tree. Concurrent rendering allows work to be paused, and automatic batching groups updates inside async promises into a single render.',
  },
  {
    id: 3,
    category: 'MongoDB & Scalability',
    difficulty: 'Senior',
    question:
      'A client reports that an analytics endpoint querying MongoDB has slowed from 120ms to 4.8 seconds as data reached 8 million records. How do you systematically diagnose and resolve it?',
    context: 'Demonstrate real-world troubleshooting methodology using database profiling and index design.',
    hint: 'Mention ESR (Equality, Sort, Range) indexing rule and explain execution stats.',
    sampleIdealAnswer:
      'Inspect execution stats via .explain("executionStats") looking for COLLSCAN. Create compound indexes following the Equality, Sort, Range (ESR) rule, and adopt cursor-based pagination.',
  },
  {
    id: 4,
    category: 'System Design & Security',
    difficulty: 'Senior',
    question:
      'How would you design a production-grade authentication and session management architecture in a modern MERN stack application?',
    context: 'Discuss token lifecycles, XSS vs CSRF trade-offs, and refresh token security.',
    hint: 'Think about keeping access tokens in memory and refresh tokens in httpOnly cookies.',
    sampleIdealAnswer:
      'A resilient MERN auth system pairs short-lived in-memory JWT access tokens with long-lived refresh tokens stored in httpOnly, Secure, SameSite=Strict cookies, supplemented by refresh token rotation.',
  },
  {
    id: 5,
    category: 'Behavioral & STAR',
    difficulty: 'Intermediate',
    question:
      'Describe a scenario where a product manager pushed for an aggressive release date that would introduce significant technical debt. How did you handle it?',
    context: 'Evaluate business alignment, risk quantification, and constructive negotiation.',
    hint: 'Use the STAR framework and frame the compromise constructively.',
    sampleIdealAnswer:
      'I quantified the financial and customer churn risks, proposed scoping down secondary animations while keeping core ledger integrity, and delivered on schedule with 99.98% uptime.',
  },
];

/**
 * @desc    Generate a personalized interview session from resume data
 * @route   POST /api/interviews/generate
 * @access  Public / Optional Private
 */
export const generateInterviewSession = async (req, res) => {
  try {
    const { resumeId, difficulty = 'Intermediate', role: explicitRole, resumeData: explicitResumeData } = req.body;

    // Attempt to load resume data for personalization
    let resumeData = explicitResumeData || null;

    if (!resumeData && isDbConnected() && resumeId) {
      try {
        resumeData = await Resume.findById(resumeId).lean();
      } catch (e) {
        // Fall through to generate without specific resume
      }
    }

    if (!resumeData) {
      resumeData = getLatestInMemoryResume();
    }

    const role = explicitRole || resumeData?.targetRole || resumeData?.professionalDomain || 'Professional Specialist';

    // Generate personalized questions using the resume data (or defaults if unavailable)
    const questions = await generatePersonalizedInterviewQuestions({
      resumeData,
      difficulty,
      role,
    });

    // Persist as an Interview session document
    const sessionId = 'isession-' + Date.now();

    if (isDbConnected()) {
      try {
        const interviewDoc = await Interview.create({
          userId: req.user?._id,
          resumeId: resumeId || null,
          role,
          difficulty,
          status: 'created',
          questions: questions.map((q) => ({
            id: q.id,
            type: q.type || 'Technical',
            category: q.category || 'General',
            difficulty: q.difficulty || difficulty,
            question: q.question,
            context: q.context || '',
            hint: q.hint || '',
            expectedKeyPoints: q.expectedKeyPoints || [],
            sampleIdealAnswer: q.sampleIdealAnswer || '',
            candidateAnswer: '',
            score: 0,
          })),
        });

        return res.status(201).json({
          success: true,
          interviewId: interviewDoc._id.toString(),
          difficulty,
          role,
          count: questions.length,
          questions,
        });
      } catch (dbErr) {
        // Fall through to in-memory response
      }
    }

    // In-memory fallback when MongoDB is offline
    inMemoryInterviews.set(sessionId, {
      interviewId: sessionId,
      role,
      difficulty,
      status: 'created',
      questions,
      userAnswers: {},
      proctoringEvents: [],
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      interviewId: sessionId,
      difficulty,
      role,
      count: questions.length,
      questions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate interview session',
      error: error.message,
    });
  }
};

/**
 * @desc    Save proctoring events for a session (tab switches etc.)
 * @route   POST /api/interviews/:id/proctor
 * @access  Public / Optional Private
 */
export const saveProctoringEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { event } = req.body; // { type, timestamp, detail }

    if (isDbConnected()) {
      await Interview.findByIdAndUpdate(id, {
        $push: { proctoringEvents: event },
      }).catch(() => { });
    } else {
      const session = inMemoryInterviews.get(id);
      if (session) {
        session.proctoringEvents = session.proctoringEvents || [];
        session.proctoringEvents.push(event);
      }
    }

    return res.status(200).json({ success: true });
  } catch {
    return res.status(200).json({ success: true }); // non-critical — always ACK
  }
};

/**
 * @desc    Get interview questions
 * @route   GET /api/interviews/questions
 * @access  Public / Optional Private
 */
export const getQuestions = async (req, res) => {
  try {
    const { role, skills } = req.query;

    const skillsArray = skills ? skills.split(',') : ['React', 'Node.js', 'MongoDB'];
    let questions = await generateQuestionsWithGemini(
      role || 'Senior Full Stack Engineer',
      skillsArray
    );

    if (!questions || questions.length === 0) {
      questions = standardQuestions;
    }

    res.json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    res.json({
      success: true,
      count: standardQuestions.length,
      questions: standardQuestions,
    });
  }
};

/**
 * @desc    Submit interview responses and generate evaluation report
 * @route   POST /api/interviews/submit
 * @access  Public / Optional Private
 */
export const submitInterview = async (req, res) => {
  try {
    const {
      interviewId,
      questions,
      userAnswers,
      proctoringEvents = [],
      duration,
      role,
      resumeData,
    } = req.body;

    // Build resume context from request body or req.user
    const resumeContext = resumeData || {
      candidateName: req.user?.name || 'Candidate',
      targetRole: role || 'Software Engineer',
      skills: [],
    };

    // Run full per-question evaluation
    const reportData = await evaluateInterviewWithGemini(
      questions || standardQuestions,
      userAnswers || {},
      resumeContext
    );

    // Merge fields that the controller knows about
    reportData.id         = 'rep-' + Date.now();
    reportData.duration   = duration || '—';
    reportData.role       = role || resumeContext.targetRole || 'Software Engineer';
    reportData.candidateName = resumeContext.candidateName || req.user?.name || 'Candidate';
    reportData.proctoringFlags = (proctoringEvents || []).filter((e) => e.type === 'tab_switch').length;

    // ── Persist to MongoDB if connected ────────────────────────────────────
    if (isDbConnected()) {
      try {
        const updatePayload = {
          status: 'completed',
          duration: reportData.duration,
          overallScore: reportData.overallScore,
          grade: reportData.grade,
          summaryVerdict: reportData.summaryVerdict,
          metricBreakdown: reportData.metricBreakdown,
          keyStrengths: reportData.keyStrengths,
          areasForImprovement: reportData.areasForImprovement,
          proctoringEvents,
          // Write back per-question evaluations into the questions array
          questions: (questions || []).map((q, idx) => {
            const review = reportData.questionReviews?.[idx];
            return {
              id: q.id,
              type: q.type || 'Technical',
              category: q.category || 'General',
              difficulty: q.difficulty || 'Intermediate',
              question: q.question,
              context: q.context || '',
              hint: q.hint || '',
              expectedKeyPoints: q.expectedKeyPoints || [],
              sampleIdealAnswer: q.sampleIdealAnswer || '',
              candidateAnswer: userAnswers?.[q.id] || userAnswers?.[String(q.id)] || '',
              score: review?.scoreOutOf10 || 0,
              aiCritique: review?.aiCritique || '',
              modelAnswerTip: review?.modelAnswerTip || '',
            };
          }),
        };

        if (interviewId && !interviewId.startsWith('mock-')) {
          // Update existing interview session
          await Interview.findByIdAndUpdate(interviewId, updatePayload).catch(() => {});
        } else {
          // Create a new record if no session ID
          await Interview.create({
            userId: req.user?._id,
            role: reportData.role,
            ...updatePayload,
          }).catch(() => {});
        }
      } catch (dbErr) {
        console.warn('[Interview Submit] DB save error:', dbErr.message);
      }
    } else {
      // Update in-memory session if present
      const session = inMemoryInterviews.get(interviewId);
      if (session) {
        session.status = 'completed';
        session.report = reportData;
      }
    }

    return res.status(200).json({ success: true, report: reportData });
  } catch (error) {
    console.error('[Interview Submit] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to evaluate interview',
      error: error.message,
    });
  }
};

/**
 * @desc    Get user interview history
 * @route   GET /api/interviews
 * @access  Private
 */
export const getInterviewHistory = async (req, res) => {
  try {
    if (isDbConnected()) {
      const interviews = await Interview.find({ userId: req.user?._id }).sort({ createdAt: -1 });
      return res.json({
        success: true,
        count: interviews.length,
        interviews,
      });
    }

    res.json({
      success: true,
      count: 0,
      interviews: [],
    });
  } catch (error) {
    res.json({
      success: true,
      count: 0,
      interviews: [],
    });
  }
};
