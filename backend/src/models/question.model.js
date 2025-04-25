const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },

    tags: [String],

    askedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    votes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vote",
        
      },
    ],
    answers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
