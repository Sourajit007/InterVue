import mongoose from 'mongoose';

const questionItemSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    type: {
      type: String,
      enum: ['Technical', 'Project', 'HR'],
      required: true,
    },
    category: { type: String, default: 'General' },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    question: { type: String, required: true },
    context: { type: String, default: '' },
    hint: { type: String, default: '' },
    expectedKeyPoints: [{ type: String }],
    sampleIdealAnswer: { type: String, default: '' },
    candidateAnswer: { type: String, default: '' },
    score: { type: Number, default: 0 },
    aiCritique: { type: String, default: '' },
    modelAnswerTip: { type: String, default: '' },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: false,
    },
    role: {
      type: String,
      required: [true, 'Please provide the target interview role'],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    status: {
      type: String,
      enum: ['created', 'in-progress', 'completed'],
      default: 'created',
    },
    duration: {
      type: String,
      default: '20 minutes',
    },
    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    grade: {
      type: String,
      default: 'Pending',
    },
    summaryVerdict: {
      type: String,
      default: '',
    },
    questions: [questionItemSchema],
    metricBreakdown: [
      {
        label: String,
        score: Number,
        benchmark: Number,
      },
    ],
    keyStrengths: [{ type: String }],
    areasForImprovement: [{ type: String }],
    proctoringEvents: [
      {
        type: { type: String },   // 'tab_switch', 'tab_return', 'camera_off', etc.
        timestamp: { type: String },
        detail: { type: String, default: '' },
        _id: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
