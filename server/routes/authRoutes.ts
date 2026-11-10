import { Router } from 'express';
import {
  register,
  login,
  googleAuth,
  getMe,
  makeAdmin,
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
  changePassword,
  sendAuthOtp,
  verifyAuthOtp,
} from '../controllers/authController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';
import { env } from '../config/env';

const router = Router();

// Public auth endpoints protected by authRateLimiter
router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/google', authRateLimiter, googleAuth);
router.post('/send-otp', authRateLimiter, sendAuthOtp);
router.post('/verify-otp', authRateLimiter, verifyAuthOtp);

router.post('/logout', (req, res) => {
  const production = env.NODE_ENV === 'production';
  res.clearCookie('renewx_access', {
    httpOnly: true,
    secure: production,
    sameSite: production ? 'none' : 'lax',
    path: '/api',
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

// Password Reset & Email Verification endpoints
router.post('/forgot-password', authRateLimiter, requestPasswordReset);
router.post('/forget-password', authRateLimiter, requestPasswordReset);
router.post('/verify-reset-token', authRateLimiter, verifyResetToken);
router.post('/reset-password', authRateLimiter, resetPassword);

// Authenticated session profile & password management
router.get('/me', authenticateToken, getMe);
router.post('/change-password', authenticateToken, changePassword);

// Admin role promotion
router.post('/make-admin', authenticateToken, requireAdmin, makeAdmin);

export default router;
