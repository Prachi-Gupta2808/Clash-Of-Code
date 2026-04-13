const { getIO } = require("../sockets/socket");
const User = require("../models/User.model") ;
const Match = require("../models/Match.model") ;

const kValues = {
    "mcq": 20,
    "predict": 30,
    "contest": 40,
} ;

const multipliers = {
    "win" : 2,
    "lose" : 0.5,
    "tie" : 1,
} ;

const matchScore = {
    "lose": 0,
    "win": 1,
    "tie": 0.5,
}

exports.decideWinner = async (match) => {
    if (!match.submissions || match.submissions.length < 2) return;
    if (match.resultDeclared) return;

    const [a, b] = match.submissions;
    if (!a || !b) return;

    let winner = null;

    if (a.score > b.score) winner = a.userId;
    else if (a.score < b.score) winner = b.userId;
    else {
        winner = (a.submittedAt < b.submittedAt) ? a.userId : b.userId;
    }

    const userA = await User.findById(a.userId) ;
    const userB = await User.findById(b.userId) ;
    if (!userA || !userB) return ;

    let ra = userA.rating ;
    let rb = userB.rating ;

    let ka = kValues[match.theme] || 20 ;
    let kb = kValues[match.theme] || 20 ;

    const matchCntA = await Match.countDocuments({ player1: userA._id }) ;
    const matchCntB = await Match.countDocuments({ player2: userB._id }) ;

    if(matchCntA <= 5) {
        if(winner.toString() == a.userId.toString()) {
            ka = ka * multipliers.win ;
        }
        else {
            ka = ka * multipliers.lose ;
        }
    }

    if(matchCntB <= 5) {
        if(winner.toString() == b.userId.toString()) {
            kb = kb * multipliers.win ;
        }
        else {
            kb = kb * multipliers.lose ;
        }
    }

    let Ea = 1 / (1 + Math.pow(10, (rb - ra) / 400)) ;
    let Eb = 1 / (1 + Math.pow(10, (ra - rb) / 400)) ;

    let Sa, Sb ;

    if (winner.toString() === a.userId.toString()) {
        Sa = 1 ;
        Sb = 0 ;
    } else {
        Sa = 0 ;
        Sb = 1 ;
    }

    let deltaA = ka * (Sa - Ea) ;
    let deltaB = kb * (Sb - Eb) ;

    userA.rating = Math.max(0 , Math.round(userA.rating + deltaA)) ;
    userB.rating = Math.max(0 , Math.round(userB.rating + deltaB)) ;

    await userA.save() ;
    await userB.save() ;

    match.ratingChange.p1.id = userA._id ;
    match.ratingChange.p1.delta = deltaA ;

    match.ratingChange.p2.id = userB._id ;
    match.ratingChange.p2.delta = deltaB ;

    match.winner = winner;
    match.status = "FINISHED";
    match.resultDeclared = true;

    await match.save();

    const io = getIO();
    io.to(match.matchId).emit("MATCH_RESULT", {
        winner,
        scores: match.submissions,
    });
};