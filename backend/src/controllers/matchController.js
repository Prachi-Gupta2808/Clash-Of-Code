const Match = require("../models/Match.model");

exports.getMatchInformation = async (req, res) => {
  try {
    const { matchId } = req.body;

    const matchDets = await Match.findOne({ matchId })
      .populate({
        path: "questions",
        select: `
          title
          statement
          inputFormat
          outputFormat
          constraints
          preTest
          preTestOutput
          timeLimit
          memoryLimit
          rating
          tags
          theme
          options
        `,
      });

    return res.status(200).json(matchDets);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
