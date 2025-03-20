const mongoose = require("mongoose");
const AnomalySchema = new mongoose.Schema({
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction", required: true },
    detectedBySystem: { type: Boolean, default: true }, // AI vs manual flagging
    reason: { type: String, required: true }, // Why was it flagged?
    riskScore: { type: Number, min: 0, max: 100, required: true },
    detectedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["flagged", "reviewed", "resolved"], default: "flagged" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null }, // Admin who reviews
    resolutionNotes: { type: String, default: "" }
  });
  
  module.exports = mongoose.model("Anomaly", AnomalySchema);
  