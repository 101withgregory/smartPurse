import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFB"];

const ContributionsChart = () => {
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    const fetchedData = [
      { group: "Group A", amount: 1200 },
      { group: "Group B", amount: 800 },
      { group: "Group C", amount: 1500 },
      { group: "Group D", amount: 500 },
    ];
    setContributions(fetchedData);
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-4 contributions">
      <h3 className="text-lg font-semibold text-center mb-2">Contributions Distribution</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={contributions}
            cx="50%"
            cy="50%"
            outerRadius="70%"
            dataKey="amount"
            nameKey="group"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {contributions.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" iconSize={10} layout="vertical" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ContributionsChart;
