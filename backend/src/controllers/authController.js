const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sanitizeUser = (user) => {
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

const createToken = (userId, isAdmin) => {
  return jwt.sign({ id: userId, admin: isAdmin }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { fullName, email, password, username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      username,
      authProvider: "local",
    });

    const token = createToken(user._id, user.isAdmin);
    setTokenCookie(res, token);

    res.status(201).json({
      message: "User created",
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(user._id, user.isAdmin);
    setTokenCookie(res, token);

    res.json({
      message: "Logged in",
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GOOGLE AUTH
exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(400).json({ message: "Google token missing" });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });
    const extractUserName = email.split("@").at(0) ;

    if (!user) {
      user = await User.create({
        username: extractUserName,
        fullName: name,
        email,
        googleId,
        authProvider: "google",
      });
    }

    if (user.authProvider === "local" && !user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const jwtToken = createToken(user._id, user.isAdmin);
    setTokenCookie(res, jwtToken);

    res.json({ message: "Google auth successful", user: sanitizeUser(user) });
  } catch (err) {
    console.error(err);
    res
      .status(401)
      .json({ message: err.message || "Google authentication failed" });
  }
};

// LOGOUT
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/",
  });

  res.status(200).json({ message: "Logged out" });
};
