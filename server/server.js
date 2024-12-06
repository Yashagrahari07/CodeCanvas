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

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 5000;

const userSocketMap = {};
io.on('connection', (socket) => {
  //console.log("Socket connected ",socket.id);
  socket.on(ACTIONS.JOIN, (data) => joinRoom(socket, io, userSocketMap, data));
  socket.on('disconnecting', () => disconnect(socket, io, userSocketMap));
  socket.on(ACTIONS.CODE_CHANGE, (data) => handleCodeChange(socket, data));
  socket.on(ACTIONS.SYNC_CODE, (data) => syncCode(socket, io, data));
});

app.use(cors());
app.use(express.json());

app.use('/user',userRouter);
app.use('/',router);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
