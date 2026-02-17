const Match = require("../models/Match.model");
const Question = require("../models/Question.model");

exports.createMatch = async (player1_ID, player2_ID, roomId, mode) => {
  const questionCount = mode === "mcq" ? 10 : ("predict" ? 5 : 1) ;

  const questions = await Question.aggregate([
    { $match: { theme: mode } },
    { $sample: { size: questionCount } },
  ]);

  if (!questions.length) {
    throw new Error("No questions found for this theme");
  }

  const newMatch = await Match.create({
    player1: player1_ID,
    player2: player2_ID,
    matchId: roomId,
    theme: mode,
    isChallenged: false,
    questions: questions.map((q) => q._id),
    status: "ONGOING",
  });

  return questions;
};
