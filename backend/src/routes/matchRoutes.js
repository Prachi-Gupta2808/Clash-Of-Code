const express = require("express");
const router = express.Router();

const { getMatchInformation } = require("../controllers/matchController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/getinfo", protect , getMatchInformation);

module.exports = router;
