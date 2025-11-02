import dotenv from 'dotenv';

// Load environment variables
dotenv.config();


import app from './app';
import prisma from './config/database';
import { createServer } from 'http';
import { initializeSocket } from './services/socketService';

const PORT = process.env.PORT || 5000;


const startServer = async (): Promise<void> => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Create HTTP server
    const server = createServer(app);

    // Initialize WebSocket service
    initializeSocket(server);

    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 WasteChef server running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔌 WebSocket server initialized`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();