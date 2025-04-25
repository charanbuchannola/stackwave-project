import { io } from "socket.io-client";

const baseUrl = "http://localhost:3000";

const socket = io(baseUrl, {
  auth: {
    token: localStorage.getItem("token"),
  },
});

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

// Example of handling a custom event
socket.on("message", (data) => {
  console.log("Message received:", data);
});

export default socket;
