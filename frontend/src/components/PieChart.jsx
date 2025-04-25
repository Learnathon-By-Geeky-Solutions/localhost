import React from "react";
import { Pie } from "react-chartjs-2";
import styles from "./pieChart.module.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const data = {
    labels: ["Completed", "Pending", "Overdue"],
    datasets: [
      {
        label: "Tasks",
        data: [10, 7, 3],
        backgroundColor: ["#F7CFD8", "#F4F8D3", "#A6D6D6"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false, // important for full height
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className={styles.pieChartContainer}>
      <div className={styles.canvasWrapper}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChart;
