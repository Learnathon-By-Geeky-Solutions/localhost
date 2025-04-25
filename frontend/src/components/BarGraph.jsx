import React from "react";
import { Bar } from "react-chartjs-2";
import styles from "./barGraph.module.css";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarGraph = () => {
  const data = {
    labels: ["Math", "Physics", "CS", "Chem", "Biology"],
    datasets: [
      {
        label: "Study Hours",
        data: [10, 7, 12, 5, 8],
        backgroundColor: "#4caf50",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 2 },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className={styles.barChartContainer}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarGraph;
