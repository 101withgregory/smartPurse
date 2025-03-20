const Transaction = require("../models/transactionModel");
const Group = require("../models/groupModel"); 
const User = require("../models/userModel");

// Fetch dashboard summary data
const getDashboardSummary = async (req, res) => {
  try {
    // Get total funds (sum of successful transactions)
    const totalFunds = await Transaction.aggregate([
      { $match: { transactionType: "deposit" } }, // Only deposits count as savings
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Get pending transactions count
    const pendingTransactions = await Transaction.countDocuments({ status: "pending" });

    // Get flagged anomalies count
    const flaggedAnomalies = await Transaction.countDocuments({ isFlagged: true });

    // Get recent transactions (last 5)
    const recentTransactions = await Transaction.find()
      .populate("user", "name") // Fetch user name
      .populate("group", "name") // Fetch group name
      .sort({ createdAt: -1 })
      .limit(5);

    const formattedTransactions = recentTransactions.map((tx) => ({
      id: tx._id,
      group_name: tx.group ? tx.group.name : "Personal",
      user: tx.user ? tx.user.name : "Unknown",
      type: tx.transactionType,
      amount: tx.amount,
      status: tx.status,
      anomaly_detected: tx.isFlagged,
      date: tx.createdAt.toLocaleString(),
    }));

    res.status(200).json({
      totalFunds: totalFunds[0]?.total || 0,
      pendingTransactions,
      flaggedAnomalies,
      recentTransactions: formattedTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data", error });
  }
};

// Fetch savings data grouped by month
const getSavingsChartData = async (req, res) => {
  try {
    const savingsData = await Transaction.aggregate([
      { $match: { status: "approved", transactionType: "deposit" } }, // Ensure it's only deposits
      {
        $group: {
          _id: { $month: "$createdAt" }, // Group by month
          savings: { $sum: "$amount" }, // Sum savings per month
        },
      },
      { $sort: { "_id": 1 } }, // Sort by month
    ]);

    // Convert month numbers (1-12) to names
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedData = savingsData.map((entry) => ({
      month: months[entry._id - 1], // Convert number to month name
      savings: entry.savings,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching savings data", error });
  }
};

// Fetch contributions distribution for pie chart
const getContributionsChartData = async (req, res) => {
  try {
    const contributions = await Group.aggregate([
      {
        $lookup: {
          from: "transactions",
          localField: "_id",
          foreignField: "group",
          as: "groupContributions",
        },
      },
      { $unwind: { path: "$groupContributions", preserveNullAndEmptyArrays: true } }, // ✅ Flatten the array
      {
        $match: {
          "groupContributions.transactionType": "deposit", // ✅ Match correct field
        },
      },
      {
        $group: {
          _id: "$_id",
          group: { $first: "$name" }, // ✅ Use $first to get group name
          amount: { $sum: "$groupContributions.amount" }, // ✅ Sum the deposit amounts
        },
      },
      { $sort: { amount: -1 } }, // ✅ Sort by highest deposit
    ]);

    res.status(200).json(contributions);
  } catch (error) {
    console.error("Error fetching contributions data:", error);
    res.status(500).json({ message: "Error fetching contributions data", error });
  }
};


module.exports = { getDashboardSummary, getSavingsChartData, getContributionsChartData };
