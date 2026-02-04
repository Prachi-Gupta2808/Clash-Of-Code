const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const initSockets = require("./src/sockets/index");
const { startMatchmaking } = require("./src/sockets/scheduler");

const PORT = process.env.PORT || 5000;

// shared HTTP server
const server = http.createServer(app);

// attach socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// initialize socket logic
initSockets(io) ;
startMatchmaking(io) ;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ✅`);
});
