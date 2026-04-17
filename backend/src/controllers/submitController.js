const Question = require("../models/Question.model");
const Submission = require("../models/Submission.model");
const Match = require("../models/Match.model");
const { getIO } = require("../sockets/socket");
const { decideWinner } = require("../utils/decideWinner");

function normalize(s) {
  if (!s) return "";

  return s.trim().replace(/\s+/g, " ");
}

exports.submitCode = async (req, res) => {
  try {
    const code = req.body.code.replace(/\r\n/g, "\n");
    const language = req.body.language;
    const qid = req.body.questionId;
    const matchId = req.body.matchId;
    const submissionTimes = req.body.submissionTimes;
    console.log(submissionTimes);

    const question = await Question.findById(qid);
    if (!question) {
      return res.status(400).json({ msg: "Invalid question" });
    }

    const match = await Match.findOne({ matchId });

    if (!match || match.status !== "ONGOING") {
      return res.status(400).json({ msg: "Match not active" });
    }

    if (match.resultDeclared) {
      return res.status(400).json({ msg: "Match already finished" });
    }

    const already = match.submissions.find(
      (s) => s.userId.toString() === req.user._id.toString()
    );

    if (already) {
      return res.status(400).json({ msg: "Already submitted" });
    }

    const compiledCode = await fetch(`${process.env.AWS_BACKEND_INSTANCE_URL}/compile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        language,
        input: question.actualTest,
      }),
    });

    const compiledCodeJSON = await compiledCode.json();

    const actualOutput = normalize(compiledCodeJSON.output);
    const expectedOutput = normalize(question.actualTestOutput);

    console.log(actualOutput);
    

    let verdict = compiledCodeJSON.verdict;

    // till this point ,  verdict = AC means the code did run successfully, no errors
    if (verdict === "AC" && actualOutput !== expectedOutput) {
      verdict = "WA";
    }

    await Submission.create({
      user: req.user._id,
      matchId,
      language,
      code,
      status: verdict,
      submissionTimes
    });

    if (verdict === "AC") {
      match.submissions.push({
        userId: req.user._id,
        answers: [],
        score: 1,
        submittedAt: new Date(),
        submissionTimes
      });

      await match.save();

      const io = getIO();

      io.to(matchId).emit("USER_SUBMITTED", {
        userId: req.user._id,
      });

      if (match.submissions.length === 2 && !match.resultDeclared) {
        await decideWinner(match);
      }
    }

    return res.status(200).send({ ...compiledCodeJSON, verdict });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.submitOutput = async (req, res) => {
  try {
    const { finalAnswers, submissionTimes , matchId } = req.body;
    const match = await Match.findOne({ matchId }).populate("questions");
    const questions = match.questions;



    if (!match || match.status !== "ONGOING") {
      return res.status(400).json({ msg: "Match not active" });
    }

    
    if (match.resultDeclared) {
      return res.status(400).json({ msg: "Match already finished" });
    }

    const already = match.submissions.find((s) => {
      return s.userId.toString() === req.user._id.toString();
    });

    if (already) {
      return res.status(400).json({ msg: "You have already submitted your answer" })
    }

    
    let score = 0;
    finalAnswers.forEach((val, ind) => {
      if (normalize(val) === normalize(questions[ind].actualTestOutput)) {
        score++;
      }
    })

    await Submission.create({
      user: req.user._id,
      matchId: matchId,
      chosenAnswers: finalAnswers,
      score: score,
      submissionTimes,
      // Compilation Time
      // Execution Time
      // Memory Taken
    });

    match.submissions.push({
      userId: req.user._id,
      answers: finalAnswers,
      score,
      submittedAt: new Date(),
      submissionTimes,
    });

    await match.save();

    const io = getIO();
    io.to(matchId).emit("USER_SUBMITTED", {
      userId: req.user._id,
    });

    if (match.submissions.length === 2 && !match.resultDeclared) {
      await decideWinner(match);
    }

    return res.status(200).json({ msg: "Submitted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.submitMcq = async (req, res) => {
  try {
    const { finalAnswers, matchId , submissionTimes } = req.body;

    const match = await Match.findOne({ matchId }).populate("questions");

    if (!match || match.status !== "ONGOING") {
      return res.status(400).json({ msg: "Match not active" });
    }

    if (match.resultDeclared) {
      return res.status(400).json({ msg: "Match already finished" });
    }

    const questions = match.questions;

    const already = match.submissions.find(
      (s) => s.userId.toString() === req.user._id.toString()
    );

    if (already) {
      return res.status(400).json({
        msg: "You have already submitted your answer",
      });
    }
    
    if (finalAnswers.length !== questions.length) {
      return res.status(400).json({ msg: "Invalid answers submitted" });
    }

    let score = 0;

    questions.forEach((q, ind) => {
      if (finalAnswers[ind] === q.actualTestOutput) {
        score++;
      }
    });

    await Submission.create({
      user: req.user._id,
      matchId,
      selectedOptions: finalAnswers,
      score,
      submissionTimes,
    });

    match.submissions.push({
      userId: req.user._id,
      answers: finalAnswers,
      score,
      submittedAt: new Date(),
      submissionTimes,
    });

    await match.save();

    const io = getIO();

    io.to(matchId).emit("USER_SUBMITTED", {
      userId: req.user._id,
    });

    if (match.submissions.length === 2 && !match.resultDeclared) {
      await decideWinner(match);
    }

    return res.status(200).json({ msg: "Submitted successfully" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.runCode = async (req , res) => {
  try {
    const code = req.body.code.replace(/\r\n/g, "\n") ;
    const language = req.body.language ;
    const customInput = req.body.input ;


    const compiledCode = await fetch(`${process.env.AWS_BACKEND_INSTANCE_URL}/compile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        language,
        input: customInput,
      }),
    });

    const compiledCodeJSON = await compiledCode.json();
    console.log(compiledCodeJSON);
    return res.status(200).json({ output: compiledCodeJSON.output });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};