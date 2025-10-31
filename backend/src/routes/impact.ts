import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  getUserImpact,
  getLeaderboard,
  logImpact,
  getCommunityTotal,
  getUserImpactStats
} from '../controller/impact';
import { authenticate } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Validation rules
const logImpactValidation = [
  body('wasteReduced').isFloat({ min: 0 }),
  body('moneySaved').isFloat({ min: 0 }),
  body('co2Reduced').isFloat({ min: 0 }),
  body('waterSaved').isFloat({ min: 0 }),
  body('timespan').isIn(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
];

// Routes
router.get('/user/:userId', getUserImpact);
router.get('/user-stats/:userId', getUserImpactStats);
router.get('/leaderboard', getLeaderboard);
router.get('/community-total', getCommunityTotal);
router.post('/log', authenticate, logImpactValidation, handleValidationErrors, logImpact);

export default router;