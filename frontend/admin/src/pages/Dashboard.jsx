import React from "react";
import FinancialSummary from "../components/FinancialSummary";
import SavingsChart from "../components/SavingsChart";
import ContributionsChart from "../components/ContributionsChart";
import TransactionsTable from "../components/TransactionsTable";


const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <FinancialSummary />
      <SavingsChart />
      <ContributionsChart />
      <TransactionsTable />
    </div>
  );
};

export default Dashboard;
