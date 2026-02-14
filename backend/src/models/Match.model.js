const mongoose = require("mongoose");
const matchSchema = new mongoose.Schema(
  {
    player1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    player2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    matchId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["ONGOING", "FINISHED", "CANCELLED"],
      default: "ONGOING",
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    theme: {
      type: String,
      enum: ["contest", "mcq", "predict"],
      required: true
    },
    isChallenged: {
      type: Boolean,
      default: false
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    ratingChange: {
      p1: { type: Number, default: 0 },
      p2: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

const MatchModel = mongoose.model("Match", matchSchema);
module.exports = MatchModel;
