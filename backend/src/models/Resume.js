import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    technologies: [{ type: String }],
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, default: '' },
    company: { type: String, default: '' },
    duration: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, default: '' },
    institution: { type: String, default: '' },
    year: { type: String, default: '' },
    field: { type: String, default: '' },
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    candidateName: {
      type: String,
      default: 'Candidate',
      trim: true,
    },
    professionalDomain: {
      type: String,
      default: 'General',
      trim: true,
    },
    fileName: {
      type: String,
      required: [true, 'Please provide resume file name'],
      trim: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    targetRole: {
      type: String,
      default: 'Professional Specialist',
      trim: true,
    },
    skills: [{ type: String }],
    education: [educationSchema],
    certifications: [{ type: String }],
    projects: [projectSchema],
    experience: [experienceSchema],
    recommendedTopics: [{ type: String }],
    atsScore: {
      type: Number,
      default: 85,
      min: 0,
      max: 100,
    },
    subScores: {
      keywordMatch: { type: Number, default: 85 },
      impactMetrics: { type: Number, default: 80 },
      formattingAts: { type: Number, default: 90 },
      techDepth: { type: Number, default: 80 },
    },
    summary: {
      type: String,
      default: '',
    },
    matchedSkills: [
      {
        name: String,
        level: String,
        category: String,
      },
    ],
    missingSkills: [
      {
        name: String,
        reason: String,
      },
    ],
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    rawText: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
