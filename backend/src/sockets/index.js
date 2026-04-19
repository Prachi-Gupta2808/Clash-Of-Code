const socketAuth = require("./auth");
const { enterLobby, leaveLobby } = require("./lobby");
const { randomUUID } = require("crypto");
const { createMatch } = require("../services/matchService");

const VALID_MODES = ["mcq", "predict", "contest"];
const userSocketMap = {}; // userId -> Set of socketIds

module.exports = function initSockets(io) {
  io.use(socketAuth);

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    const rating = socket.user.rating;

    if (!userSocketMap[userId]) {
      userSocketMap[userId] = new Set();
    }

    userSocketMap[userId].add(socket.id);

    console.log("🔌 Connected:", {
      userId,
      socketId: socket.id,
      totalSockets: userSocketMap[userId].size,
    });

    console.log("🔌 Socket connected:", {
      userId,
      socketId: socket.id,
    });;

    socket.on("PLAY_NOW", ({ mode }) => {
      enterLobby(userId, socket, mode, rating);
    });

    socket.on("CANCEL", ({ mode }) => {
      leaveLobby(userId, mode);
    });

    socket.on("CHALLENGE_REQUEST", ({ toUserId, theme }) => {
      if (!VALID_MODES.includes(theme)) return;

      // Prevent self-challenge
      if (toUserId === userId) {
        socket.emit("CHALLENGE_ERROR", { message: "You cannot challenge yourself." });
        return;
      }

      console.log("[CHALLENGE_REQUEST]", {
        from: userId,
        to: toUserId,
        theme,
      });

      // Get all sockets of friend (we store all the sockets of the user which helps in case he has multiple tabs open)
      const friendSockets = userSocketMap[toUserId];

      if (!friendSockets || friendSockets.size === 0) {
        socket.emit("CHALLENGE_ERROR", { message: "Friend is not online." });
        return;
      }

      const challengeId = randomUUID();

      // Emit to all sockets of friend
      for (const sockId of friendSockets) {
        io.to(sockId).emit("INCOMING_CHALLENGE", {
          challengeId,
          fromUserId: userId,
          fromUsername: socket.user.username,
          theme,
        });
      }

      socket.emit("CHALLENGE_SENT", { challengeId });

      console.log(
        `⚔️ Challenge [${theme}]: ${userId} -> ${toUserId} | sockets: ${friendSockets.size}`
      );
    });

    socket.on("CHALLENGE_ACCEPTED", async ({ fromUserId, theme }) => {
      const challengerSockets = userSocketMap[fromUserId];

      if (!challengerSockets || challengerSockets.size === 0) {
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

        for (const sockId of challengerSockets) {
          io.sockets.sockets.get(sockId)?.join(roomId);
        }
        socket.join(roomId);

        for (const sockId of challengerSockets) {
          io.to(sockId).emit("CHALLENGE_PAIRED", {
            opponent: userId,
            roomId,
            mode: theme,
          });
        }

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
      const challengerSockets = userSocketMap[fromUserId];

      if (challengerSockets) {
        for (const sockId of challengerSockets) {
          io.to(sockId).emit("CHALLENGE_DECLINED", {
            message: `${socket.user.username} declined your challenge.`,
          });
        }
      }
    });

    socket.on("disconnect", () => {
      userSocketMap[userId]?.delete(socket.id);

      if (userSocketMap[userId]?.size === 0) {
        delete userSocketMap[userId];
      }

      console.log("❌ Disconnected:", {
        userId,
        socketId: socket.id,
        remaining: userSocketMap[userId]?.size || 0,
      });
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
