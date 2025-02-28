// const mongoose = require("mongoose");

// const transactionSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     type: {
//       type: String,
//       enum: ["deposit", "withdrawal", "payment", "contribution"],
//       required: true,
//     },
//     amount: {
//       type: Number,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["pending", "completed", "failed"],
//       default: "pending",
//     },
//     date: {
//       type: Date,
//       default: Date.now,
//     },
//     reference: {
//       type: String,
//       unique: true,
//       required: true,
//     },
//     anomaly: {
//       type: Boolean,
//       default: false, // Transactions start as normal
//     },
//     anomaly_reason: {
//       type: String,
//       default: null, // If flagged, this stores why
//     },
//   },
//   { timestamps: true }
// );

// const Transaction = mongoose.model("Transaction", transactionSchema);

// module.exports = Transaction;
const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links to the User model
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group", // Links to the Group model (if applicable)
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionType: {
      type: String,
      enum: ["deposit", "withdrawal", "transfer"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    // Anomaly detection fields
    riskScore: {
      type: Number,
      default: 0, // 0 means low risk
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
