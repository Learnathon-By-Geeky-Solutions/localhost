import React from "react";
import styles from "./planner.module.css";
import TaskCalendar from "../components/TASKS/TaskCalendar";

const Planner = () => {
  return (
    <div className={styles.container}>
      <TaskCalendar />
    </div>
  );
};

export default Planner;
