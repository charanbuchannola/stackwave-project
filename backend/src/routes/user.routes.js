const express = require("express");

const router = express.Router();

const {
  registerUserController,
  loginUserController,
  getUserProfileController,
  getAllUsersController,
  getUserByIdController,
} = require("../controllers/user.controller");

const {
  chatroomController,
} = require("../controllers/createchatroom.controller");

const { authUser } = require("../middlewares/user.middleware");

const { upload } = require("../services/Multer.service");

router.post("/register", upload, registerUserController);

router.post("/login", loginUserController);

router.get("/profile", authUser, getUserProfileController);

router.post("/create", authUser, chatroomController);

router.get("/allusers", authUser, getAllUsersController);

router.get("/user/:id", authUser, getUserByIdController);

router.get("/me", authUser, (req, res) => {
  res.status(200).json(req.user); // req.user is attached by authUser middleware
});

module.exports = router;
