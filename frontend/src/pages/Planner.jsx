import React from "react";
import styles from "./planner.module.css";
import TaskCalendar from "../components/TaskCalendar";

const Planner = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.plannerHeader}>Planner Calendar</h2>
      <TaskCalendar />
    </div>
  );
};

export default Planner;
