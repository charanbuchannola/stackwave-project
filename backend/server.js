const { Server } = require("socket.io");
require("dotenv").config();
const app = require("./src/app");
const jwt = require("jsonwebtoken");
const connect = require("./src/db/db");
connect();

const server = require("http").createServer(app);

const baseUrl = "https://stackwave-project-backend.onrender.com";

const io = new Server(server, {
  cors: {
    origin: [baseUrl],
    methods: ["GET", "POST"],
  },
});

// Authenticate socket connections using JWT
io.use((socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("Connection rejected: No token provided");
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return next(new Error("Authentication error"));
    }

    socket.user = decoded;
    next();
  } catch (error) {
    console.error("Error during authentication:", error);
    return next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.user?.name || "Unknown User");

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.user?.name} joined room ${roomId}`);
    io.to(roomId).emit("receive-message", {
      user: "System",
      message: `${socket.user?.name || "Someone"} joined.`,
    });
  });

  socket.on("send-message", ({ roomId, message }) => {
    const user = socket.user?.name || "Unknown";
    const msgData = { user, message };
    socket.broadcast.to(roomId).emit("receive-message", msgData);
  });

  // ✅ Handle real-time code sync
  socket.on("code-change", ({ roomId, code }) => {
    socket.broadcast.to(roomId).emit("code-update", { code });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
