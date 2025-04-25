const express = require("express");
const router = express.Router();

const {
  chatroomController,
  getallroomsController,
  joinroomController,
  deleteRoomController,
} = require("../controllers/createchatroom.controller");

const { authUser } = require("../middlewares/user.middleware");

router.post("/create", authUser, chatroomController);
router.get("/rooms", authUser, getallroomsController);
router.post("/room/:roomId", authUser, joinroomController);
router.delete("/room/:roomId", authUser, deleteRoomController);

module.exports = router;
