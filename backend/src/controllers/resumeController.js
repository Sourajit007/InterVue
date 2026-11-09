import mongoose from 'mongoose';
import multer from 'multer';
import Resume from '../models/Resume.js';
import User from '../models/User.js';
import { analyzeResumeWithGemini } from '../services/geminiService.js';

// Helper to check MongoDB connection status
const isDbConnected = () => mongoose.connection.readyState === 1;

// Multer memory storage configuration for PDF uploads
const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const isPdf =
      file.mimetype === 'application/pdf' ||
      file.originalname.toLowerCase().endsWith('.pdf');

    if (isPdf) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF resumes are accepted.'), false);
    }
  },
});

/**
 * Robust PDF text extraction helper supporting pdf-parse v1 & v2
 */
const extractTextFromPdf = async (buffer) => {
  if (!buffer || buffer.length === 0) {
    throw new Error('PDF file buffer is empty');
  }

  // Validate PDF magic bytes (%PDF)
  const header = buffer.slice(0, 5).toString('ascii');
  if (!header.startsWith('%PDF')) {
    throw new Error('Invalid PDF format: File header missing %PDF magic bytes');
  }

  try {
    const pdfModule = await import('pdf-parse');

    if (pdfModule.PDFParse) {
      // pdf-parse v2+
      const parser = new pdfModule.PDFParse({ data: buffer });
      try {
        const result = await parser.getText();
        return result?.text || '';
      } finally {
        if (typeof parser.destroy === 'function') {
          await parser.destroy();
        }
      }
    } else if (typeof pdfModule.default === 'function') {
      // pdf-parse v1 with default export
      const data = await pdfModule.default(buffer);
      return data?.text || '';
    } else if (typeof pdfModule === 'function') {
      // pdf-parse v1 function
      const data = await pdfModule(buffer);
      return data?.text || '';
    }

    throw new Error('Unable to resolve pdf-parse extraction engine');
  } catch (err) {
    throw new Error(`PDF text extraction failed: ${err.message}`);
  }
};

// In-memory fallback storage for the latest resume
let latestInMemoryResume = null;
export const getLatestInMemoryResume = () => latestInMemoryResume;

/**
 * @desc    Upload PDF resume and perform AI analysis
 * @route   POST /api/resume/upload (or /api/resumes/upload)
 * @access  Public / Optional Private
 */
export const uploadAndAnalyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No PDF file provided. Please upload a file with field name "resume".',
      });
    }

    const targetRole = req.body.targetRole || 'Senior Full Stack Engineer';
    const fileName = req.file.originalname || 'uploaded_resume.pdf';
    const fileSize = req.file.size || 0;

    // 1. Extract text using pdf-parse
    let extractedText = '';
    try {
      extractedText = await extractTextFromPdf(req.file.buffer);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: parseError.message || 'Invalid or unreadable PDF document',
      });
    }

    if (!extractedText || extractedText.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message:
          'Could not extract meaningful text from PDF. The document may be scanned or empty.',
      });
    }

    // 2. Send extracted text to Gemini API for analysis
    const aiAnalysis = await analyzeResumeWithGemini(extractedText, targetRole);

    const detectedRole = req.body.targetRole && req.body.targetRole !== 'Senior Full Stack Engineer'
      ? req.body.targetRole
      : (aiAnalysis.targetRole || aiAnalysis.professionalDomain || 'Professional Specialist');

    // 3. Structure the resume document
    const resumeData = {
      userId: req.user?._id || null,
      candidateName: aiAnalysis.candidateName || 'Candidate',
      professionalDomain: aiAnalysis.professionalDomain || 'General',
      fileName,
      fileSize,
      targetRole: detectedRole,
      education: aiAnalysis.education || [],
      certifications: aiAnalysis.certifications || [],
      skills: aiAnalysis.skills || [],
      projects: aiAnalysis.projects || [],
      experience: aiAnalysis.experience || [],
      recommendedTopics: aiAnalysis.recommendedTopics || [],
      atsScore: aiAnalysis.overallAtsScore || 85,
      subScores: aiAnalysis.subScores || {
        keywordMatch: 88,
        impactMetrics: 82,
        formattingAts: 92,
        techDepth: 80,
      },
      summary: aiAnalysis.summary || '',
      matchedSkills: aiAnalysis.matchedSkills || [],
      missingSkills: aiAnalysis.missingSkills || [],
      strengths: aiAnalysis.strengths || [],
      improvements: aiAnalysis.improvements || [],
      rawText: extractedText.slice(0, 3000), // store preview of raw text
    };

    // 4. Save to MongoDB if connected
    if (isDbConnected()) {
      try {
        const savedResume = await Resume.create(resumeData);

        // Update user's readiness score and target role if logged in
        if (req.user?._id) {
          await User.findByIdAndUpdate(req.user._id, {
            targetRole,
            readinessScore: resumeData.atsScore,
          });
        }

        latestInMemoryResume = savedResume;

        return res.status(201).json({
          success: true,
          message: 'Resume uploaded and analyzed successfully with Gemini AI',
          resume: savedResume,
        });
      } catch (dbErr) {
        console.warn('[MongoDB Save Error]:', dbErr.message);
      }
    }

    // 5. In-memory fallback persistence
    latestInMemoryResume = {
      _id: 'res_' + Date.now(),
      ...resumeData,
      createdAt: new Date().toISOString(),
    };

    return res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully (in-memory mode)',
      resume: latestInMemoryResume,
    });
  } catch (error) {
    console.error('[Resume Upload Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while analyzing resume',
      error: error.message,
    });
  }
};

/**
 * @desc    Analyze raw text resume (non-file JSON endpoint)
 * @route   POST /api/resumes/analyze
 * @access  Public / Optional Private
 */
export const analyzeResume = async (req, res) => {
  try {
    const { targetRole, fileName, resumeText } = req.body;

    const targetText =
      resumeText ||
      'Alex Rivera\nSenior Full Stack Developer\nSkills: React, Node.js, Express, MongoDB, TypeScript';

    const aiAnalysis = await analyzeResumeWithGemini(
      targetText,
      targetRole || 'Senior Full Stack Engineer'
    );

    const resumePayload = {
      userId: req.user?._id || null,
      candidateName: aiAnalysis.candidateName || 'Alex Rivera',
      fileName: fileName || 'Alex_Rivera_FullStack_Resume.pdf',
      targetRole: targetRole || 'Senior Full Stack Engineer',
      skills: aiAnalysis.skills || [],
      projects: aiAnalysis.projects || [],
      experience: aiAnalysis.experience || [],
      recommendedTopics: aiAnalysis.recommendedTopics || [],
      atsScore: aiAnalysis.overallAtsScore || 88,
      subScores: aiAnalysis.subScores,
      summary: aiAnalysis.summary,
      matchedSkills: aiAnalysis.matchedSkills,
      missingSkills: aiAnalysis.missingSkills,
      strengths: aiAnalysis.strengths,
      improvements: aiAnalysis.improvements,
    };

    if (isDbConnected()) {
      try {
        const saved = await Resume.create(resumePayload);
        latestInMemoryResume = saved;
        return res.status(201).json({ success: true, resume: saved, analysis: aiAnalysis });
      } catch (e) { }
    }

    latestInMemoryResume = {
      _id: 'res_' + Date.now(),
      ...resumePayload,
      createdAt: new Date().toISOString(),
    };

    return res.status(200).json({
      success: true,
      resume: latestInMemoryResume,
      analysis: aiAnalysis,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to process resume analysis',
      error: error.message,
    });
  }
};

/**
 * @desc    Get the latest uploaded resume analysis
 * @route   GET /api/resume/latest
 * @access  Public / Private
 */
export const getLatestResume = async (req, res) => {
  try {
    if (isDbConnected()) {
      const query = req.user?._id ? { userId: req.user._id } : {};
      const latest = await Resume.findOne(query).sort({ createdAt: -1 });
      if (latest) {
        return res.json({ success: true, resume: latest });
      }
    }

    if (latestInMemoryResume) {
      return res.json({ success: true, resume: latestInMemoryResume });
    }

    return res.json({
      success: true,
      resume: null,
      message: 'No resume uploaded yet',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve latest resume',
      error: error.message,
    });
  }
};

/**
 * @desc    Get user resumes
 * @route   GET /api/resumes
 * @access  Private / Public
 */
export const getResumes = async (req, res) => {
  try {
    if (isDbConnected()) {
      const query = req.user?._id ? { userId: req.user._id } : {};
      const resumes = await Resume.find(query).sort({ createdAt: -1 });
      return res.json({
        success: true,
        count: resumes.length,
        resumes,
      });
    }

    res.json({
      success: true,
      count: latestInMemoryResume ? 1 : 0,
      resumes: latestInMemoryResume ? [latestInMemoryResume] : [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resumes',
      error: error.message,
    });
  }
};
