import { Server } from "socket.io";

let io;

// Store online users: userId -> socketId
const onlineUsers = new Map();

/**
 * Initialize Socket.io server
 */
export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    /**
     * Register authenticated user
     */
    socket.on("register", (userId) => {
      if (!userId) return;
      onlineUsers.set(userId, socket.id);
    });

    /**
     * Handle disconnect
     */
    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      console.log("Socket disconnected:", socket.id);
    });
  });
};

/**
 * Send notification to a specific user
 */
export const notifyUser = (userId, message) => {
  const socketId = onlineUsers.get(userId);

  if (socketId && io) {
    io.to(socketId).emit("notification", {
      message,
      timestamp: new Date(),
    });
  }
};
