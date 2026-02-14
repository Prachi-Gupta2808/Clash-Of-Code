const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },

    language: {
      type: String,
      enum: ["cpp", "java", "python"],
      required: true,
    },

    code: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["AC", "WA", "TLE", "MLE", "RE", "CE"],
      required: true,
    },

    compilationTime: { type: Number , default: 0 },  
    executionTime: { type: Number , default: 0 },    
    memoryTaken: { type: Number , default: 0 },      

    error: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
