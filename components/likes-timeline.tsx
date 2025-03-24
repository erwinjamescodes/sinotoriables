"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
} from "recharts";
import { format, parseISO } from "date-fns";

interface LikesTimelineProps {
  data: { date: string; count: number }[];
}

// Custom tooltip component for better display
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-md">
        <p className="font-medium">{format(parseISO(label), "MMM d, yyyy")}</p>
        <p className="text-black">
          <span className="font-medium">Likes:</span> {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export function LikesTimeline({ data }: LikesTimelineProps) {
  // Format dates for better display
  const formattedData = data.map((item) => ({
    date: item.date,
    count: item.count,
    formattedDate: format(parseISO(item.date), "MMM d"),
  }));

  return (
    <div className="w-full h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: -30, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            opacity={0.3}
            className="bg-green-200"
          />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(parseISO(date), "MMM d")}
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis
            tickFormatter={(value) => value.toLocaleString()}
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <Tooltip content={<CustomTooltip />} />
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#000000" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#000000" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="count"
            stroke="#000000"
            fillOpacity={1}
            fill="url(#colorCount)"
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#000000"
            strokeWidth={2}
            dot={{ r: 3, fill: "#000000", strokeWidth: 1, stroke: "#ffffff" }}
            activeDot={{ r: 6 }}
            name="Likes"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
