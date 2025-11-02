import express from 'express';
import { body } from 'express-validator';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile,
  refreshToken 
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty().trim(),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

const updateProfileValidation = [
  body('name').optional().trim(),
  body('dietaryPreferences').optional().isArray(),
  body('cuisinePreferences').optional().isArray(),
];

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and profile
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
// Routes
router.post('/register', registerValidation, handleValidationErrors, register);
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', loginValidation, handleValidationErrors, login);
router.post('/refresh-token', refreshToken);
/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticate, getProfile);
router.put('/profile', authenticate, updateProfileValidation, handleValidationErrors, updateProfile);

export default router;