const Match = require("../models/Match.model");
const Question = require("../models/Question.model");
const { handleMatchTimeout } = require("../utils/matchTimeout");
const User = require("../models/User.model");

exports.createMatch = async (
  player1_ID,
  player2_ID,
  roomId,
  mode,
  isChallenged = false
) => {
  const questionCount = mode === "mcq" ? 10 : mode === "predict" ? 5 : 1;

  // 1. Fetch users
  const player1 = await User.findById(player1_ID);
  const player2 = await User.findById(player2_ID);

  if (!player1 || !player2) {
    throw new Error("Player not found");
  }

  const p1Rating = player1.rating || 1000;
  const p2Rating = player2.rating || 1000;
  const averageRating = (p1Rating + p2Rating) / 2;

  // Round to the nearest upper hundred (e.g., 1210 -> 1300)
  const targetRating = Math.ceil(averageRating / 100) * 100;
  let questions = await Question.aggregate([
    { 
      $match: { 
        theme: mode,
        rating: targetRating
      } 
    },
    { $sample: { size: questionCount } },
  ]);

  if (questions.length < questionCount) {
    console.log(`Not enough questions found for rating ${targetRating}. Falling back to any rating.`);
    questions = await Question.aggregate([
      { $match: { theme: mode } },
      { $sample: { size: questionCount } },
    ]);
  }

  if (!questions.length) {
    throw new Error("No questions found for this theme");
  }

  const now = new Date();
  const duration = mode === "mcq" ? 10 : 15; // minutes

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