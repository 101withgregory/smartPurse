const asyncHandler = require("express-async-handler");
const Transaction = require("../models/transactionModel");
const Kitty = require("../models/kittyModel");

// ✅ Initiate payment (Generate Payment Link)
const initiatePayment = asyncHandler(async (req, res) => {
  const { kittyId, amount, senderPhone, mpesaReference } = req.body;

  if (!kittyId || !amount || !senderPhone) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const kitty = await Kitty.findById(kittyId);
  if (!kitty) {
    res.status(404);
    throw new Error("Kitty not found");
  }

  const transaction = await Transaction.create({
    kittyId,
    user: req.user._id,
    amount,
    transactionType: "CASH-IN",
    mpesaReference,
    status: "pending",
    senderPhone,
  });

  // ✅ Send to Payment Gateway
  const paymentUrl = `${process.env.PAYMENT_GATEWAY_URL}?ref=${transaction._id}&amount=${amount}&phone=${senderPhone}`;
  
  res.status(200).json({ paymentUrl });
});

// ✅ Handle Payment Confirmation (M-Pesa Callback)
const confirmPayment = asyncHandler(async (req, res) => {
  const { ref, status, amount } = req.body;

  const transaction = await Transaction.findById(ref);
  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  // ✅ Update Transaction Status
  transaction.status = status;
  transaction.newBalance = transaction.previousBalance + amount;
  transaction.isFlagged = false; // Reset flag after success
  await transaction.save();

  if (status === "successful") {
    const kitty = await Kitty.findById(transaction.kittyId);

    if (kitty) {
      // ✅ Update Kitty Amount
      kitty.totalAmount += amount;
      kitty.contributors.push({
        userId: transaction.user,
        amount,
      });

      await kitty.save();
    }
  }

  res.status(200).json({ message: "Payment confirmed" });
});

// Contribute to Kitty via Mpesa
const contributeToKitty = asyncHandler(async (req, res) => {
  const { kittyId, amount, mpesaReference } = req.body;

  const kitty = await Kitty.findById(kittyId);
  if (!kitty) {
    res.status(404);
    throw new Error("Kitty not found");
  }

  // Check for duplicate Mpesa reference
  const existingTransaction = await Transaction.findOne({ mpesaReference });
  if (existingTransaction) {
    res.status(400);
    throw new Error("Duplicate Mpesa reference");
  }

  // Create Transaction
  const transaction = await Transaction.create({
    kittyId: kitty._id,
    user: req.user._id,
    amount,
    transactionType: "CASH-IN",
    mpesaReference,
    status: "pending",
  });

  // Add Contribution to Kitty
  kitty.totalAmount += amount;
  kitty.transactions.push(transaction._id);
  kitty.contributors.push({
    userId: req.user._id,
    amount,
  });

  await kitty.save();

  res.status(201).json({
    message: `Contribution of ${amount} added to kitty ${kitty.kittyName}`,
    transaction,
  });
});

// Mpesa Callback to Update Transaction Status
const handleMpesaCallback = asyncHandler(async (req, res) => {
  const { mpesaReference, status } = req.body;

  const transaction = await Transaction.findOne({ mpesaReference });
  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  // Update Transaction Status
  transaction.status = status;
  await transaction.save();

  // If successful, update the kitty balance
  if (status === "successful") {
    const kitty = await Kitty.findById(transaction.kittyId);
    if (kitty) {
      kitty.totalAmount += transaction.amount;
      await kitty.save();
    }
  }

  res.status(200).json({ message: "Transaction status updated" });
});

module.exports = {
  initiatePayment,
  confirmPayment,
  contributeToKitty,
  handleMpesaCallback,
};
