const express = require("express") ;
const router = express.Router() ;

const submitController = require("../controllers/submitController") ;
const { protect } = require("../middlewares/authMiddleware") ;

router.post("/contest" , protect , submitController.submitCode) ;
router.post("/predict" , protect , submitController.submitOutput) ;
router.post("/mcq" , protect , submitController.submitMcq) ;
router.post("/run" , protect , submitController.runCode) ;

module.exports = router ;