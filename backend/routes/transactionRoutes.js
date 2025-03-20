const express = require("express");
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  flagTransaction,
  unflagTransaction,
  getFlaggedTransactions,
  updateTransactionStatus,
} = require("../controllers/transactionController.js");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public Routes (if users can create transactions)
router.post("/", protect, createTransaction);

// Protected Routes (Requires Authentication)
router.get("/", protect, admin, getAllTransactions); // Admin can view all transactions
router.get("/flagged", protect, admin, getFlaggedTransactions); // Admin can view flagged transactions
router.get("/:id", protect, getTransactionById); // User/Admin can view a specific transaction

// Update & Delete (Protected)
router.put("/:id", protect, updateTransaction);
router.put("/:id/status", protect, admin, updateTransactionStatus); // Admin can update transaction status
router.put("/:id/flag", protect, admin, flagTransaction); // Admin can flag a transaction
router.put("/:id/unflag", protect, admin, unflagTransaction); // Admin can unflag a transaction
router.delete("/:id", protect, admin, deleteTransaction); // Admin can delete a transaction

module.exports = router;
