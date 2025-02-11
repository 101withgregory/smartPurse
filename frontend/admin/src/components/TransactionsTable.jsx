import React, { useState, useEffect } from "react";

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
   
    const fetchedData = [
      { id: 1, group_name: "Savings Club", user: "John Doe", type: "deposit", amount: 1000, status: "completed", anomaly_detected: false, date: "09/02/2025-10:30 AM" },
      { id: 2, group_name: "Family Fund", user: "Jane Smith", type: "withdrawal", amount: 500, status: "pending", anomaly_detected: false, date: "07/02/2025-11:15 AM" },
      { id: 3, group_name: "Business Pool", user: "Mike Lee", type: "deposit", amount: 700, status: "completed", anomaly_detected: true, date: "05/02/2025-01:45 PM" },
    ];
    setTransactions(fetchedData);
  }, []);

  return (
    <div className="bg-white shadow rounded-lg transactions-table">
      <h3 className="text-lg font-semibold">Latest Transactions</h3>
      <table className="w-full border-collapse mt-2">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="text-left p-2">Id</th>
            <th className="text-left p-2">Group</th>
            <th className="text-left p-2">User</th>
            <th className="text-left p-2">Type</th>
            <th className="text-left p-2">Amount</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Anomaly</th>
            <th className="text-left p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={tx.id} className="border-b">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{tx.group_name}</td>
              <td className="p-2">{tx.user}</td>
              <td className="p-2">{tx.type}</td>
              <td className="p-2">Ksh{tx.amount}</td>
              <td className={`p-2 ${tx.status === "pending" ? "text-yellow-500" : "text-green-500"}`}>
                {tx.status}
              </td>
              <td className={`p-2 ${tx.anomaly_detected ? "text-red-500" : "text-gray-500"}`}>
                {tx.anomaly_detected ? "Yes" : "No"}
              </td>
              <td className="p-2">{tx.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
