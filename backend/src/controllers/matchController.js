const User = require("../models/User.model");
const Question = require("../models/Question.model");
const Match = require("../models/Match.model");
const Submission = require("../models/Submission.model");

const {
  calculateTimeTaken,
  calculateAvgTime,
} = require("../utils/calculateTimeTaken");

exports.getInformation = async (req, res) => {
  const matchId = req.body.matchId;

  // don't include actualTest and actualTestOutput in the response
  const match = await Match.findOne({ matchId })
    .populate("questions")
    .select("-actualTest -actualTestOutput");

  if (!match) {
    return res.status(404).send({
      msg: "Match Not Found",
    });
  }
  return res.status(200).send(match);
};

exports.getMatchAnalytics = async (req, res) => {
  try {
    const match = await Match.findOne({ matchId: req.params.matchId })
      .populate("player1 player2", "name")
      .populate("questions");

    const isPlayer1 = req.user._id.equals(match.player1._id);
    const you = isPlayer1 ? match.player1 : match.player2;
    const opponent = isPlayer1 ? match.player2 : match.player1;

    const yourDetails = await User.findOne({ _id: you._id });
    const oppDetails = await User.findOne({ _id: opponent._id });

    const yourSub = match.submissions.find((s) => s.userId.equals(you._id));
    const oppSub = match.submissions.find((s) => s.userId.equals(opponent._id));

    let yourCodeSubmission = "";
    let opponentCodeSubmission = "";

    if (match.theme === "contest") {
      yourCodeSubmission = await Submission.findOne({ matchId: match.matchId, user: you._id, status: "AC" });
      opponentCodeSubmission = await Submission.findOne({ matchId: match.matchId, user: opponent._id, status: "AC" });
    }

    const chartData = [];
    const questionsBreakdown = [];

    match.questions.forEach((q, index) => {
      // Calculate time taken
      const yourTime = yourSub
        ? calculateTimeTaken(index, yourSub.submissionTimes, match.startTime)
        : 0;
      const oppTime = oppSub
        ? calculateTimeTaken(index, oppSub.submissionTimes, match.startTime)
        : 0;

      // Map the answers
      const yourAnswer = yourSub ? yourSub.answers[index] : null;
      const actualAnswer = q.actualTestOutput;

      const isCorrect =
        yourAnswer && actualAnswer && yourAnswer.trim() === actualAnswer.trim();

      chartData.push({
        name: `Q${index + 1}`,
        youTime: yourTime,
        oppTime: oppTime,
      });

      // Include ALL schema properties needed for UI rendering
      questionsBreakdown.push({
        id: q._id,
        title: q.title,
        statement: q.statement,
        inputFormat: q.inputFormat,
        outputFormat: q.outputFormat,
        constraints: q.constraints,
        // Map preTest to a testCases array format for the frontend
        testCases: q.preTest ? [{ input: q.preTest, output: q.preTestOutput }] : [],
        actualAnswer: actualAnswer,
        yourAnswer:
          yourAnswer ||
          (match.theme === "contest" ? "Wrong Answer" : "Not Answered"),
        isCorrect: isCorrect,
        timeTaken: yourTime,
      });
    });

    res.json({
      matchType: match.theme,
      winnerId: match.winner,
      you: {
        id: you._id,
        name: yourDetails.username,
        score: yourSub?.score || 0,
        accuracy: yourSub
          ? Math.round((yourSub.score / match.questions.length) * 100)
          : 0,
        avgTime: calculateAvgTime(yourSub?.submissionTimes, match.startTime),
      },
      opponent: {
        id: opponent._id,
        name: oppDetails.username,
        score: oppSub?.score || 0,
        accuracy: oppSub
          ? Math.round((oppSub.score / match.questions.length) * 100)
          : 0,
        avgTime: calculateAvgTime(oppSub?.submissionTimes, match.startTime),
      },
      chartData,
      questionsBreakdown,
      yourCodeSubmission,
      opponentCodeSubmission,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getRecentMatches = async (req, res) => {
  try {
    const userId = req.user._id;

    const matches = await Match.find({
      $or: [{ player1: userId }, { player2: userId }],
      status: "FINISHED",
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("player1", "username avatar")
      .populate("player2", "username avatar")
      .populate("winner", "username");

    const formatted = matches.map((match) => {
      const isPlayer1 = match.player1._id.equals(userId);
      const you = isPlayer1 ? match.player1 : match.player2;
      const opponent = isPlayer1 ? match.player2 : match.player1;
      const isWinner = match.winner?._id.equals(userId);

      return {
        matchId: match.matchId,
        theme: match.theme,
        you: {
          username: you.username,
          avatar: you.avatar,
        },
        opponent: {
          username: opponent.username,
          avatar: opponent.avatar,
        },
        isWinner,
        createdAt: match.createdAt,
      };
    });

    return res.status(200).json(formatted);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getMatchDuration = async (req, res) => {
  try {
    const match = await Match.findOne({ matchId: req.params.matchId }) ;
    if (!match) {
      return res.status(404).send({
        msg: "Match Not Found",
      });
    }

    const data = {
      startTime: match.startTime,
      endTime: match.endTime
    }
    
    return res.status(200).send(data);
  } catch(err) {
    console.error("Error in getMatchDuration", err.message);
    res.status(500).json({ error: err.message });
  }
}