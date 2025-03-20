const express = require("express");
const { 
  getDashboardSummary, 
  getSavingsChartData, 
  getContributionsChartData, 

} = require("../controllers/dashboardController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/summary", protect, getDashboardSummary);
router.get("/savings", protect, getSavingsChartData);
router.get("/contributions", protect, getContributionsChartData);


module.exports = router;
