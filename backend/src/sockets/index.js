const socketAuth = require("./auth");
const { enterLobby, leaveLobby } = require("./lobby");
const { randomUUID } = require("crypto");
const { createMatch } = require("../services/matchService");

const VALID_MODES = ["mcq", "predict", "contest"];
const userSocketMap = {};

module.exports = function initSockets(io) {
  io.use(socketAuth);

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    const rating = socket.user.rating;

    userSocketMap[userId] = socket.id;
    console.log("🔌 Socket connected:", userId);

    socket.on("PLAY_NOW", ({ mode }) => {
      enterLobby(userId, socket, mode, rating);
    });

    socket.on("CANCEL", ({ mode }) => {
      leaveLobby(userId, mode);
    });

    socket.on("CHALLENGE_REQUEST", ({ toUserId, theme }) => {
      if (!VALID_MODES.includes(theme)) return;
      console.log("CHALLENGE_REQUEST received:", { toUserId, theme });
      console.log("userSocketMap:", userSocketMap);
      const friendSocketId = userSocketMap[toUserId];
      console.log("Friend socket ID:", friendSocketId);

      if (!friendSocketId) {
        socket.emit("CHALLENGE_ERROR", { message: "Friend is not online." });
        return;
      }

      const challengeId = randomUUID();

      io.to(friendSocketId).emit("INCOMING_CHALLENGE", {
        challengeId,
        fromUserId: userId,
        fromUsername: socket.user.username,
        theme,
      });

      socket.emit("CHALLENGE_SENT", { challengeId });

      console.log(`⚔️ Challenge [${theme}]: ${userId} → ${toUserId}`);
    });

    socket.on("CHALLENGE_ACCEPTED", async ({ fromUserId, theme }) => {
      const challengerSocketId = userSocketMap[fromUserId];

      if (!challengerSocketId) {
        socket.emit("CHALLENGE_ERROR", { message: "Challenger disconnected." });
        return;
      }

      try {
        const roomId = randomUUID();

        const questions = await createMatch(
          fromUserId,
          userId,
          roomId,
          theme,
          true
        );

        io.sockets.sockets.get(challengerSocketId)?.join(roomId);
        socket.join(roomId);

        io.to(challengerSocketId).emit("CHALLENGE_PAIRED", {
          opponent: userId,
          roomId,
          mode: theme,
        });

        socket.emit("CHALLENGE_PAIRED", {
          opponent: fromUserId,
          roomId,
          mode: theme,
        });

        io.to(roomId).emit("MATCH_START", {
          matchId: roomId,
          questions,
        });

        console.log(
          `✅ Challenge Match [${theme}]: ${fromUserId} vs ${userId} | Room: ${roomId}`
        );
      } catch (err) {
        console.error("Challenge match creation failed:", err);
        socket.emit("CHALLENGE_ERROR", { message: "Failed to create match." });
      }
    });

    socket.on("CHALLENGE_DECLINED", ({ fromUserId }) => {
      const challengerSocketId = userSocketMap[fromUserId];
      if (challengerSocketId) {
        io.to(challengerSocketId).emit("CHALLENGE_DECLINED", {
          message: `${socket.user.username} declined your challenge.`,
        });
      }
      console.log(`❌ Challenge declined by ${userId}`);
    });

    socket.on("disconnect", () => {
      delete userSocketMap[userId];
      leaveLobby(userId, "mcq");
      leaveLobby(userId, "predict");
      leaveLobby(userId, "contest");
      console.log("❌ Disconnected:", userId);
    });

    socket.on("JOIN_ROOM", (matchID) => {
      socket.join(matchID);
      console.log("user_joined room");
    });
  });
};
