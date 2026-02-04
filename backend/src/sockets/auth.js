const jwt = require("jsonwebtoken");

const socketAuth = (socket, next) => {
  try {
    const cookie = socket.handshake.headers.cookie;
    if (!cookie) throw new Error("No cookie");

    const token = cookie
      .split("; ")
      .find(c => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) throw new Error("No token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { _id: decoded.id };

    next();
  } catch (err) {
    next(new Error("Unauthorized socket"));
  }
};

module.exports = socketAuth;
