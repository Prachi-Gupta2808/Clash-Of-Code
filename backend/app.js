// app.js
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("./src/libs/db.js");

const authRoutes = require("./src/routes/authRoutes");
const { protect } = require("./src/middlewares/authMiddleware");
const { uploadAvatar } = require("./src/controllers/uploadController");
const { addQuestion } = require("./src/controllers/adminController");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const { changeUsername } = require("./src/controllers/userController.js");
const adminRoutes = require("./src/routes/adminRoutes");
const matchRoutes = require("./src/routes/matchRoutes.js");
const submitRouter = require("./src/routes/submitRouter.js");

const questionModel = require("./src/models/Question.model.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://clash-of-code-ten.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use("/api/auth", authRoutes);
app.post("/api/upload/avatar", protect, uploadAvatar);
app.post("/api/upload/question", protect, addQuestion);
app.post("/api/change/username", protect, changeUsername);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/submit", submitRouter);

module.exports = app;
