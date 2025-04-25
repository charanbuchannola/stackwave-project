const questionModel = require("../models/question.model");
const answerModel = require("../models/answer.model");

const userModel = require("../models/usermodel");

module.exports.createQuestionController = async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    const userId = req.user._id;

    if (!title || !body || !tags || tags.length === 0) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const newQuestion = await questionModel.create({
      title,
      body,
      tags,
      askedBy: userId,
    });

    // push the question to the user's profile
    await userModel.findByIdAndUpdate(userId, {
      $push: { questions: newQuestion._id },
    });

    res.status(201).json({ newQuestion });
  } catch (err) {
    console.error("Error creating question:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getQuestionsController = async (req, res) => {
  try {
    const questions = await questionModel
      .find({})
      .populate("askedBy", "username media") // show user's basic info
      .sort({ createdAt: -1 }); // latest questions first

    res.status(200).json({ questions });
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// controllers/questionController.js
module.exports.getQuestionByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await questionModel
      .findById(id)
      .populate("askedBy", "username media")
      .populate({
        path: "answers",
        populate: { path: "answeredBy", select: "username media" },
      });

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json({ question });
  } catch (err) {
    console.error("Error fetching question:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.createAnswerController = async (req, res) => {
  try {
    const { content } = req.body;
    const { questionId } = req.params;
    const userId = req.user._id;

    if (!content) {
      return res.status(400).json({ message: "Answer content is required." });
    }

    // Create answer
    const answer = await answerModel.create({
      content,
      question: questionId,
      answeredBy: userId,
    });

    // Link answer to question
    await questionModel.findByIdAndUpdate(questionId, {
      $push: { answers: answer._id },
    });

    // Link answer to user
    await userModel.findByIdAndUpdate(userId, {
      $push: { answers: answer._id },
    });

    // Populate user info before sending
    const populatedAnswer = await answerModel
      .findById(answer._id)
      .populate("answeredBy", "name media");

    res.status(201).json(populatedAnswer);
  } catch (error) {
    console.error("Failed to create answer:", error);
    res.status(500).json({ message: "Server error while creating answer." });
  }
};
