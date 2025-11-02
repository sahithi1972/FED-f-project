import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  likeRecipe,
  unlikeRecipe,
  saveRecipe,
  unsaveRecipe,
  getUserRecipes,
  getTrendingRecipes,
  getRecommendedRecipes
} from '../controllers/recipeController';
import { authenticate } from '../middleware/auth';
import { handleValidationErrors as validateRequest } from '../middleware/validation';

const router = Router();

// Validation rules
const createRecipeValidation = [
  body('title').notEmpty().trim().isLength({ min: 3, max: 100 }),
  body('description').notEmpty().trim().isLength({ min: 10, max: 1000 }),
  body('ingredients').isArray({ min: 1 }),
  body('ingredients.*.name').notEmpty().trim(),
  body('ingredients.*.quantity').isFloat({ min: 0 }),
  body('ingredients.*.unit').notEmpty().trim(),
  body('steps').isArray({ min: 1 }),
  body('steps.*.order').isInt({ min: 1 }),
  body('steps.*.description').notEmpty().trim(),
  body('cookingTime').isInt({ min: 1 }),
  body('difficulty').isIn(['EASY', 'MEDIUM', 'HARD']),
  body('servings').isInt({ min: 1 }),
  body('tags').optional().isArray(),
];

const updateRecipeValidation = [
  param('id').isString().notEmpty(),
  body('title').optional().trim().isLength({ min: 3, max: 100 }),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }),
  body('ingredients').optional().isArray({ min: 1 }),
  body('steps').optional().isArray({ min: 1 }),
  body('cookingTime').optional().isInt({ min: 1 }),
  body('difficulty').optional().isIn(['EASY', 'MEDIUM', 'HARD']),
  body('servings').optional().isInt({ min: 1 }),
  body('tags').optional().isArray(),
];

// Routes
// Public routes (with optional authentication)
/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: Recipe management
 */

/**
 * @swagger
 * /api/v1/recipes:
 *   get:
 *     summary: Get all recipes
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Page size
 *     responses:
 *       200:
 *         description: List of recipes
 */
router.get('/', getRecipes);
router.get('/trending', getTrendingRecipes);
router.get('/user/:userId', getUserRecipes);
/**
 * @swagger
 * /api/v1/recipes/{id}:
 *   get:
 *     summary: Get recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe details
 *       404:
 *         description: Recipe not found
 */
router.get('/:id', getRecipeById);

// Protected routes (require authentication)
router.get('/recommended', authenticate, validateRequest, getRecommendedRecipes);
/**
 * @swagger
 * /api/v1/recipes:
 *   post:
 *     summary: Create a new recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: object
 *               steps:
 *                 type: array
 *                 items:
 *                   type: object
 *               cookingTime:
 *                 type: integer
 *               difficulty:
 *                 type: string
 *               servings:
 *                 type: integer
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Recipe created
 *       400:
 *         description: Bad request
 */
router.post('/', authenticate, createRecipeValidation, validateRequest, createRecipe);
router.put('/:id', authenticate, updateRecipeValidation, validateRequest, updateRecipe);
router.delete('/:id', authenticate, validateRequest, deleteRecipe);
router.post('/:id/like', authenticate, validateRequest, likeRecipe);
router.delete('/:id/like', authenticate, validateRequest, unlikeRecipe);
router.post('/:id/save', authenticate, validateRequest, saveRecipe);
router.delete('/:id/save', authenticate, validateRequest, unsaveRecipe);

export default router;