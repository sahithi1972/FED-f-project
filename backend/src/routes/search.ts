import express from 'express';
import { query } from 'express-validator';
import {
  searchRecipes,
  getTags,
  suggestIngredients,
  getPopularTags
} from '../controllers/search';
import { optionalAuth } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';

const router = express.Router();

// Routes
router.get('/recipes', optionalAuth, searchRecipes);
router.get('/tags', getTags);
router.get('/tags/popular', getPopularTags);
router.get('/ingredients/suggest', suggestIngredients);

export default router;