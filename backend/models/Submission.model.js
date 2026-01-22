import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    submissionTime: {
      type: Date,
      default: Date.now,
    },
    compilationTime: Date,
    error: String,
    language: {
      type: String,
      enum: ["cpp", "java", "python"],
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    memoryTaken: Number,
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
