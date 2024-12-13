import express, { Express, Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import gigRoutes from './routes/gigRoutes';

dotenv.config();

const app: Express = express();

// Middleware
app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB URI is not defined');
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Routes
app.use('/api', gigRoutes);

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

const PORT: number = parseInt(process.env.PORT || '3000');
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