const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links to the User model
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionType: {
      type: String,
      enum: ["CASH-IN", "CASH-OUT", "TRANSFER", "REVERSAL"],
      required: true,
    },
    mpesaReference: {
      type: String, // MPESA Transaction ID (e.g., LK872H123)
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "successful", "failed", "reversed"],
      default: "pending",
    },
    senderPhone: {
      type: String, // MPESA sends phone number for sender
      required: false,
    },
    recipientPhone: {
      type: String, // Phone number for recipient
      required: false,
    },
    merchantCode: {
      type: String, // For paybill/till number transactions
      required: false,
    },
    transactionTime: {
      type: Date,
      default: Date.now,
    },
    charges: {
      type: Number, // MPESA fees if available
      required: false,
    },
    // ✅ Anomaly Detection Fields
    previousBalance: {
      type: Number, // Old balance before transaction
      required: false,
    },
    newBalance: {
      type: Number, // New balance after transaction
      required: false,
    },
    balanceChangeRatio: {
      type: Number, // Ratio of balance change
      required: false,
    },
    timeDiff: {
      type: Number, // Time difference with previous transaction
      required: false,
    },
    frequency: {
      type: Number, // How often user transacts
      required: false,
    },
    location: {
      type: String, // MPESA may provide location
      required: false,
    },
    deviceType: {
      type: String, // "mobile", "desktop", "tablet"
      required: false,
      default: "mobile",
    },
    riskScore: {
      type: Number,
      default: 0,
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
    flagReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
