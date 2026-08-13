import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import Routes
import authRoutes from './routes/authRoutes';
import trainerRoutes from './routes/trainerRoutes';
import campaignRoutes from './routes/campaignRoutes';
import awardRoutes from './routes/awardRoutes';
import donationRoutes from './routes/donationRoutes';
import contactRoutes from './routes/contactRoutes';
import statsRoutes from './routes/statsRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/awards', awardRoutes);
app.use('/api/donation', donationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/stats', statsRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`CES Backend Server is running on port ${PORT}`);
});
