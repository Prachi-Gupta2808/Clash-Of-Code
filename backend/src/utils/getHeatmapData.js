const Submission = require("../models/Submission.model");
const mongoose = require("mongoose");

exports.getHeatmapData = async (userId) => {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const heatmapStats = await Submission.aggregate([
    // Find submissions for the user
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    
    // Unwind the submissionTimes array so each date becomes its own document
    { $unwind: "$submissionTimes" },
    
    // Only keep submissions from the last year
    { $match: { submissionTimes: { $gte: oneYearAgo } } },
    
    // Group by the Date string (YYYY-MM-DD) and count them
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$submissionTimes" }
        },
        count: { $sum: 1 }
      }
    },
    
    // 5. Format the output
    {
      $project: {
        _id: 0,
        dateString: "$_id",
        count: 1
      }
    }
  ]);

  return heatmapStats; // Returns: [{ dateString: "2026-04-10", count: 3 }, ...]
};