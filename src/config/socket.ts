import { Server } from 'http';
import { Server as IoServer } from 'socket.io';

// This map stores the mapping between driver IDs and socket IDs
export const driverSocketMap = new Map();

const httpServer = new Server();
const io = new IoServer(httpServer);

// When a driver connects, they should emit a 'driverConnected' event with their driver ID
io.on('connection', (socket) => {
    socket.on('driverConnected', (driverId) => {
        driverSocketMap.set(driverId, socket.id);
    });
});

export { io };