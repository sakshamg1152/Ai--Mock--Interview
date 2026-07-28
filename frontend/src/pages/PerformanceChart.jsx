import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";


function PerformanceChart({data}) {
  if (data.length === 0) {
    return (
        <div className="performanceSection">

            <div className="sectionTitle">
                <h2>Performance Overview</h2>
                <span>Your interview scores over time</span>
            </div>

            <div className="chartCard emptyChart">

                <div className="emptyChartContent">

                    <h3>📈 No Performance Data Yet</h3>

                    <p>
                        Complete your first interview to start tracking your
                        progress over time.
                    </p>

                </div>

            </div>

        </div>
    );
}
  return (
    <div className="performanceSection">

      <div className="sectionTitle">

        <h2>Performance Overview</h2>

        <span>Your interview scores over time</span>

      </div>

      <div className="chartCard">

        <ResponsiveContainer width="100%" height={350}>

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="4 4" />

            <XAxis dataKey="interview" />

            <YAxis domain={[50, 100]} />

            <Tooltip
                formatter={(value)=>`${value}%`}
            />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#6366F1"
              strokeWidth={4}
              dot={{ r: 6 }}
              activeDot={{ r: 8 }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default PerformanceChart;