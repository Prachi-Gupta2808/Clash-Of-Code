const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    theme: {
      type: String,
      ref: "Theme",
    },
    statement: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      default: [],
    },
    preTest: {
      type : String
    },
    expectedOutput: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const QuestionModel = mongoose.model("Question", questionSchema);
module.exports = QuestionModel;
