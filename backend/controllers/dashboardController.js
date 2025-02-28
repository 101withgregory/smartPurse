const Transaction = require("../models/transactionModel");
const Group = require("../models/groupModel"); // Ensure you have a Group model
const User = require("../models/userModel");

// Fetch dashboard summary data
const getDashboardSummary = async (req, res) => {
  try {
    // Get total funds (sum of successful transactions)
    const totalFunds = await Transaction.aggregate([
      { $match: { status: "successful" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Get pending transactions count
    const pendingTransactions = await Transaction.countDocuments({ status: "pending" });

    // Get flagged anomalies count
    const flaggedAnomalies = await Transaction.countDocuments({ isFlagged: true });

    // Get recent transactions (last 5)
    const recentTransactions = await Transaction.find().sort({ createdAt: -1 }).limit(5);

    // Get group savings data (group-wise total savings)
    const groupSavings = await Group.aggregate([
      {
        $lookup: {
          from: "transactions",
          localField: "_id",
          foreignField: "groupId",
          as: "groupTransactions",
        },
      },
      {
        $project: {
          name: 1,
          totalSavings: { $sum: "$groupTransactions.amount" },
        },
      },
    ]);

    res.status(200).json({
      totalFunds: totalFunds[0]?.total || 0,
      pendingTransactions,
      flaggedAnomalies,
      recentTransactions,
      groupSavings,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data", error });
  }
};

module.exports = { getDashboardSummary };
