
import React, { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import PieChart from "../components/PieChart.jsx";
import BarGraph from "../components/BarGraph.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import TaskList from "../components/TASKS/TaskList.jsx";
const Dashboard = () => {
  const { user } = useAuthStore();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem(`hasSeenWelcome`);    
    if (hasSeenWelcome==='false') {

      setShowWelcome(true);
  
      setTimeout(() => {
        setShowWelcome(false);
      }, 3000);
      localStorage.setItem(`hasSeenWelcome`, "true");
      
    }
  }, []);


  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <div className={styles.calendarPlaceholder}>
          <h3>Calendar View (Coming Soon)</h3>
        </div>
        <div className={styles.notes}>
          <h3>Notes</h3>
          <textarea spellCheck={false}/>
        </div>
      </div>

      <div className={styles.rightSide}>

        {showWelcome &&
          <div className={styles.welcomeCard}>
            Welcome back, {user.fullName}
          </div>
        }

        <div className={styles.chartsRow}>
          <div className={styles.chart}>
            <BarGraph />
          </div>
          <div className={styles.chart}>
            <PieChart />
          </div>
        </div>

        <div className={styles.todayTasks}>
          <TaskList/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
