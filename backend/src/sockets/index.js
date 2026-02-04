const socketAuth = require("./auth");
const { enterLobby, leaveLobby } = require("./lobby");

module.exports = function initSockets(io) {
  io.use(socketAuth);

  io.on("connection", socket => {
    const userId = socket.user._id.toString();

    console.log("🔌 Socket connected:", userId);

    socket.on("PLAY_NOW", ({ mode }) => {
      enterLobby(userId, socket, mode);
    });

    socket.on("CANCEL", ({ mode }) => {
      leaveLobby(userId, mode);
    });

    socket.on("disconnect", () => {
      leaveLobby(userId, "mcq");
      leaveLobby(userId, "predict");
      leaveLobby(userId, "contest");
      console.log("❌ Disconnected:", userId);
    });
  });
};
