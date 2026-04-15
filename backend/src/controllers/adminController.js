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
      constraints,
      options,
      preTest,
      preTestOutput,
      actualTest,
      actualTestOutput,
      timeLimit,
      memoryLimit,
    } = req.body;

    // if (!req.user?.isAdmin) {
    //   return res.status(401).json({
    //     message: "Unauthorized Access: Admin privileges required",
    //   });
    // }

    // 🧠 Auto-fill missing fields
    title = title || `Question ${rating}`;
    tags = tags || [];
    theme = theme || "general";
    inputFormat = inputFormat || "";
    outputFormat = outputFormat || "";
    constraints = constraints || "";
    options = options || [];
    preTest = preTest || "";
    preTestOutput = preTestOutput || "";
    actualTest = actualTest || "";
    timeLimit = timeLimit || 2.0;
    memoryLimit = memoryLimit || 256;

    if (!rating || !statement || !actualTestOutput) {
      return res.status(400).json({
        message: "Rating, Statement, and Actual Output are required.",
      });
    }
    const normalizedPreTestOutput = preTestOutput
      ? normalize(preTestOutput)
      : "";

    const normalizedActualTestOutput = normalize(actualTestOutput);

    inputFormat = inputFormat ? normalize(inputFormat) : "";
    outputFormat = outputFormat ? normalize(outputFormat) : "";

    const question = await Question.create({
      title,
      rating,
      tags,
      theme,
      statement,
      inputFormat,
      outputFormat,
      constraints,
      options,
      timeLimit,
      memoryLimit,
      preTest,
      preTestOutput: normalizedPreTestOutput,
      actualTest,
      actualTestOutput: normalizedActualTestOutput,
    });

    res.status(201).json({
      success: true,
      message: "Question added successfully",
      question,
    });

  } catch (error) {
    console.error("Add Question Error:", error);

    res.status(500).json({
      success: false,
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
