import ACTIONS from '../actionTypes.js';

function getAllConnectedClients(roomId, io, userSocketMap) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

export const joinRoom = (socket, io, userSocketMap, roomDocuments, { roomId, username } = {}) => {
    if (typeof roomId !== 'string' || !roomId.trim() || typeof username !== 'string' || !username.trim()) {
        return;
    }

    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const roomCode = roomDocuments.get(roomId);
    const clients = getAllConnectedClients(roomId, io, userSocketMap);
    clients.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTIONS.JOINED, {
            clients,
            username,
            socketId: socket.id,
            code: roomCode,
        });
    });
};
export const disconnect = (socket, io, userSocketMap, roomDocuments) => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
        socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
            socketId: socket.id,
            username: userSocketMap[socket.id],
        });
        if (io.sockets.adapter.rooms.get(roomId)?.size === 1) {
            roomDocuments.delete(roomId);
        }
    });
    delete userSocketMap[socket.id];
    socket.leave();
};

export const handleCodeChange = (socket, roomDocuments, { roomId, code } = {}) => {
    if (!socket.rooms.has(roomId) || typeof code !== 'string') {
        return;
    }

    roomDocuments.set(roomId, code);
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
};

export const syncCode = (socket, io, roomDocuments, { roomId, socketId, code } = {}) => {
    const targetSocket = io.sockets.sockets.get(socketId);
    if (!socket.rooms.has(roomId) || !targetSocket?.rooms.has(roomId) || typeof code !== 'string' || roomDocuments.has(roomId)) {
        return;
    }

    roomDocuments.set(roomId, code);
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
};
