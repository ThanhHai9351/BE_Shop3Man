import { Server } from "socket.io"
import http from "http"
import express from "express"
import Message from "../models/message.model"
import { getConversationIdContain, updateConversationFuction } from "../api/services/conservation.service"

const app = express()

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:4200"],
    methods: ["*"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  transports: ["websocket", "polling"],
  connectionStateRecovery: {},
})

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`)

  // Client gửi sự kiện để tham gia phòng (conversation)
  socket.on("joinRoom", (room) => {
    socket.join(room)
    console.log(`Socket ${socket.id} joined room ${room}`)
  })

  // Xử lý gửi tin nhắn
  socket.on("sendMessage", async (data) => {
    try {
      console.log(`Message from ${data.senderId} in room ${data.conversationId}: ${data.content}`)

      // Lưu tin nhắn vào MongoDB
      const message = new Message({
        conversationId: data.conversationId,
        senderId: data.senderId,
        content: data.content,
      })

      await updateConversationFuction(data.conversationId, data.content)
      await message.save()

      // Phát tin nhắn mới đến tất cả client trong room
      io.to(data.conversationId).emit("messageReceived", message)

      const conversationId = (await getConversationIdContain(data.conversationId, data.senderId)) || ""
      io.to(conversationId.toString()).emit("notification", message)
    } catch (err) {
      console.error(err)
    }
  })

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`)
  })
})

export { app, io, server }
