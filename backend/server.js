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

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
<<<<<<< HEAD
app.post("/api/upload/avatar", protect, uploadAvatar);
=======
app.post("/api/upload/avatar", protect , uploadAvatar) ;
app.post("/api/upload/question" , protect , addQuestion) ;
>>>>>>> 46b213d1cf84a68550798a6f24f3db1a29aa6943

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
