import { Server } from './app';
const PORT = process.env.port || '3001';
const server = new Server(PORT)
server.start()