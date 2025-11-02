const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth');
const recipeRoutes = require('./recipes');
const userRoutes = require('./users');
const impactRoutes = require('./impact');
const searchRoutes = require('./search');
const uploadRoutes = require('./upload');

// Mount routes
router.use('/auth', authRoutes);
router.use('/recipes', recipeRoutes);
router.use('/users', userRoutes);
router.use('/impact', impactRoutes);
router.use('/search', searchRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;