import express from 'express';
import {createRoomHandler} from '../controllers/room.js';

const router=express.Router();

router.post('/createRoom', createRoomHandler);

export default router;