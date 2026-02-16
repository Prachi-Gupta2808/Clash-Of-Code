const express = require("express") ;
const router = express.Router() ;

const submitController = require("../controllers/submitController") ;
const { protect } = require("../middlewares/authMiddleware");

router.post("/contest" , protect , submitController.submitCode) ;

module.exports = router ;