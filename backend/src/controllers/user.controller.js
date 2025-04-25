const userModel = require("../models/usermodel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { uploadImage } = require("../services/Cloudinary.service");
// const cookie = require("cookie-parser");

module.exports.registerUserController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageBuffer = req.file?.buffer;
    const imagedata = await uploadImage(imageBuffer);

    const { username, email, password } = req.body;

    if (!username) {
      return res.status(400).json({ message: "username is required" });
    }

    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "password is required" });
    }

    const userExist = await userModel.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (userExist) {
      return res.status(400).json({ message: "user already exist" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username: username,
      email: email,
      password: hashPassword,
      media: imagedata,
    });

    console.log(user);

    const token = jwt.sign(
      { id: user._id, name: user.username },
      process.env.JWT_SECRET
    );

    res.status(200).json({ token, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "password is required" });
    }
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, name: user.username },
      process.env.JWT_SECRET
    );
    res.status(200).json({ token, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find(); // Fetch all users from the database
    res.status(200).json(users); // Return users in the response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

module.exports.getUserByIdController = async (req, res) => {
  try {
    console.log("Fetching user by ID:", req.params.id); // Log the user ID

    const user = await userModel
      .findById(req.params.id)
      .populate("questions")
      .populate("answers");
    // Ensure "votes" is a valid field in the schema

    if (!user) {
      console.log("User not found for ID:", req.params.id); // Log if user is not found
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User fetched successfully:", user); // Log the fetched user
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user by ID:", err); // Log the error
    res.status(500).json({
      message:
        "Error fetching user. Please check the server logs for more details.",
    });
  }
};

module.exports.updateUserProfile = async (req, res) => {
  const { name, media, bio } = req.body;

  try {
    const user = await userModel.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.media = media || user.media;
    user.bio = bio || user.bio;

    const updated = await user.save();
    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.getUserProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.updateUserProfileController = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
