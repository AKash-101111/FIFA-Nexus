import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes';
import aiRoutes from './routes/ai.routes';
import worldcupRoutes from './routes/worldcup.routes';
import youtubeRoutes from './routes/youtube.routes';
import { connectDB } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security and Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/worldcup', worldcupRoutes);
app.use('/api/youtube', youtubeRoutes);

// MongoDB Connection Setup
connectDB();

app.get('/', (req, res) => {
  res.send('FIFA Nexus API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
