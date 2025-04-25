const express = require("express");
const { authUser } = require("../middlewares/user.middleware");
const {
  createQuestionController,
  getQuestionsController,
  getQuestionByIdController,
  createAnswerController,
} = require("../controllers/question.controller");
const router = express.Router();

router.post("/createquestion", authUser, createQuestionController);

router.get("/getquestions", authUser, getQuestionsController);

router.get("/question/:id", authUser, getQuestionByIdController);

router.post("/createanswer/:questionId", authUser, createAnswerController);

module.exports = router;
