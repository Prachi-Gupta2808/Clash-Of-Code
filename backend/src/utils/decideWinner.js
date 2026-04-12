const { getIO } = require("../sockets/socket");

exports.decideWinner = async (match) => {
    const [a, b] = match.submissions;

    if (!a || !b) return;

    if (match.resultDeclared) {
        return;
    }

    if (!match.submissions || match.submissions.length < 2) {
        return;
    }

    let winner = null;

    if (a.score > b.score) winner = a.userId;
    else if (a.score < b.score) winner = b.userId;
    else {
        winner = (a.submittedAt < b.submittedAt) ? a.userId : b.userId;
    }

    match.winner = winner;
    match.status = "FINISHED";
    match.resultDeclared = true;
    await match.save();

    const io = getIO();
    io.to(match.matchId).emit("MATCH_RESULT", {
        winner,
        scores: match.submissions,
    });
}