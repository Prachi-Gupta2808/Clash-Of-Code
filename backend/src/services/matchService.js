const Match = require("../models/Match.model");
const Question = require("../models/Question.model");
const { handleMatchTimeout } = require("../utils/matchTimeout");

exports.createMatch = async (
  player1_ID,
  player2_ID,
  roomId,
  mode,
  isChallenged = false,
  player1_rating = 0,
  player2_rating = 0
) => {
  const questionCount = mode === "mcq" ? 10 : mode === "predict" ? 5 : 1;

  let matchQuery = { theme: mode };

  if (mode === "contest") {
    const avgRating = (player1_rating + player2_rating) / 2;
    matchQuery.rating = Math.ceil(avgRating / 100) * 100;
  }

  const questions = await Question.aggregate([
    { $match: matchQuery },
    { $sample: { size: questionCount } },
  ]);

  if (!questions.length) {
    throw new Error("No questions found for this theme");
  }

  const now = new Date();
  const duration = mode === "mcq" ? 10 : 15;

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
