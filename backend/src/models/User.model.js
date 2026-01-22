import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const statsSchema = new mongoose.Schema(
  {
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    avgSolveTime: { type: Number, default: 0 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    active: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 1200,
    },
    title: {
      type: String,
      default: "Newbie",
    },
    friendList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    stats: statsSchema,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
