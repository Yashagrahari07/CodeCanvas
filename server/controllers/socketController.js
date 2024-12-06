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

export const joinRoom = (socket, io, userSocketMap, { roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId, io, userSocketMap);
    clients.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTIONS.JOINED, {
            clients,
            username,
            socketId: socket.id,
        });
    });
};
export const disconnect = (socket, io, userSocketMap) => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
        socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
            socketId: socket.id,
            username: userSocketMap[socket.id],
        });
    });
    delete userSocketMap[socket.id];
    socket.leave();
};

export const handleCodeChange = (socket, { roomId, code }) => { 
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
};

export const syncCode = (socket, io, { socketId, code }) => {
    //console.log(code);
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
};
