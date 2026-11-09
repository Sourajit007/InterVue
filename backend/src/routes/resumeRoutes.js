import express from 'express';
import {
  uploadMiddleware,
  uploadAndAnalyzeResume,
  analyzeResume,
  getLatestResume,
  getResumes,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Optional auth helper middleware: if token provided, sets req.user; otherwise proceeds
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

/**
 * Handle Multer errors cleanly
 */
const handleMulterError = (err, req, res, next) => {
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error',
    });
  }
  next();
};

// Route: POST /api/resume/upload (Multer PDF upload)
router.post(
  '/upload',
  optionalAuth,
  uploadMiddleware.single('resume'),
  handleMulterError,
  uploadAndAnalyzeResume
);

// Route: POST /api/resume/analyze (Raw text fallback)
router.post('/analyze', optionalAuth, analyzeResume);

// Route: GET /api/resume/latest
router.get('/latest', optionalAuth, getLatestResume);

// Route: GET /api/resume/
router.get('/', optionalAuth, getResumes);

export default router;
