import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import dashboardSummaryService from "../services/dashboardSummaryService";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFB"];

const ContributionsChart = () => {
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const data = await dashboardSummaryService.getContributionsChartData();
        setContributions(data);
      } catch (error) {
        console.error("Error fetching contributions data:", error);
      }
    };

    fetchContributions();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-center mb-4">
        Contributions Distribution
      </h3>
      <div className="w-full h-[300px] object-contain">
        <ResponsiveContainer>
          <PieChart>
            {/* Define gradients for the 3D effect */}
            <defs>
              {COLORS.map((color, index) => (
                <linearGradient id={`color-${index}`} key={index} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} />
                  <stop offset="100%" stopColor="#000" stopOpacity="0.2" />
                </linearGradient>
              ))}
            </defs>

            <Pie
              data={contributions}
              cx="50%"
              cy="50%"
              outerRadius={100} // ✅ Full pie chart without inner radius
              paddingAngle={3}
              dataKey="amount"
              nameKey="group"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
              isAnimationActive={true}
            >
              {contributions.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#color-${index})`}
                  stroke="#444"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                padding: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                color: "#333",
                fontSize: "14px",
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={12}
              layout="horizontal"
              align="center"
              wrapperStyle={{
                fontSize: "14px",
                color: "#4B5563",
                marginTop: "10px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ContributionsChart;
