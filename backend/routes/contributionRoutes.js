const express = require("express");
const router = express.Router();
const {
  getAllContributions,
  deleteContribution,
  approveContribution,
} = require("../controllers/contributionController");
const { admin, protect } = require("../middlewares/authMiddleware");

// Route to get all contributions
router.get("/", getAllContributions);

// Route to delete a contribution by ID
router.delete("/:id",protect,admin, deleteContribution);

// Route to approve a contribution by ID
router.put("/:id/approve",protect,admin, approveContribution);

module.exports = router;
