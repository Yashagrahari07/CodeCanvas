import { v4 as uuid } from 'uuid';

export const roomRegistry = new Map();
export const ROOM_TTL_MS = 60 * 60 * 1000;
export const MAX_ROOM_PARTICIPANTS = 20;

const creationAttempts = new Map();
const RATE_WINDOW_MS = 60 * 1000;
const MAX_CREATIONS_PER_WINDOW = 10;

export const cleanupExpiredRooms = (roomDocuments) => {
    const now = Date.now();
    for (const [roomId, room] of roomRegistry) {
        if (now - room.lastActivityAt > ROOM_TTL_MS) {
            roomRegistry.delete(roomId);
            roomDocuments?.delete(roomId);
        }
    }
};

export const createRoomHandler = (req, res) => {
    const roomId = uuid();
    const now = Date.now();
    const address = req.ip || 'unknown';
    const attempts = creationAttempts.get(address) || [];
    const recentAttempts = attempts.filter((timestamp) => now - timestamp < RATE_WINDOW_MS);
    if (recentAttempts.length >= MAX_CREATIONS_PER_WINDOW) {
        return res.status(429).json({ message: 'Too many rooms created. Try again later.' });
    }

    recentAttempts.push(now);
    creationAttempts.set(address, recentAttempts);
    roomRegistry.set(roomId, { createdAt: now, lastActivityAt: now });
    res.status(200).json({ roomId });
};