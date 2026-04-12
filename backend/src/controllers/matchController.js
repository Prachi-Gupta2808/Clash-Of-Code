const User = require("../models/User.model");
const Question = require("../models/Question.model");
const Match = require("../models/Match.model");
const { calculateTimeTaken , calculateAvgTime } = require("../utils/calculateTimeTaken") ;

exports.getInformation = async (req, res) => {
  const matchId = req.body.matchId;

  // don't include actualTest and actualTestOutput in the response
  const match = await Match.findOne({ matchId }).populate("questions").select("-actualTest -actualTestOutput");

  if (!match) {
    return res.status(404).send({
      msg: "Match Not Found"
    })
  }
  return res.status(200).send(match)
}

exports.getMatchAnalytics = async (req, res) => {
  try {
    const match = await Match.findOne({ matchId: req.params.matchId })
    .populate("player1 player2", "name")
    .populate("questions");
    
    const isPlayer1 = req.user._id.equals(match.player1._id);
    const you = isPlayer1 ? match.player1 : match.player2;
    const opponent = isPlayer1 ? match.player2 : match.player1;

    const yourDetails = await User.findOne({ _id : you._id });
    const oppDetails = await User.findOne({ _id : opponent._id });
    
    const yourSub = match.submissions.find(s => s.userId.equals(you._id));
    const oppSub = match.submissions.find(s => s.userId.equals(opponent._id));
    
    const chartData = [];
    const questionsBreakdown = [];

    
    match.questions.forEach((q, index) => {
      // Calculate time taken
      const yourTime = yourSub ? calculateTimeTaken(index, yourSub.submissionTimes, match.startTime) : 0;
      const oppTime = oppSub ? calculateTimeTaken(index, oppSub.submissionTimes, match.startTime) : 0;


      // Map the answers
      const yourAnswer = yourSub ? yourSub.answers[index] : null;

      // Updated to match your Question schema
      const actualAnswer = q.actualTestOutput;

      // For MCQ and Predict, a direct string comparison works. 
      // trim whitespace if predicting output
      const isCorrect = yourAnswer && actualAnswer &&
        yourAnswer.trim() === actualAnswer.trim();

      chartData.push({
        name: `Q${index + 1}`,
        youTime: yourTime,
        oppTime: oppTime
      });

      questionsBreakdown.push({
        id: q._id,
        statement: q.statement,
        actualAnswer: actualAnswer,
        yourAnswer: yourAnswer || ((match.theme === "contest") ? "Wrong Answer" : "Not Answered"),
        isCorrect: isCorrect,
        timeTaken: yourTime
      });
    });


    res.json({
      matchType: match.theme,
      winnerId: match.winner,
      you: {
        id: you._id,
        name: yourDetails.username,
        score: yourSub?.score || 0,
        accuracy: yourSub ? Math.round((yourSub.score / match.questions.length) * 100) : 0,
        avgTime: calculateAvgTime(yourSub?.submissionTimes, match.startTime)
      },
      opponent: {
        id: opponent._id,
        name: oppDetails.username,
        score: oppSub?.score || 0,
        accuracy: oppSub ? Math.round((oppSub.score / match.questions.length) * 100) : 0,
        avgTime: calculateAvgTime(oppSub?.submissionTimes, match.startTime)
      },
      chartData,
      questionsBreakdown
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};