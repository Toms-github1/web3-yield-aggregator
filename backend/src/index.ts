import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import productRoutes from '@/routes/products';
import chainRoutes from '@/routes/chains';
import portfolioRoutes from '@/routes/portfolio';
import authRoutes from '@/routes/auth';
import { errorHandler } from '@/middleware/errorHandler';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/chains', chainRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket for real-time updates
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    console.log('Received:', message);
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Export WebSocket for use in other modules
export { wss };

// Error handling
app.use(errorHandler);

const PORT = process.env.BACKEND_PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 WebSocket server on ws://localhost:${PORT}`);
});
