import express from 'express';
import { getAggregatedProfile, getBadgeSvg, proxyAvatar } from '../controllers/devpulseController.js';
import { apiLimiter, badgeLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/profile', apiLimiter, getAggregatedProfile);
router.get('/badge', badgeLimiter, getBadgeSvg);
router.get('/proxy-avatar', apiLimiter, proxyAvatar);

// Add default export so app.js can import it directly
export default router;