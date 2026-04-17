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

    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    isTie : { type : Boolean , default : true },
    submissions: {
      type: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          answers: [String],
          score: Number,
          submittedAt: Date,
          submissionTimes: [Date],
        },
      ],
      default: [],
    },

    resultDeclared: {
      type: Boolean,
      default: false,
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
      required: true,
    },

    isChallenged: {
      type: Boolean,
      default: false,
    },

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    ratingChange: {
      p1: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        delta: {
          type: Number,
          default: 0,
        },
      },
      p2: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        delta: {
          type: Number,
          default: 0,
        },
      },
    },
  },
  { timestamps: true }
);

// index for faster queries
matchSchema.index({ player1: 1, player2: 1 });

const MatchModel = mongoose.model("Match", matchSchema);

module.exports = MatchModel;