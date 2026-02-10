const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, adminController.addQuestion);

module.exports = router;
