const { runBatchForMode } = require("./pairing");

const startMatchmaking = (io) => {
  console.log("Matchmaking scheduler started");

  setInterval(() => {
    runBatchForMode("mcq", io);
    runBatchForMode("predict", io);
    runBatchForMode("contest", io);
  }, 20000);
};

module.exports = { startMatchmaking };
