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

// used for the optional conditions when the submissions are missing
const MAX_DATE = new Date('9999-12-31T23:59:59Z');

exports.decideWinner = async (match) => {
    if (match.resultDeclared) return;

    // the optional conditions are for the case where the submissions are missing like when users opens the contest and leaves the page
    const subA = match.submissions.find(s => s.userId.toString() === match.player1.toString())
        || { userId: match.player1, score: 0, submittedAt: MAX_DATE };
    const subB = match.submissions.find(s => s.userId.toString() === match.player2.toString())
        || { userId: match.player2, score: 0, submittedAt: MAX_DATE };

    let winner = null;
    let isTie = false;

    // 1. Determine Winner
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

    match.ratingChange = {
        p1: { id: match.player1, delta: 0 },
        p2: { id: match.player2, delta: 0 }
    };

    // If the match is not friendly then only change the ratings
    if (!match.isChallenged) {
        const [userA, userB] = await Promise.all([
            User.findById(match.player1),
            User.findById(match.player2)
        ]);

        if (userA && userB) {
            let ra = userA.rating || 0;
            let rb = userB.rating || 0;

            let ka = kValues[match.theme] || 20;
            let kb = kValues[match.theme] || 20;

            const [matchCntA, matchCntB] = await Promise.all([
                Match.countDocuments({ $or: [{ player1: userA._id }, { player2: userA._id }] }),
                Match.countDocuments({ $or: [{ player1: userB._id }, { player2: userB._id }] })
            ]);

            const winnerStr = isTie ? null : winner.toString();

            if (matchCntA <= 5) {
                ka *= isTie ? multipliers.tie : (winnerStr === userA._id.toString() ? multipliers.win : multipliers.lose);
            }
            if (matchCntB <= 5) {
                kb *= isTie ? multipliers.tie : (winnerStr === userB._id.toString() ? multipliers.win : multipliers.lose);
            }

            let Ea = 1 / (1 + Math.pow(10, (rb - ra) / 400));
            let Eb = 1 / (1 + Math.pow(10, (ra - rb) / 400));

            let Sa = isTie ? 0.5 : (winnerStr === userA._id.toString() ? 1 : 0);
            let Sb = isTie ? 0.5 : (winnerStr === userB._id.toString() ? 1 : 0);

            let deltaA = ka * (Sa - Ea);
            let deltaB = kb * (Sb - Eb);

            match.ratingChange.p1.delta = deltaA;
            match.ratingChange.p2.delta = deltaB;

            userA.rating = Math.max(0, ra + deltaA);
            userB.rating = Math.max(0, rb + deltaB);
            await Promise.all([userA.save(), userB.save()]);
        }
    }

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