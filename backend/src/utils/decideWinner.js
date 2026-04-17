const { getIO } = require("../sockets/socket");
const User = require("../models/User.model");
const Match = require("../models/Match.model");

const kValues = {
    mcq: 20,
    predict: 30,
    contest: 40,
};

const multipliers = {
    win: 1.5,
    lose: 0.5,
    tie: 1,
};

exports.decideWinner = async (match) => {
    if (match.resultDeclared) return;

    const subA = match.submissions.find(s => s.userId.toString() === match.player1.toString()) || { userId: match.player1, score: 0, submittedAt: Infinity };
    const subB = match.submissions.find(s => s.userId.toString() === match.player2.toString()) || { userId: match.player2, score: 0, submittedAt: Infinity };

    let winner = null;
    let isTie = false;

    if (subA.score > subB.score) {
        winner = subA.userId;
    } else if (subA.score < subB.score) {
        winner = subB.userId;
    } else {
        if (subA.score === 0 && subB.score === 0) {
            isTie = true;
        } else if (subA.submittedAt < subB.submittedAt) {
            winner = subA.userId;
        } else if (subA.submittedAt > subB.submittedAt) {
            winner = subB.userId;
        } else {
            isTie = true;
        }
    }

    const userA = await User.findById(match.player1);
    const userB = await User.findById(match.player2);

    if (!userA || !userB) return;

    let ra = userA.rating;
    let rb = userB.rating;

    let ka = kValues[match.theme] || 20;
    let kb = kValues[match.theme] || 20;

    const matchCntA = await Match.countDocuments({ player1: userA._id });
    const matchCntB = await Match.countDocuments({ player2: userB._id });

    if (matchCntA <= 5) {
        ka *= isTie ? multipliers.tie : (winner.toString() === userA._id.toString() ? multipliers.win : multipliers.lose);
    }
    if (matchCntB <= 5) {
        kb *= isTie ? multipliers.tie : (winner.toString() === userB._id.toString() ? multipliers.win : multipliers.lose);
    }

    let Ea = 1 / (1 + Math.pow(10, (rb - ra) / 400));
    let Eb = 1 / (1 + Math.pow(10, (ra - rb) / 400));

    let Sa, Sb;
    if (isTie) {
        Sa = 0.5;
        Sb = 0.5;
    } else if (winner.toString() === userA._id.toString()) {
        Sa = 1;
        Sb = 0;
    } else {
        Sa = 0;
        Sb = 1;
    }

    let deltaA = ka * (Sa - Ea);
    let deltaB = kb * (Sb - Eb);

    userA.rating = Math.max(0, userA.rating + deltaA);
    userB.rating = Math.max(0, userB.rating + deltaB);

    await userA.save();
    await userB.save();

    match.ratingChange = {
        p1: { id: userA._id, delta: deltaA },
        p2: { id: userB._id, delta: deltaB }
    };

    match.winner = isTie ? null : winner;
    match.status = "FINISHED";
    match.resultDeclared = true;
    match.isTie = isTie;

    match.submissions = [subA, subB];
    await match.save();

    const io = getIO();
    io.to(match.matchId).emit("MATCH_RESULT", {
        winner: isTie ? null : winner,
        isTie,
        scores: match.submissions,
    });
};