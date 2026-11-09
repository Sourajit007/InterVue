import express from 'express';
import {
  getQuestions,
  generateInterviewSession,
  saveProctoringEvent,
  submitInterview,
  getInterviewHistory,
} from '../controllers/interviewController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/questions', getQuestions);
router.post('/generate', optionalProtect, generateInterviewSession);
router.post('/:id/proctor', saveProctoringEvent);
router.post('/submit', submitInterview);
router.get('/', protect, getInterviewHistory);

export default router;
