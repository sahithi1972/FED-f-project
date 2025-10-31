import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter, authLimiter, uploadLimiter } from './middleware/rateLimiter';
import { swaggerUi, specs } from './docs/swagger';

// Import routes
import authRoutes from './routes/auth';
import recipeRoutes from './routes/recipes';
import userRoutes from './routes/users';
import impactRoutes from './routes/impact';
import searchRoutes from './routes/search';
import uploadRoutes from './routes/upload';
// TODO: Implement these routes
// import recipeRoutes from './routes/recipes';
// import userRoutes from './routes/users';
// import impactRoutes from './routes/impact';
// import searchRoutes from './routes/search';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
app.use(rateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'WasteChef API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// API routes
// Register routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/recipes', recipeRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware
app.use(errorHandler);

export default app;