const Question = require("../models/Question.model");
const Submission = require("../models/Submission.model");
const Match = require("../models/Match.model");

function normalize(s) {
  return s.trim().replace(/\s+/g, " ");
}

exports.submitCode = async (req, res) => {
  try {
    const code = req.body.code.replace(/\r\n/g, "\n"); // converting the code into a standard format by removing the \r \t characters
    const language = req.body.language;
    const qid = req.body.questionId;
    const matchId = req.body.matchId;
    const question = await Question.findOne({ _id: qid });
    const qInput = question.actualTest;

    // (`http://35.154.66.175:3000/compile`
    const compiledCode = await fetch(`http://localhost:3000/compile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code,
        language: language,
        input: qInput,
      }),
    });

    const compiledCodeJSON = await compiledCode.json();
    const actualOutput = normalize(compiledCodeJSON.output);
    const expectedOutput = normalize(question.actualTestOutput);

    if (
      compiledCodeJSON.verdict == "AC" &&
      actualOutput.trim() !== expectedOutput.trim()
    ) {
      compiledCodeJSON.verdict = "WA";
    }

    await Submission.create({
      user: req.user._id,
      match: matchId,
      language,
      code,
      status: compiledCodeJSON.verdict,
      // Compilation Time
      // Execution Time
      // Memory Taken
    });

    return res.status(200).send(compiledCodeJSON);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.submitOutput = async (req, res) => {
  try {
    const { finalAnswers , matchId } = req.body ;
    const match = await Match.findOne({ matchId }).populate("questions") ;
    const questions = match.questions ;
    
    let score = 0;
    finalAnswers.forEach((val , ind) => {
      val = normalize(val) ;
      if(val === questions[ind].actualTestOutput) {
        score++ ;
      }
    })
    
    return res.status(200).json({ score });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.submitMcq = async(req , res) => {
  try {
    const { finalAnswers , matchId } = req.body ;

    const match = await Match.findOne({ matchId }).populate("questions") ;
    const questions = match.questions ;
    let score = 0 ;
    
    questions.forEach((val , ind) => {
      let actualOutput = val.actualTestOutput ;

      if(finalAnswers[ind] === actualOutput) {
        score++ ;  
      }
    })
    
    return res.status(200).send({ score })
  } catch(err) {
    console.error(err) ;
    return res.status(500).send({ msg : "Internal Server Error" }) ;
  }
};
