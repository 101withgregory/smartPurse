import React, { useEffect, useState } from "react";

import FinancialSummary from "../components/FinancialSummary";
import SavingsChart from "../components/SavingsChart";
import ContributionsChart from "../components/ContributionsChart";
import TransactionsTable from "../components/TransactionsTable";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [savingsData, setSavingsData] = useState([]);
  const [contributionsData, setContributionsData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, savingsRes, contributionsRes] = await Promise.all([
          API.get("/dashboard/summary"), // Includes recent transactions
          API.get("/dashboard/savings"),
          API.get("/dashboard/contributions"),
        ]);

        setSummary(summaryRes.data);
        setSavingsData(savingsRes.data);
        setContributionsData(contributionsRes.data);
        setTransactions(summaryRes.data.recentTransactions); // Extract transactions from summary
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <FinancialSummary summary={summary} />
      <SavingsChart data={savingsData} />
      <ContributionsChart data={contributionsData} />
      <TransactionsTable transactions={transactions} />
    </div>
  );
};

export default Dashboard;
