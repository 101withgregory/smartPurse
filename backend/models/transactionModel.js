const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    kittyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Kitty', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    transactionType: {
      type: String,
      enum: ["CASH-IN", "CASH-OUT", "TRANSFER", "REVERSAL", "PAYMENT", "DEBIT"],
      required: true,
    },
    mpesaReference: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "reversed"],
      default: "pending",
    },
    senderPhone: { type: String },
    recipientPhone: { type: String },
    merchantCode: { type: String },
    transactionTime: { type: Date, default: Date.now },
    charges: { type: Number },

    // Balance Tracking
    oldbalanceOrg: { type: Number },
    newbalanceOrig: { type: Number },
    oldbalanceDest: { type: Number },
    newbalanceDest: { type: Number },

    // Anomaly Detection Data
    balanceChangeRatio: { type: Number },
    timeDiff: { type: Number },
    frequency: { type: Number },
    location: { type: String },
    deviceType: { type: String, default: "mobile" },

    // New fields for training alignment
    accountOrig: { type: Number },
    accountDest: { type: Number }, 

    riskScore: { type: Number, default: 10 },
    isFlagged: { type: Boolean, default: false },
    flagReason: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
