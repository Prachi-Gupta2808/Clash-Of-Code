const mongoose = require("mongoose");

const activeDaySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    submissionCount: {
      type: Number,
      default: 1,
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

activeDaySchema.index({ userId: 1, date: 1 }, { unique: true });

const activeDaysModel = mongoose.model("ActiveDay", activeDaySchema);
module.exports = activeDaysModel;
