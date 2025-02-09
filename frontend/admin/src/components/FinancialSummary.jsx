import React, { useState, useEffect } from "react";
import { FiTrendingUp, FiClock, FiAlertTriangle } from "react-icons/fi";

const FinancialSummary = () => {
  const [summary, setSummary] = useState({
    totalFunds: 0,
    pendingTransactions: 0,
    flaggedAnomalies: 0,
  });

  useEffect(() => {
  
    const fetchData = async () => {
      const totalFunds = 50000; 
      const pendingTransactions = 5;
      const flaggedAnomalies = 2;

      setSummary({ totalFunds, pendingTransactions, flaggedAnomalies });
    };

    fetchData();
  }, []);

  return (
    <div className="financial-summary">
      <div className="card p-4 bg-white shadow rounded-lg flex items-center flex-col justify-center">
        <FiTrendingUp size={24} className="text-green-500" />
        <div className="flex-col flex gap-3">
          <h3 className="text-sm font-semibold">Total Funds</h3>
          <p className="text-2xl font-bold text-center">${summary.totalFunds}</p>
        </div>
      </div>
      <div className="card p-4 bg-white shadow rounded-lg flex items-center flex-col justify-center">
        <FiClock size={24} className="text-yellow-500" />
        <div className="flex-col flex gap-3">
          <h3 className="text-sm font-semibold">Pending Transactions</h3>
          <p className="text-2xl font-bold text-center">{summary.pendingTransactions}</p>
        </div>
      </div>
      <div className="card p-4 bg-white shadow rounded-lg flex items-center flex-col justify-center">
        <FiAlertTriangle size={24} className="text-red-500" />
        <div className=" flex-col flex gap-3">
          <h3 className="text-sm font-semibold ">Flagged Anomalies</h3>
          <p className="text-2xl font-bold text-center">{summary.flaggedAnomalies}</p>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
