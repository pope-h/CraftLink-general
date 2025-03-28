import express, { Express, Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import gigRoutes from './routes/gigRoutes.js';
import artisanRoutes from './routes/artisanRoutes.js';
import connectDB from './utils/db.js';
import chatRoutes from './routes/chatRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app: Express = express();

const allowedOrigins = ["http://localhost:3000", "https://craftlink-frontend.vercel.app", "https://craft-link.vercel.app"];
app.use(
  cors({ origin: allowedOrigins, credentials: true }) //allowedHeaders: ["*"]
);
app.use(express.json());
app.use(cookieParser());

// Middleware
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to Craft-Link Application Programming Interface');
});
app.use('/api', gigRoutes);
app.use('/api', artisanRoutes);
app.use('/api', chatRoutes);

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message
  });
};
app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT: number = parseInt(process.env.PORT || '3001');
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false).then(() => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

export default app;