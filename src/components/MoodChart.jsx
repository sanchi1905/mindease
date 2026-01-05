// src/components/MoodChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MOOD_EMOJIS = {
  happy: "😊",
  neutral: "😐",
  sad: "😔",
  angry: "😡",
  excited: "🤩",
};

const MoodChart = ({ moodEntries }) => {
  const processDataForChart = () => {
    const moodCounts = moodEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(MOOD_EMOJIS).map((mood) => ({
      mood: `${MOOD_EMOJIS[mood]} ${mood}`,
      count: moodCounts[mood] || 0,
    }));
  };

  const chartData = processDataForChart();

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-3 text-blue-700">
        Mood Summary
      </h3>
      {moodEntries.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mood" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">
          No mood entries yet to display a chart.
        </p>
      )}
    </div>
  );
};

export default MoodChart;
