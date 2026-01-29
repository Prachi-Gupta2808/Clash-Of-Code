const Question = require("../models/Question.model");

const normalize = (s) => {
  return s.trim().replace(/\s+/g, ' ');
}

exports.addQuestion = async (req, res) => {
  try {
    const { rating, tags, theme, statement, options, preTest, expectedOutput } =
      req.body;
    const admin = req.user.isAdmin ;
    if(!admin) {
      return res.status(401).json({
        message: "Unauthorized Access"
      })
    }

    // basic validation yeh hongi
    if (!rating || !statement || !expectedOutput) {
      return res.status(400).json({
        message: "rating, statement and expectedOutput are required",
      });
    }
    expectedOutput = normalize(expectedOutput) ; // remove extra spaces newline character etc

    const question = await Question.create({
      rating,
      tags,
      theme,
      statement,
      options,
      preTest,
      expectedOutput,
    });

    res.status(201).json({
      message: "Question added successfully",
      question,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add question",
      error: error.message,
    });
  }
};

//delete a question

exports.removeQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    await Question.findByIdAndDelete(id);

    res.status(200).json({
      message: "Question removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove question",
      error: error.message,
    });
  }
};
