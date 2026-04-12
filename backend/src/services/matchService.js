const Match = require("../models/Match.model");
const Question = require("../models/Question.model");
const { handleMatchTimeout } = require("../utils/matchTimeout");

exports.createMatch = async (
  player1_ID,
  player2_ID,
  roomId,
  mode,
  isChallenged = false
) => {
  const questionCount = mode === "mcq" ? 10 : mode === "predict" ? 5 : 1;

  const questions = await Question.aggregate([
    { $match: { theme: mode } },
    { $sample: { size: questionCount } },
  ]);

  if (!questions.length) {
    throw new Error("No questions found for this theme");
  }
  const now = new Date();

  const duration = mode === "mcq" ? 1 : mode === "predict" ? 2 : 3; // minutes

  const newMatch = await Match.create({
    player1: player1_ID,
    player2: player2_ID,
    matchId: roomId,
    theme: mode,
    isChallenged,
    questions: questions.map((q) => q._id),
    status: "ONGOING",
    startTime: now,
    endTime: new Date(now.getTime() + duration * 60 * 1000),
  });

  handleMatchTimeout(roomId, duration);
  return questions;
};
