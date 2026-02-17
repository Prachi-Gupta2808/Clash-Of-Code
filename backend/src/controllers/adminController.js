const Question = require("../models/Question.model");

const normalize = (s) => {
  return s.trim().replace(/\s+/g, " ");
};

exports.addQuestion = async (req, res) => {
  try {
    let {
      title,
      rating,
      tags,
      theme,
      statement,
      inputFormat,
      outputFormat,
      contraints,
      options,
      preTest,
      preTestOutput,
      actualTest,
      actualTestOutput,
      timeLimit,
      memoryLimit,
    } = req.body;

    // authorization Check
    const admin = req.user.isAdmin;
    if (!admin) {
      return res.status(401).json({
        message: "Unauthorized Access: Admin privileges required",
      });
    }

    // validation
    if (!title || !rating || !statement || !actualTestOutput) {
      return res.status(400).json({
        message:
          "Title, Rating, Statement, and Actual Test Output are required fields.",
      });
    }

    // We normalize outputs to ensure consistent comparison later
    // We generally do NOT normalize input code/statements too aggressively to preserve formatting
    const normalizedPreTestOutput = preTestOutput
      ? normalize(preTestOutput)
      : "";
    const normalizedActualTestOutput = normalize(actualTestOutput);
    inputFormat = normalize(inputFormat) ;
    outputFormat = normalize(outputFormat) ;

    const question = await Question.create({
      title,
      rating,
      tags,
      theme,
      statement,
      inputFormat,
      outputFormat,
      contraints,
      options,
      timeLimit,
      memoryLimit,
      preTest,
      preTestOutput: normalizedPreTestOutput,
      actualTest,
      actualTestOutput: normalizedActualTestOutput,
    });

    res.status(201).json({
      message: "Question added successfully",
      question,
    });
  } catch (error) {
    console.error("Add Question Error:", error);
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
