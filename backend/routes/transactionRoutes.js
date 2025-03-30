const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  deleteTransaction,
  flagTransaction,
  unflagTransaction,
  getFlaggedTransactions,
  updateTransactionStatus,
} = require("../controllers/transactionController.js");
const { protect, admin } = require("../middlewares/authMiddleware");
// Public Routes (if users can create transactions)
router.post("/", protect, createTransaction);

// Protected Routes (Requires Authentication)
router.get("/", protect, admin, getAllTransactions); // Admin can view all transactions
router.get("/flagged", protect, admin, getFlaggedTransactions); // Admin can view flagged transactions
router.get("/:id", protect, getTransactionById); // User/Admin can view a specific transaction

// Update & Delete (Protected)
router.put("/:id/status", protect,admin, updateTransactionStatus);// Admin can update transaction status
router.put("/:id/flag", protect, admin, flagTransaction); // Admin can flag a transaction
router.put("/:id/unflag", protect, admin, unflagTransaction); // Admin can unflag a transaction
router.delete("/:id", protect, admin, deleteTransaction); // Admin can delete a transaction


module.exports = router;
