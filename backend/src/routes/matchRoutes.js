const express = require("express");
const router = express.Router();

const matchController = require("../controllers/matchController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/getinfo" , protect , matchController.getInformation)
router.post("/getanalytics/:matchId" , protect , matchController.getMatchAnalytics)
module.exports = router;