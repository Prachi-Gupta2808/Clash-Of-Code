const Match = require("../models/Match.model");

exports.getMatchInformation = async(req , res) => {
  const matchId = req.body.matchId;
  
  const matchDets = await Match.findOne({ matchId }).populate("questions") ;

  return res.status(200).send(matchDets) ;
} 