
import React from "react";
import styles from "./dashboard.module.css";
import PieChart from "../components/PieChart.jsx";
import BarGraph from "../components/BarGraph.jsx";
const Dashboard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <div className={styles.calendarPlaceholder}>
          <h3>Calendar View (Coming Soon)</h3>
        </div>
        <div className={styles.reminders}>
          <h3>Reminders</h3>
          <ul>
            <li>dsds</li>
            <li>dsds</li>
            <li>dsds</li>
            <li>dsds</li>
            <li>dsds</li>
            <li>dsds</li>
            <li>dsds</li>
            <li>dsds</li>
            <li>dsds</li>
            <li>dsds</li>
            <li>dsds</li>
            <li>dsds</li>
            <li>dsds</li>

          </ul>
        </div>
      </div>

      <div className={styles.rightSide}>
        <div className={styles.welcomeCard}>
          Welcome back, Shormi
        </div>

        <div className={styles.chartsRow}>
          <div className={styles.chart}>
            <BarGraph/>
          </div>
          <div className={styles.chart}>
            <PieChart/>
          </div>
        </div>

        <div className={styles.todayTasks}>
          <h3>Today's Tasks</h3>
          <ul>
            <li>dsds</li>
            <li>dsds</li>
            <li>dsds</li>
            <li>dsds</li>
            <li>dsds</li>
            <li>dsds</li>
            <li>dsds</li>
            <li>dsds</li>
            <li>dsds</li>
            <li>dsds</li>
            <li>dsds</li>
            <li>dsds</li>
            <li>dsds</li>

          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
