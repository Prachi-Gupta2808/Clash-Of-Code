const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { protect } = require("./src/middlewares/authMiddleware.js") ;

const app = express();

require("./src/libs/db.js");

// Import Routes
const authRoutes = require("./src/routes/authRoutes");
const { uploadAvatar } = require("./src/controllers/uploadController.js");
const { addQuestion } = require("./src/controllers/adminController.js") ;

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.post("/api/upload/avatar", protect , uploadAvatar) ;
app.post("/api/upload/question" , protect , addQuestion) ;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
