const asyncHandler = require("express-async-handler");
const Transaction = require("../models/transactionModel");
const Kitty = require("../models/kittyModel");
const { detectAnomalies } = require("../utils/anomalyDetection");
const Anomaly = require("../models/Anomaly");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

// Create a new transaction
const createTransaction = asyncHandler(async (req, res) => { 
  const {
    kittyId,
    amount,
    transactionType,
    mpesaReference,
    senderPhone,
    recipientPhone,
    merchantCode,
    charges,
  } = req.body;

  if (!kittyId || !amount || !transactionType) {
    res.status(400);
    throw new Error("All required fields must be provided");
  }

  // Check if the Kitty exists
  const kitty = await Kitty.findById(kittyId);
  if (!kitty) {
    res.status(404);
    throw new Error("Kitty not found");
  }

  // Prevent duplicate MPESA reference
  const existingTransaction = await Transaction.findOne({ mpesaReference });
  if (existingTransaction) {
    res.status(400);
    throw new Error("Transaction with this MPESA reference already exists");
  }

  const transaction = await Transaction.create({
    kittyId,
    user: req.user._id,
    amount,
    transactionType,
    mpesaReference,
    senderPhone,
    recipientPhone,
    merchantCode,
    charges,
    previousBalance: kitty.totalAmount,
    newBalance: kitty.totalAmount, // Keep the same until approval
    balanceChangeRatio: 0, // No change until approval
    timeDiff: 0,
    status: 'pending',
  });

  console.log(`Transaction created with amount: ${amount}`);

  // Trigger anomaly detection if amount >= 800,000
  if (amount >= 800000) {
    console.log("High risk amount detected — triggering anomaly detection");
    detectAnomalies(transaction._id);
  }

  res.status(201).json(transaction);
});







// Get all transactions
const getAllTransactions = asyncHandler(async (req, res) => {
  const { kittyId } = req.query;

  const query = {};
  if (kittyId) query.kittyId = kittyId;

  const transactions = await Transaction.find(query)
    .populate("user", "name email")
    .populate("kittyId", "kittyName")
    .sort({ createdAt: -1 });

  res.status(200).json(transactions);
});

// Get a transaction by ID
const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate("user", "name email")
    .populate("kittyId", "kittyName");

  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  res.status(200).json(transaction);
});

// Update a transaction
const updateTransactionStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  // Prevent updates for flagged transactions
  if (transaction.isFlagged) {
    res.status(400);
    throw new Error("Cannot update a flagged transaction");
  }

  // Prevent double processing for approved/rejected transactions
  if (transaction.status === status) {
    res.status(400).json({ message: `Transaction is already ${status}` });
    return;
  }

  const kitty = await Kitty.findById(transaction.kittyId);
  if (kitty) {
    if (transaction.status === 'pending' && status === 'approved') {
      // Increase kitty balance ONLY when moving from 'pending' to 'approved'
      kitty.totalAmount += Math.abs(transaction.amount);
    } else if (transaction.status === 'approved' && status === 'rejected') {
      // Reduce balance ONLY if transaction was already approved before
      kitty.totalAmount = Math.max(kitty.totalAmount - Math.abs(transaction.amount), 0);
    }
    await kitty.save();
  }

  // Update the status only if it’s changing
  transaction.status = status;
  await transaction.save();

  // Get the user's email
  const user = await User.findById(transaction.user);
  if (user && user.email) {
    let emailSubject = `Transaction ${status}`;
    let emailText = `Hello ${user.firstName},\n\nYour transaction with amount KES ${transaction.amount} has been ${status}.\n\nThank you for using SmartPurse.`;

    if (transaction.isFlagged) {
      emailSubject = "Transaction Flagged for Review";
      emailText = `Hello ${user.firstName},\n\nYour transaction with amount KES ${transaction.amount} has been flagged for review. Please contact support if needed.`;
    }

    // Send email
    await sendEmail(user.email, emailSubject, emailText);
  }

  res.status(200).json(transaction);
});





// Delete a transaction
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  // Prevent deleting approved transactions
  if (transaction.status === "approved") {
    res.status(400);
    throw new Error("Cannot delete an approved transaction");
  }

  // Find the associated kitty
  const kitty = await Kitty.findById(transaction.kittyId);
  if (kitty) {
    // Remove transaction from kitty's transactions array safely
    if (kitty.transactions?.length) {
      kitty.transactions = kitty.transactions.filter(
        (id) => id.toString() !== transaction._id.toString()
      );
    }

    await kitty.save();
  }

  // Delete the transaction
  await Transaction.findByIdAndDelete(transaction._id);

  res.status(200).json({ message: "Transaction deleted successfully" });
});



// Flag a transaction
const flagTransaction = asyncHandler(async (req, res) => {
  const { flagReason } = req.body;

  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  //Flag transaction
  transaction.isFlagged = true;
  transaction.flagReason = flagReason || "Flagged manually by admin";
  await transaction.save();

  // Create anomaly document
  const anomaly = new Anomaly({
    transactionId: transaction._id,
    riskScore: transaction.riskScore || 0, // Use current risk score if available
    detectedBySystem: false, // Mark as manually flagged
    reason: transaction.flagReason,
    status: "flagged",
    detectedAt: new Date(),
  });

  await anomaly.save();
  console.log(`Anomaly created for transaction ${transaction._id}`);

  res.status(200).json(transaction);
});

// Unflag a transaction
const unflagTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  // Unflag the transaction
  transaction.isFlagged = false;
  transaction.flagReason = "";
  await transaction.save();

  // Remove corresponding anomaly entry
  await Anomaly.deleteOne({ transactionId: transaction._id });

  console.log(`Anomaly removed for transaction ${transaction._id}`);

  res.status(200).json(transaction);
});

// Get flagged transactions
const getFlaggedTransactions = asyncHandler(async (req, res) => {
  const { kittyId } = req.query;

  const query = { isFlagged: true };
  if (kittyId) query.kittyId = kittyId;

  const transactions = await Transaction.find(query)
    .populate("user", "name email")
    .populate("kittyId", "kittyName");

  res.status(200).json(transactions);
});




module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  deleteTransaction,
  flagTransaction,
  unflagTransaction,
  getFlaggedTransactions,
  updateTransactionStatus,
};
