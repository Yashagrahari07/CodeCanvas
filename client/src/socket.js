import { io } from 'socket.io-client';

const initSocket = async () => {
    const options = {
        forceNew: true,
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports: ['websocket'],
    };
    
    return io('https://codealong-1npm.onrender.com/', options);
};

export default initSocket;
