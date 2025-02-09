import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const data = [
  { month: "Jan", savings: 500 },
  { month: "Feb", savings: 700 },
  { month: "Mar", savings: 1200 },
  { month: "Apr", savings: 1800 },
];

const SavingsChart = () => {
  return (
    <div className="bg-white shadow rounded-lg charts">
      <h3 className="text-lg font-semibold">Group Savings Growth</h3>
      <LineChart width={700} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="savings" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};

export default SavingsChart;
