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
        const totalContributions = data.reduce(
          (total, item) => total + (item.totalContributions || 0),
          0
        );
    
        const normalizedData = data.map((item) => ({
          ...item,
          percentage: totalContributions
            ? ((item.totalContributions / totalContributions) * 100).toFixed(1)
            : 0,
        }));
    
        // Sort and take the top 3 contributions
        const topContributions = normalizedData
          .sort((a, b) => b.totalContributions - a.totalContributions)
          .slice(0, 3);
    
        console.log("Top 3 Contributions:", topContributions);
        setContributions(topContributions);
      } catch (error) {
        console.error("Error fetching contributions data:", error);
      }
    };
    

    fetchContributions();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-center mb-4">
        Top 3 Kitty Contributions Distribution
      </h3>
      <div className="w-full h-[320px] object-contain">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={contributions}
              cx="50%"
              cy="50%"
              outerRadius={100}
              paddingAngle={2}
              dataKey="totalContributions"
              nameKey="kittyName"
              label={({ name, percentage }) =>
                `${name.length > 10 ? name.substring(0, 10) + "..." : name} (${percentage}%)`
              }
              labelLine={false}
            >
              {contributions.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              verticalAlign="bottom"
              layout="horizontal"
              iconType="circle"
              iconSize={10}
              wrapperStyle={{
                fontSize: "12px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ContributionsChart;
