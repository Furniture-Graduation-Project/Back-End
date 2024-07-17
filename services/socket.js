import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

// Sự kiện khi có client kết nối tới server qua Socket.IO
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  // Lắng nghe sự kiện "disconnect" từ client
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

export { app, io, server };
