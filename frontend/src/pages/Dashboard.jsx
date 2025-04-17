
import React from "react";
import styles from "./dashboard.module.css";
import PieChart from "../components/PieChart.jsx";
import BarGraph from "../components/BarGraph.jsx";
const Dashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.leftSide}>
        <div className={styles.calendarPlaceholder}>
          <h3>Calendar View (Coming Soon)</h3>
        </div>
        <div className={styles.reminders}>
          <h3>Reminders</h3>
          <ul>
          </ul>
        </div>
      </div>

      <div className={styles.rightSide}>
        <div className={styles.welcomeCard}>
          <h2>Welcome back, Shormi</h2>
          
        </div>
<div className={styles.chartsRow}>
  <div className={styles.barChart}>
    <h3>Progress Overview</h3>
    <BarGraph/>
  </div>
  <div className={styles.pieChart}>
    <h3>Task Distribution</h3>
    <PieChart />
  </div>
</div>

        <div className={styles.todayTasks}>
          <h3>Today's Tasks</h3>
          <ul>
            
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
