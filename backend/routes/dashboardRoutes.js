const express = require("express");
const { getDashboardSummary } = require("../controllers/dashboardController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, admin, getDashboardSummary); // Only admins can view dashboard data

module.exports = router;
