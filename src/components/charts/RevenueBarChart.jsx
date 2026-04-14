import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function RevenueBarChart({ data }) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Revenue",
        data: data.values,
        backgroundColor: ["#ffc107", "#007bff", "#28a745", "#dc3545"],
        borderRadius: 8,
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
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default RevenueBarChart;