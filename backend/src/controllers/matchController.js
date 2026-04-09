const User = require("../models/User.model");
const Question = require("../models/Question.model");
const Match = require("../models/Match.model");

exports.createMatch = async (req, res) => {
  let roomId = req.body.roomId;

  const questions = await Question.aggregate([
    { $match: { theme: "contest" } },
    { $sample: { size: 1 } },
  ]);

  if (questions.length === 0) {
    return res.stats(404).send({
      msg: "No question found",
    });
  }

  const newMatch = await Match.create({
    player1: "6981d89fdafc2f16afd3a4f3",
    player2: "6982194bd23661897ab2593d",
    matchId: roomId,
    theme: "contest",
    isChallenged: false,
    questions: questions.map((q) => q._id),
    status: "ONGOING",
  });
  console.log("created") ;

  return res.status(202).send({
    msg: "Match Created Successfully",
    questions
  });
};

exports.getInformation = async (req , res) => {
  const matchId = req.body.matchId;
  
  // don't include actualTest and actualTestOutput in the response
  const match = await Match.findOne({ matchId }).populate("questions").select("-actualTest -actualTestOutput");

  if(!match) {
    return res.status(404).send({
      msg : "Match Not Found"
    })
  }
  return res.status(200).send(match)
}