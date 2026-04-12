const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    matchId: {
      type: String,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["contest", "mcq", "predict"],
    },

    language: {
      type: String,
      enum: ["cpp", "java", "python"],
    },

    code: String,

    status: {
      type: String,
      enum: ["AC", "WA", "TLE", "MLE", "RE", "CE"],
    },

    compilationTime: { type: Number, default: 0 },
    executionTime: { type: Number, default: 0 },
    memoryTaken: { type: Number, default: 0 },

    selectedOptions: {
      type: [String],
      default: [],
    },

    chosenAnswers: {
      type: [String],
      default: [],
    },

    score: {
      type: Number,
      default: 0,
    },

    submissionTimes : {
      type: [Date] ,
      default: []
    },
    error: String,
  },
  { timestamps: true }
);

submissionSchema.index({ user: 1, matchId: 1 });

module.exports = mongoose.model("Submission", submissionSchema);