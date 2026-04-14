import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

function TrendLineChart({ data }) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Pipeline Value",
        data: data.values,
        fill: true,
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.12)",
        tension: 0.35,
        pointBackgroundColor: "#007bff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div style={{ height: "320px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default TrendLineChart;