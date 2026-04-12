const Match = require("../models/Match.model");
const { decideWinner } = require("./decideWinner");

function handleMatchTimeout(matchId, durationMinutes) {
    setTimeout(async () => {
        try {
            const match = await Match.findOne({ matchId });

            if (!match || match.resultDeclared) return;

            // No one submitted
            if (match.submissions.length === 0) {
                match.submissions.push(
                    {
                        userId: match.player1,
                        answers: [],
                        score: 0,
                        submittedAt: new Date(),
                    },
                    {
                        userId: match.player2,
                        answers: [],
                        score: 0,
                        submittedAt: new Date(),
                    }
                );
            }

            // One user submitted
            else if (match.submissions.length === 1) {
                const existingUser = match.submissions[0].userId;

                const otherUser =
                    existingUser.toString() === match.player1.toString()
                        ? match.player2
                        : match.player1;

                match.submissions.push({
                    userId: otherUser,
                    answers: [],
                    score: 0,
                    submittedAt: new Date(),
                });
            }

            // both players submitted is handled at the time of submit , refer to submission controller

            await match.save();
            await decideWinner(match);
        } catch (err) {
            console.error("Match timeout error:", err);
        }
    }, durationMinutes * 60 * 1000);
}

module.exports = { handleMatchTimeout };