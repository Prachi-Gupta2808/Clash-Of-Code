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

const questionModel = require("./src/models/Question.model.js") ;

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
app.use("/api/match", matchRoutes) ;

function normalize(s) {
  return s.trim().replace(/\s+/g, ' ');
}

app.post("/compile", async (req, res) => {
  const code = req.body.code.replace(/\r\n/g, "\n"); // converting the code into a standard format by removing the \r \t characters
  const language = req.body.language;
  console.log({
    code: code,
  });

  const qid = "698f99e2a4e31284417052a0";
  const question = await questionModel.findOne({ _id : qid });
  console.log(question);
  
  const qInput = question.actualTest;
  
  // (`http://35.154.66.175:3000/compile`
  const compiledCode = await fetch(`http://localhost:3000/compile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: code,
      language: language,
      input: qInput,
    }),
  });
  
  const compiledCodeJSON = await compiledCode.json();
  const actualOutput = normalize(compiledCodeJSON.output);
  const expectedOutput = normalize(question.actualTestOutput);

  console.log({
    expected: expectedOutput,
    actutal: actualOutput
  });
  
  if (
    compiledCodeJSON.verdict == "AC" &&
    actualOutput.trim() !== expectedOutput.trim()
  ) {
    compiledCodeJSON.verdict = "WA";
  }

  return res.status(200).send(compiledCodeJSON);
});


module.exports = app;
