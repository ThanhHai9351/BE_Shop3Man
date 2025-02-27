import { Server } from "socket.io"
import http from "http"
import express from "express"
import Chat from "../models/chat.model"
import Notification from "../models/notification.model"

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

let connectedUsers: Map<string, string> = new Map()
let groupMembers: Map<string, Set<string>> = new Map()

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`)

  //Khi user tham gia chat
  socket.on("user-join", (userId) => {
    console.log(userId)
    connectedUsers.set(userId, socket.id)
    console.log(`User ${userId} joined with socket ID ${socket.id}`)
  })

  //Khi user tham gia nhóm
  socket.on("join-group", ({ userId, groupId }: { userId: string; groupId: string }) => {
    // Nếu nhóm chưa tồn tại, tạo mới
    if (!groupMembers.has(groupId)) {
      groupMembers.set(groupId, new Set())
    }
    // Thêm user vào nhóm
    groupMembers.get(groupId)?.add(userId)
    console.log(`User ${userId} joined group ${groupId}`)
  })

  //Gửi thông báo theo nhóm
  socket.on("send-notification-group", ({ groupId, notification }: { groupId: string; notification: string }) => {
    const members = groupMembers.get(groupId)
    if (members) {
      members.forEach(async (userId) => {
        const newNotification = new Notification({ user: userId, message: notification })
        await newNotification.save()

        const userSocketId = connectedUsers.get(userId) // Lấy socket ID của user
        if (userSocketId) {
          io.to(userSocketId).emit("receive-notification-group", { groupId, notification })
        }
      })
    } else {
      console.log(`Group ${groupId} does not exist.`)
    }
  })

  //User rời nhóm
  socket.on("leave-group", ({ userId, groupId }: { userId: string; groupId: string }) => {
    groupMembers.get(groupId)?.delete(userId)
    console.log(`User ${userId} left group ${groupId}`)
  })

  //2 user gửi meassage cho nhau
  socket.on("send-message", async ({ senderId, receiverId, message }) => {
    console.log({ senderId, receiverId, message })
    const sendSocket = connectedUsers.get(senderId)
    const receiverSocket = connectedUsers.get(receiverId)

    // Lưu tin nhắn vào database
    const chatMessage = new Chat({ senderId, receiverId, message, isSend: true })
    await chatMessage.save()

    if (receiverSocket && sendSocket) {
      io.to(sendSocket).emit("receive-message", { senderId, message, isSend: true })
      io.to(receiverSocket).emit("receive-message", { senderId, message, isSend: false })
    } else {
      socket.emit("error", { message: `User ${receiverId} is not connected.` })
    }
  })

  //Gửi thông báo toàn hệ thống
  socket.on("send-notification", (notification) => {
    io.emit("receive-notification", notification)
  })

  //Rời phòng
  socket.on("disconnect", () => {
    connectedUsers.forEach((id, userId) => {
      if (id === socket.id) {
        connectedUsers.delete(userId)
      }
    })
  })
})

export { app, io, server }

// app.get("/api/chats/:userId/:receiverId", async (req, res) => {
//   const { userId, receiverId } = req.params;

//   const chats = await Chat.find({
//     $or: [
//       { senderId: userId, receiverId },
//       { senderId: receiverId, receiverId: userId },
//     ],
//   }).sort({ timestamp: 1 });

//   res.json(chats);
// });

// app.get("/api/notifications/:groupId", async (req, res) => {
//   const { groupId } = req.params;

//   const notifications = await Notification.find({
//     group: groupId,
//   }).sort({ timestamp: -1 });

//   res.json(notifications);
// });

// fetch(`/api/chats/${userId}/${receiverId}`)
//   .then((res) => res.json())
//   .then((data) => {
//     setMessages(data); // setMessages là hàm lưu trữ tin nhắn trong state
//   })
