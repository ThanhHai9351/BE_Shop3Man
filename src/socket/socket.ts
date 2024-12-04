import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", 
      methods: ['*'],
      allowedHeaders: ["Content-Type"],
    },
    transports: ["websocket", "polling"],  
    connectionStateRecovery: {}
  });



let count = 0;
io.on('connection', (socket) => {
  count++;
  console.log("số lượng truy cập hiện tại:"+ count);
  socket.broadcast.emit('hi');

  socket.on('chat message', (msg: string) => {
    console.log(msg);
    io.emit('chat message', msg); 
  });

  socket.on('disconnect', () => {
    count--;
    console.log('Client disconnected');
    console.log("số lượng truy cập hiện tại:"+ count);
  });
});

export { app, io, server };
