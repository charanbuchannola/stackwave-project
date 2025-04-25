const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema(
  {
    question: String,
    techCategory: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const chatroomModel = mongoose.model("ChatRoom", chatRoomSchema);

module.exports = chatroomModel;
