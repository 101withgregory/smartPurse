import React, { useState, useEffect } from "react";
import { FiTrendingUp, FiClock, FiAlertTriangle } from "react-icons/fi";
import dashboardSummaryService from "../services/dashboardSummaryService";

const FinancialSummary = () => {
  const [summary, setSummary] = useState({
    totalFunds: 0,
    pendingTransactions: 0,
    flaggedAnomalies: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dashboardSummaryService.getDashboardSummary();
        setSummary(data);
      } catch (error) {
        console.error("Error fetching financial summary:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="financial-summary">
      {/* Total Funds */}
      <div className="card p-4 bg-white shadow rounded-lg flex items-center flex-col justify-center">
        <FiTrendingUp size={24} className="text-green-500" />
        <div className="flex-col flex gap-3">
          <h3 className="text-sm font-semibold">Total Funds</h3>
          <p className="text-2xl font-bold text-center">
            Ksh {summary.totalFunds.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Pending Transactions */}
      <div className="card p-4 bg-white shadow rounded-lg flex items-center flex-col justify-center">
        <FiClock size={24} className="text-yellow-500" />
        <div className="flex-col flex gap-3">
          <h3 className="text-sm font-semibold">Pending Transactions</h3>
          <p className="text-2xl font-bold text-center">
            {summary.pendingTransactions}
          </p>
        </div>
      </div>

      {/* Flagged Anomalies */}
      <div className="card p-4 bg-white shadow rounded-lg flex items-center flex-col justify-center">
        <FiAlertTriangle size={24} className="text-red-500" />
        <div className="flex-col flex gap-3">
          <h3 className="text-sm font-semibold">Flagged Anomalies</h3>
          <p className="text-2xl font-bold text-center">
            {summary.flaggedAnomalies}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
