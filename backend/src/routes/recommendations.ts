import express from 'express';
import { body, query } from 'express-validator';
import {
  recommendByIngredients,
  getExpiringRecipes
} from '../controllers/recipeController';
import { getIngredientSubstitutions } from '../controllers/ingredientController';
import { authenticate, optionalAuth } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';

const router = express.Router();

// Validation rules
const recommendValidation = [
  body('ingredients').isArray({ min: 1 }),
  body('ingredients.*').isString().notEmpty(),
  body('maxCookingTime').optional().isInt({ min: 1 }),
  body('difficulty').optional().isIn(['EASY', 'MEDIUM', 'HARD']),
  body('dietary').optional().isArray(),
  body('cuisine').optional().isArray(),
  body('limit').optional().isInt({ min: 1, max: 50 }),
];

const expiringValidation = [
  body('ingredients').isArray({ min: 1 }),
  body('ingredients.*').isString().notEmpty(),
  body('limit').optional().isInt({ min: 1, max: 20 }),
];

// Routes
router.post('/by-ingredients', optionalAuth, recommendValidation, handleValidationErrors, recommendByIngredients);
router.post('/expiring', optionalAuth, expiringValidation, handleValidationErrors, getExpiringRecipes);
router.get('/substitutions', getIngredientSubstitutions);

export default router;