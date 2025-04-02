const mongoose = require("mongoose");

const contributionSchema = new mongoose.Schema(
  {
    kittyAddress: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    transactionRef: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Contribution = mongoose.model("Contribution", contributionSchema);

module.exports = Contribution;
