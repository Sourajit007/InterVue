import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Handle mock/demo token directly
      if (token.startsWith('mock-jwt-token') || token === 'demo-token') {
        req.user = {
          _id: 'mock-user-12345',
          name: 'Alex Rivera',
          email: 'alex.rivera@example.com',
          targetRole: 'Senior Full Stack Engineer',
        };
        return next();
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'intervue_jwt_super_secret_key_2026'
      );

      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch (e) {
        req.user = {
          _id: decoded.id,
          name: 'Candidate User',
          email: 'user@intervue.ai',
        };
      }

      if (!req.user) {
        req.user = {
          _id: decoded.id,
          name: 'Candidate User',
          email: 'user@intervue.ai',
        };
      }

      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token validation failed',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

/**
 * Optional auth — sets req.user if a valid token is present, but never blocks the request.
 */
export const optionalProtect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];

      if (token.startsWith('mock-jwt-token') || token === 'demo-token') {
        req.user = {
          _id: 'mock-user-12345',
          name: 'Alex Rivera',
          email: 'alex.rivera@example.com',
        };
        return next();
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'intervue_jwt_super_secret_key_2026'
      );
      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch {
        req.user = { _id: decoded.id };
      }
    } catch {
      // Token invalid — proceed anonymously
    }
  }
  next();
};

export default protect;
