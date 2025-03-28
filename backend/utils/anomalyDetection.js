const Anomaly = require('../models/Anomaly');
const Transaction = require("../models/transactionModel");
const axios = require("axios");

const FLASK_API_URL = process.env.FLASK_API_URL || 'http://127.0.0.1:5001';

exports.detectAnomalies = async (transactionId) => {
  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      console.log(`Transaction ${transactionId} not found`);
      return;
    }

    // Supplement missing data
    const lastTransaction = await Transaction.findOne({ user: transaction.user }).sort({ createdAt: -1 });

    if (lastTransaction) {
      transaction.oldbalanceOrg = lastTransaction.newBalance || transaction.amount;
      transaction.newBalance = transaction.oldbalanceOrg - transaction.amount;
      transaction.timeDiff = (new Date(transaction.transactionTime) - new Date(lastTransaction.transactionTime)) / 1000;
      transaction.balanceChangeRatio = (transaction.oldbalanceOrg - transaction.newBalance) / (transaction.oldbalanceOrg + 1e-9);
    } else {
      transaction.oldbalanceOrg = transaction.amount;
      transaction.newBalance = 0;
      transaction.timeDiff = 0;
      transaction.balanceChangeRatio = 0;
    }

    // Map senderPhone and recipientPhone to numeric IDs
    transaction.accountOrig = encodePhoneNumber(transaction.senderPhone);
    transaction.accountDest = encodePhoneNumber(transaction.recipientPhone);

    // Send data to Flask API
    const payload = {
      amount: transaction.amount || 0,
      oldbalanceOrg: transaction.oldbalanceOrg || 0,
      newbalanceOrig: transaction.newBalance || 0,
      oldbalanceDest: 0,
      newbalanceDest: 0,
      time_diff: transaction.timeDiff || 0,
      balance_change_ratio: transaction.balanceChangeRatio || 0,
      amount_vs_median: 0,
      type__CASH_IN: transaction.transactionType === 'CASH-IN' ? 1 : 0,
      type__CASH_OUT: transaction.transactionType === 'CASH-OUT' ? 1 : 0,
      type__DEBIT: transaction.transactionType === 'DEBIT' ? 1 : 0,
      type__PAYMENT: transaction.transactionType === 'PAYMENT' ? 1 : 0,
      type__TRANSFER: transaction.transactionType === 'TRANSFER' ? 1 : 0,
      accountOrig: transaction.accountOrig || 0,
      accountDest: transaction.accountDest || 0
    };

    console.log("Payload sent to Flask:", payload);

    try {
      const response = await axios.post(`${FLASK_API_URL}/predict`, payload);
      let riskScore = response.data.riskScore;

      console.log(`Predicted Risk Score: ${riskScore}`);

      // ✅ Save risk score to transaction
      transaction.riskScore = riskScore;
      transaction.isFlagged = riskScore >= 60;
      transaction.flagReason = riskScore >= 60 ? "High risk score detected" : "Low risk score";
      await transaction.save();

      // ✅ Save anomaly if flagged
      if (riskScore >= 60) {
        const anomaly = new Anomaly({
          transactionId,
          riskScore,
          detectedBySystem: true,
          reason: "Transaction flagged due to high risk score",
          status: "flagged",
          detectedAt: new Date()
        });
        await anomaly.save();
        console.log(`Anomaly detected for transaction ${transactionId}`);
      }
    } catch (error) {
      console.error("Python API call failed:", error.response ? error.response.data : error.message);
    }
  } catch (error) {
    console.error("Error detecting anomalies:", error);
  }
};

// ✅ Helper function
function encodePhoneNumber(phone) {
  return phone ? parseInt(phone.replace(/[^0-9]/g, "")) || 0 : 0;
}
