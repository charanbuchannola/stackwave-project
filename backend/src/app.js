const express = require("express");
const userRoutes = require("./routes/user.routes");
const questionRoutes = require("./routes/questionAnswer.routes");
const chatRoutes = require("./routes/chat.routes");
const cors = require("cors");
const app = express();

const baseUrl = "https://stackwave-project-backend.onrender.com";

app.use(
  cors({
    origin: [baseUrl, "http://localhost:5173"], // Add all allowed frontend origins here
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);
app.use("/questions", questionRoutes);
app.use("/chat", chatRoutes);

module.exports = app;
