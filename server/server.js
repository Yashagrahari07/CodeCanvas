import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/routes.js';
import router from './routes/room.js';
import http from 'http';
import { Server } from 'socket.io';
import ACTIONS from './actionTypes.js';
import {joinRoom,disconnect,handleCodeChange,syncCode} from './controllers/socketController.js';
import { cleanupExpiredRooms, roomRegistry } from './controllers/room.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const corsOrigin = process.env.CORS_ORIGIN || 'https://codecanvas24.vercel.app';
const allowedOrigins = corsOrigin.split(',').map(origin => origin.trim());
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
};
const io = new Server(server, { cors: corsOptions });

const PORT = process.env.PORT || 5000;

const userSocketMap = {};
const roomDocuments = new Map();
io.on('connection', (socket) => {
  //console.log("Socket connected ",socket.id);
  socket.on(ACTIONS.JOIN, (data) => joinRoom(socket, io, userSocketMap, roomDocuments, roomRegistry, data));
  socket.on('disconnecting', () => disconnect(socket, io, userSocketMap, roomDocuments, roomRegistry));
  socket.on(ACTIONS.CODE_CHANGE, (data) => handleCodeChange(socket, roomDocuments, roomRegistry, data));
  socket.on(ACTIONS.SYNC_CODE, (data) => syncCode(socket, io, roomDocuments, roomRegistry, data));
});
const roomCleanupTimer = setInterval(() => cleanupExpiredRooms(roomDocuments), 60 * 1000);
roomCleanupTimer.unref();

app.use(cors(corsOptions));
app.use(express.json());

app.use('/user',userRouter);
app.use('/',router);

const startServer = async () => {
  try {
    const missingConfig = ['MONGO_URI', 'SECRET_KEY'].filter((key) => !process.env[key]);
    if (missingConfig.length) {
      throw new Error(`Missing required environment variables: ${missingConfig.join(', ')}`);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

startServer();
