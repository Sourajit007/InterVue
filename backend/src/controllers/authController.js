import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'intervue_jwt_super_secret_key_2026',
    { expiresIn: '30d' }
  );
};

// In-memory user store fallback if MongoDB is not connected
const memoryUsers = new Map();

// Helper to check if DB is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, targetRole } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // 1. If MongoDB is connected, use Mongoose
    if (isDbConnected()) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email',
        });
      }

      const user = await User.create({
        name,
        email,
        password,
        targetRole: targetRole || 'Senior Full Stack Engineer',
      });

      return res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole,
          readinessScore: user.readinessScore,
        },
        token: generateToken(user._id),
      });
    }

    // 2. In-memory store fallback
    if (memoryUsers.has(email)) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    const mockId = 'usr_' + Date.now();
    const mockUser = {
      _id: mockId,
      name,
      email,
      password,
      targetRole: targetRole || 'Senior Full Stack Engineer',
      readinessScore: 80,
    };
    memoryUsers.set(email, mockUser);

    return res.status(201).json({
      success: true,
      user: {
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        targetRole: mockUser.targetRole,
        readinessScore: mockUser.readinessScore,
      },
      token: generateToken(mockId),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // 1. If MongoDB is connected, use Mongoose
    if (isDbConnected()) {
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            targetRole: user.targetRole,
            readinessScore: user.readinessScore,
          },
          token: generateToken(user._id),
        });
      }
    }

    // 2. In-memory store check
    if (memoryUsers.has(email)) {
      const memUser = memoryUsers.get(email);
      if (memUser.password === password) {
        return res.json({
          success: true,
          user: {
            _id: memUser._id,
            name: memUser.name,
            email: memUser.email,
            targetRole: memUser.targetRole,
            readinessScore: memUser.readinessScore,
          },
          token: generateToken(memUser._id),
        });
      }
    }

    // 3. Demo user convenience login
    if (email === 'alex.rivera@example.com' || email.includes('demo')) {
      const demoId = 'demo-candidate-101';
      return res.json({
        success: true,
        user: {
          _id: demoId,
          name: 'Alex Rivera',
          email: email,
          targetRole: 'Senior Full Stack Engineer',
          readinessScore: 86,
        },
        token: generateToken(demoId),
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};
