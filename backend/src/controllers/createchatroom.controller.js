const ChatRoom = require("../models/chatroom.model");

module.exports.chatroomController = async (req, res) => {
  const { question, techCategory } = req.body;
  try {
    const newRoom = await ChatRoom.create({
      question,
      techCategory,
      createdBy: req.user._id,
      participants: [req.user._id],
    });
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(500).json({ error: "Failed to create room" });
  }
};

module.exports.getallroomsController = async (req, res) => {
  try {
    const rooms = await ChatRoom.find()
      .populate("createdBy", "username media")
      .populate("participants", "username media");

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
};
module.exports.joinroomController = async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.roomId);
    console.log(room);
    if (!room.participants.includes(req.user._id)) {
      room.participants.push(req.user._id);
      await room.save();
    }
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: "Join room failed" });
  }
};

module.exports.deleteRoomController = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const userId = req.user._id; // assuming auth middleware attaches this

    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Only creator can delete
    if (room.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this room" });
    }

    await ChatRoom.findByIdAndDelete(roomId);
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ message: "Server error while deleting room" });
  }
};
