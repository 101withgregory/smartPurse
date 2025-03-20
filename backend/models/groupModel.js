
const mongoose = require("mongoose");

const groupSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["admin", "member"], default: "member" },
      },
    ],
    
    totalFunds: { type: Number, default: 0 },

    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction", // Reference to Transaction model
      },
    ],

    minContribution: { type: Number, default: 0 },
    withdrawalLimit: { type: Number, default: 0 },

    visibility: { type: String, enum: ["public", "private"], default: "private" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);