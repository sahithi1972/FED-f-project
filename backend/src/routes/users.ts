import express from 'express';
import { param, query } from 'express-validator';
import {
  getUserProfile,
  getUserBadges,
  getUserAchievements,
  getUserStats,
  updateUserPreferences
} from '../controller/user';
import { authenticate } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';

const router = express.Router();

// Routes
router.get('/:userId/profile', getUserProfile);
router.get('/:userId/badges', getUserBadges);
router.get('/:userId/achievements', getUserAchievements);
router.get('/:userId/stats', getUserStats);
router.put('/preferences', authenticate, updateUserPreferences);

export default router;