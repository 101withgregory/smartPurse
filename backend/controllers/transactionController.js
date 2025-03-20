const Transaction = require("../models/transactionModel");
// const { detectAnomalies } = require("../utils/anomalyDetection");

// ✅ Create a new transaction
const createTransaction = async (req, res) => {
  try {
    const {
      user,
      group,
      transactionType,
      amount,
      status,
      previousBalance,
      frequency,
      category,
      deviceType,
      location,
    } = req.body;

    const transaction = new Transaction({
      user,
      group,
      transactionType,
      amount,
      status,
      previousBalance,
      frequency,
      category,
      deviceType,
      location,
    });

    // ✅ Detect anomalies using the ONNX model
    const riskScore = await detectAnomalies(transaction);
    transaction.riskScore = riskScore;
    transaction.isFlagged = riskScore >= 80; // Flag if score exceeds threshold

    if (transaction.isFlagged) {
      transaction.flagReason = "High risk score";
    }

    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Error creating transaction", error });
  }
};

// ✅ Get all transactions (Admin only)
const getAllTransactions = async (req, res) => {
  try {
    const { groupId } = req.query;

    const query = groupId ? { group: groupId } : {};

    const transactions = await Transaction.find(query)
      .populate("user", "name email")
      .populate("group", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};

// ✅ Get a single transaction by ID
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

// ✅ Update a transaction
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    Object.assign(transaction, req.body);

    // ✅ Detect anomalies again after update
    const riskScore = await detectAnomalies(transaction);
    transaction.riskScore = riskScore;
    transaction.isFlagged = riskScore >= 80;

    if (transaction.isFlagged) {
      transaction.flagReason = "High risk score after update";
    } else {
      transaction.flagReason = null;
    }

    const updatedTransaction = await transaction.save();
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: "Error updating transaction", error });
  }
};

// ✅ Delete a transaction
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

// ✅ Flag a transaction manually
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

// ✅ Unflag a transaction manually
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

// ✅ Get all flagged transactions
const getFlaggedTransactions = async (req, res) => {
  try {
    const { groupId } = req.query;

    const query = { isFlagged: true };
    if (groupId) query.group = groupId;

    const flaggedTransactions = await Transaction.find(query);
    res.status(200).json(flaggedTransactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching flagged transactions", error });
  }
};

// ✅ Update transaction status
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
