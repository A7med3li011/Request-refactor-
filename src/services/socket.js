import { Server } from "socket.io";
import http from "http";
import express from "express";
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "0.0.0.0";
export const app = express();
export const server = http.createServer(app);
export const serverSocket = http.createServer();
export const io = new Server(serverSocket, {
  cors: {
    origin: "*",
    rejectUnauthorized: false,
  },
});

server.listen(PORT, HOST, () => {
  // console.log(`Server running on http://${HOST}:${PORT}`);
  // console.log(`Socket.IO server ready on ws://${HOST}:${PORT}/socket.io/`);
});

io.on("connection", (socket) => {
  // console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    // console.log("Client disconnected:", socket.id);
  });
});
serverSocket.listen(3002);
