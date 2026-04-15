const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/add" , adminController.addQuestion);
module.exports = router;
