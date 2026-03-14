import config from 'config';
import { server } from './app/app';
import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";

const PORT = config.get('port');
const prisma = new PrismaClient();

// Keep your testConnection logic
async function testConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}
// remove finally $disconnect
testConnection();

// -------------------- SOCKET.IO SETUP --------------------
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://snap-z.vercel.app'
    ],
    credentials: true
  }
});

// Map to track online users
const onlineUsers = new Map<string, string>();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // USER JOIN
  socket.on("join", (userId: string) => {
    socket.join(userId);
    onlineUsers.set(userId, socket.id);
    console.log("online user = ", onlineUsers)
    // Broadcast online users
    io.emit("online_users", [...onlineUsers.keys()]);
  });

  // SEND MESSAGE
  socket.on("send_message", async (data) => {
    const { conversationId, senderId, receiverId, text } = data;

    try {
      const [message] = await prisma.$transaction([
        prisma.message.create({
          data: { conversationId, senderId, receiverId, text }
        }),
        prisma.conversation.update({
          where: { id: conversationId },
          data: { createdAt: new Date() }
        })
      ]);

      // send to both users
      io.to(receiverId).emit("receive_message", message);
      io.to(senderId).emit("receive_message", message);

    } catch (error) {
      console.error(error);
    }
  });
      
  // // MARK SEEN
  // socket.on("message_seen", async (messageId: string) => {
  //   const message = await prisma.message.update({
  //     where: { id: messageId },
  //     data: { seen: true }
  //   });

  //   // Notify sender
  //   io.to(message.senderId).emit("message_seen_update", messageId);
  // });

    // TYPING INDICATOR
  socket.on("typing", (receiverId: string) => {
    io.to(receiverId).emit("user_typing");
  });
  socket.on("stop_typing", (receiverId: string) => {
    io.to(receiverId).emit("user_stop_typing", { userId: socket.id });
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) onlineUsers.delete(key);
    });
    io.emit("online_users", [...onlineUsers.keys()]);
    console.log("Socket disconnected:", socket.id);
  });
});

// -------------------- START SERVER --------------------
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});