// backend/socket.js
let ioInstance;

function setupSocket(server) {
  const { Server } = require("socket.io");
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // frontend
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ New socket connected:", socket.id);

    socket.on("join-family", (familyCode) => {
      socket.join(familyCode);
      console.log(`🔵 Socket ${socket.id} joined room: ${familyCode}`);
    });
  });

  ioInstance = io;
}

function getIO() {
  if (!ioInstance) throw new Error("Socket.io not initialized!");
  return ioInstance;
}

module.exports = { setupSocket, getIO };
