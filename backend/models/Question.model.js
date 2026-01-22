import mongoose from "mongoose";

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
      type: mongoose.Schema.Types.ObjectId,
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
      type: Map,
      of: Map,
    },
    expectedOutput: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);
export default Question;
