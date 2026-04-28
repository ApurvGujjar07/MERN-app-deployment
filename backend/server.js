import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import connectDB from './config/db.js';
import { PORT } from './config/utils.js';
import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';
import { connectToRedis } from './services/redis.js';

const app = express();
const port = PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS (keep open for now)
app.use(cors({
  origin: '*',
}));

app.use(cookieParser());
app.use(compression());

// Connect to database
connectDB();

// Connect to redis
connectToRedis();

// ✅ API routes (already PERFECT)
app.use('/api/posts', postsRouter);
app.use('/api/auth', authRouter);

// Health check / root
app.get('/', (req, res) => {
  res.send('Yay!! Backend of wanderlust app is now accessible');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
