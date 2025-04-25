const conversationModel = require("../models/conversation.model");
const messageModel = require("../models/message.model");

module.exports.messageController = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.id;
    const { message } = req.body;
  } catch (err) {
    console.log(err);
  }
};

module.exports.joinroomController = async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.roomId);
    if (!room.participants.includes(req.user._id)) {
      room.participants.push(req.user._id);
      await room.save();
    }
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: "Join room failed" });
  }
};
