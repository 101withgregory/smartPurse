const Transaction = require("../models/transactionModel");

// Create a new transaction
const createTransaction = async (req, res) => {
  try {
    const { userId, amount, type, status, description } = req.body;

    const transaction = new Transaction({
      userId,
      amount,
      type,
      status,
      description,
    });

    // Simulated anomaly detection (this should be replaced by ML model later)
    if (amount > 10000) {  // Example rule: flag high-value transactions
      transaction.isFlagged = true;
      transaction.flagReason = "High transaction amount";
    }

    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ message: "Error creating transaction", error });
  }
};

// Get all transactions (Admin only)
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};

// Get a single transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transaction", error });
  }
};

// Update a transaction
const updateTransaction = async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: "Error updating transaction", error });
  }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction", error });
  }
};

// Flag a transaction manually
const flagTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.isFlagged = true;
    transaction.flagReason = req.body.flagReason || "Manually flagged by admin";
    await transaction.save();

    res.status(200).json({ message: "Transaction flagged successfully", transaction });
  } catch (error) {
    res.status(500).json({ message: "Error flagging transaction", error });
  }
};

// Unflag a transaction manually
const unflagTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.isFlagged = false;
    transaction.flagReason = null;
    await transaction.save();

    res.status(200).json({ message: "Transaction unflagged successfully", transaction });
  } catch (error) {
    res.status(500).json({ message: "Error unflagging transaction", error });
  }
};

// Get all flagged transactions
const getFlaggedTransactions = async (req, res) => {
  try {
    const flaggedTransactions = await Transaction.find({ isFlagged: true });
    res.status(200).json(flaggedTransactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching flagged transactions", error });
  }
};

// Update transaction status (for payments, fraud investigations, etc.)
const updateTransactionStatus = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.status = req.body.status || transaction.status;
    await transaction.save();

    res.status(200).json({ message: "Transaction status updated successfully", transaction });
  } catch (error) {
    res.status(500).json({ message: "Error updating transaction status", error });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  flagTransaction,
  unflagTransaction,
  getFlaggedTransactions,
  updateTransactionStatus,
};
