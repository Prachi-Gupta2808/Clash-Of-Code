const jwt = require("jsonwebtoken");
const User = require("../models/User.model") ;

const socketAuth = async (socket, next) => {
  try {
    const cookie = socket.handshake.headers.cookie;
    if (!cookie) throw new Error("No cookie");

    const token = cookie
      .split("; ")
      .find(c => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) throw new Error("No token");
    
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const findUser = await User.findOne({ _id : decoded.id }) ;
    const userRating = findUser.rating ;
    socket.user = { _id: decoded.id , rating : userRating };

    next();
  } catch (err) {
    next(new Error("Unauthorized socket"));
  }
};

module.exports = socketAuth;
