import { Server } from 'http';
import { Server as IoServer } from 'socket.io';

const driverSocketMap = new Map();

const httpServer = new Server();
const io = new IoServer(httpServer);

export { io, httpServer, driverSocketMap };
