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
    title: {
      type: String,
    },
    inputFormat: {
      type: String,
    },
    outputFormat: {
      type: String,
    },
    contraints: { 
      type: String,
    },

    timeLimit: {
      type: Number,
      default: 1.0,
    },
    memoryLimit: {
      type: Number, 
      default: 256,
    },
    // ------------------
    statement: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      default: [],
    },
    preTest: {
      type: String,
    },
    preTestOutput: {
      type: String,
    },
    actualTest: {
      type: String,
    },
    actualTestOutput: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const QuestionModel = mongoose.model("Question", questionSchema);
module.exports = QuestionModel;