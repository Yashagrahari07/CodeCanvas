import { v4 as uuid } from 'uuid';

export const createRoomHandler = (req, res) => {
    const roomId = uuid();
    res.status(200).json({ roomId });
};