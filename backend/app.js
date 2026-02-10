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

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.post("/api/upload/avatar", protect, uploadAvatar);
app.post("/api/upload/question", protect, addQuestion);
app.post("/api/change/username", protect, changeUsername);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;
