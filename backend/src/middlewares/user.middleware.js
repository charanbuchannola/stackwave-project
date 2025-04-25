const userModel = require("../models/usermodel");
const jwt = require("jsonwebtoken");

module.exports.authUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById({
      _id: decoded.id,
    });

    req.user = user;
    console.log(req.user);

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
