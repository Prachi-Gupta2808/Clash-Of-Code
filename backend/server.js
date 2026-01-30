const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { protect } = require("./src/middlewares/authMiddleware.js");

const app = express();

require("./src/libs/db.js");

const authRoutes = require("./src/routes/authRoutes");
const { uploadAvatar } = require("./src/controllers/uploadController.js");
const { addQuestion } = require("./src/controllers/adminController.js") ;

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.post("/api/upload/avatar", protect , uploadAvatar) ;
app.post("/api/upload/question" , protect , addQuestion) ;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
