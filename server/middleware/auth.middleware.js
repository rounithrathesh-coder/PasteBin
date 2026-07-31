import { SupabaseService } from '../services/supabase.service.js';

/**
 * Authentication Middleware
 * Validates Authorization headers, token expiration, and attaches user to req.user
 */
export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing Authorization header with Bearer token'
    });
  }

  try {
    const user = await SupabaseService.verifyUserToken(authHeader);
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired authentication token'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Authentication Error',
      message: err.message
    });
  }
};
