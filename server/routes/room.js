import express from 'express';
import {createRoomHandler} from '../controllers/room.js';
import {executeCode} from '../controllers/execution.js';

const router=express.Router();

router.post('/createRoom', createRoomHandler);
router.post('/execute', executeCode);

export default router;