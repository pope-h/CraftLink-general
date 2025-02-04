import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import gigRoutes from './routes/gigRoutes.js';
import artisanRoutes from './routes/artisanRoutes.js';
import connectDB from './utils/db.js';
import chatRoutes from './routes/chatRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();
const app = express();
const allowedOrigins = ["http://localhost:3000", "https://furte.vercel.app"];
app.use(cors({ origin: allowedOrigins, credentials: true }) //allowedHeaders: ["*"]
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
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: err.message
    });
};
app.use(errorHandler);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
const PORT = parseInt(process.env.PORT || '3001');
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
//# sourceMappingURL=index.js.map