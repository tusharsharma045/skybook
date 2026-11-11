import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase, prisma } from './config/db.js';
import { logger } from './config/logger.js';

const startServer = async () => {
  try {
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 SkyBook API Server running on port ${env.PORT} [${env.NODE_ENV}]`);
      logger.info(`🔗 Health check available at: http://localhost:${env.PORT}/api/health`);
    });

    // Graceful shutdown handling
    const shutdown = async (signal) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        logger.info('HTTP server closed.');
        await prisma.$disconnect();
        logger.info('Database disconnected. Exiting process.');
        process.exit(0);
      });

      // Force exit after 10s if hanging
      setTimeout(() => {
        logger.error('Forcefully terminating server.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start SkyBook API server:', error);
    process.exit(1);
  }
};

startServer();
