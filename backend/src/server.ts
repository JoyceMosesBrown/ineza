import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';

import authRoutes from './routes/auth';
import journalRoutes from './routes/journal';
import trackerRoutes from './routes/tracker';
import sosRoutes from './routes/sos';
import peersRoutes from './routes/peers';
import chwRoutes from './routes/chw';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Ineza API', time: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/tracker', trackerRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/peers', peersRoutes);
app.use('/api/chw', chwRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start
const PORT = Number(process.env.PORT) || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🌿 Ineza API running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/health`);
    console.log(`🗄️  MongoDB: ${process.env.MONGODB_URI}\n`);
  });
});

export default app;
