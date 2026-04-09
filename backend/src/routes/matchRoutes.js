const express = require("express");
const router = express.Router();

const matchController = require("../controllers/matchController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/create", protect, matchController.createMatch);
router.post("/getinfo" , protect , matchController.getInformation)
module.exports = router;