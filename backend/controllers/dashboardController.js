const Transaction = require("../models/transactionModel");
const Kitty = require("../models/kittyModel");
const User = require("../models/userModel");
const Anomaly = require("../models/Anomaly");

// Fetch dashboard summary data
const getDashboardSummary = async (req, res) => {
  try {
    // Get total funds (sum of all successful transactions)
    const totalFunds = await Kitty.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    // Get pending transactions count
    const pendingTransactions = await Transaction.countDocuments({ status: "pending" });

    // Get flagged anomalies count
    const flaggedAnomalies = await Anomaly.countDocuments();

    // Get recent transactions (last 5)
    const recentTransactions = await Transaction.find()
      .populate("user", "name email") // Populate user details
      .populate("kittyId", "kittyName") // Populate kitty details
      .sort({ createdAt: -1 })
      .limit(5);

    const formattedTransactions = recentTransactions.map((tx) => ({
      id: tx._id,
      kittyName: tx.kittyId ? tx.kittyId.kittyName : "Personal",
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
      { $match: {transactionType: "CASH-IN" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          savings: { $sum: "$amount" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // Convert month numbers (1-12) to names
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedData = savingsData.map((entry) => ({
      month: months[entry._id - 1],
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
    const contributions = await Kitty.aggregate([
      {
        $lookup: {
          from: "transactions",
          localField: "_id",
          foreignField: "kittyId",
          as: "kittyContributions"
        }
      },
      {
        $project: {
          kittyName: "$kittyName",
          totalContributions: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$kittyContributions",
                    as: "contribution",
                    cond: {
                      $and: [
                        { $eq: ["$$contribution.transactionType", "CASH-IN"] },
                        { $eq: ["$$contribution.status", "approved"] }, // ✅ Only approved
                        { $ne: ["$$contribution.isFlagged", true] }      // ✅ Ignore flagged
                      ]
                    }
                  }
                },
                as: "filteredContribution",
                in: "$$filteredContribution.amount"
              }
            }
          }
        }
      },
      { $sort: { totalContributions: -1 } }, // ✅ Sort from highest to lowest
      { $limit: 3 } // ✅ Top 3 contributors
    ]);

    res.status(200).json(contributions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contributions data", error });
  }
};


module.exports = { getDashboardSummary, getSavingsChartData, getContributionsChartData };
