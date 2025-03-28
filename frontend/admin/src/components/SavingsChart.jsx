import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import dashboardSummaryService from "../services/dashboardSummaryService";

const SavingsChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSavingsData = async () => {
      try {
        const savingsData = await dashboardSummaryService.getSavingsChartData();

        // Define all months
        const allMonths = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        // Merge fetched data into all months
        const completeData = allMonths.map(month => {
          const existing = savingsData.find(d => d.month === month);
          return existing || { month, savings: 0 };
        });

        setData(completeData);
      } catch (error) {
        console.error("Error fetching savings data:", error);
      }
    };

    fetchSavingsData();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg charts object-contain">
      <h3 className="text-lg font-semibold">Group Savings Growth</h3>
      <BarChart width={700} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="savings" fill="#56A5EC" />
      </BarChart>
    </div>
  );
};

export default SavingsChart;
