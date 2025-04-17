// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import styles from "./notificationPanel.module.css";

const NotificationPanel = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reminderRes = await fetch("http://localhost:5001/api/reminders", {
          credentials: "include",
        });
        const reminderData = await reminderRes.json();
        const now = new Date();

        // Get the start of today (midnight)
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        // Get the end of tomorrow
        const endOfTomorrow = new Date(now);
        endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
        endOfTomorrow.setHours(23, 59, 59, 999);

        const filteredReminders = reminderData
          .filter((reminder) => {
            const dueDate = new Date(reminder.taskId?.dueDate);

            // Include reminders due today and tomorrow
            return dueDate >= startOfToday && dueDate <= endOfTomorrow;
          })
          .sort(
            (a, b) => new Date(a.taskId?.dueDate) - new Date(b.taskId?.dueDate)
          );

        setReminders(filteredReminders);
      } catch (err) {
        console.error("Error fetching reminders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000); // Refresh every 1 minute
    return () => clearInterval(intervalId);
  }, []);

  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const getTimeRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due - now;

    if (diffMs < 0) {
      return "Overdue";
    }

    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHrs}h ${diffMins}m remaining`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>NOTIFICATIONS</h3>
      </div>
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loadingState}>
            <p>Loading notifications...</p>
          </div>
        ) : reminders.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No notifications to display.</p>
          </div>
        ) : (
          <ul className={styles.reminderList}>
            {reminders.map((reminder) => {
              const task = reminder.taskId;
              const taskTitle = task?.title || "Untitled Task";
              const taskDesc = task?.description || "No description provided";
              const dueDate = task?.dueDate || reminder.dueDate;
              const timeRemaining = getTimeRemaining(dueDate);

              return (
                <li key={reminder._id} className={styles.reminderItem}>
                  <div className={styles.reminderDot}></div>
                  <div className={styles.reminderContent}>
                    <h4 className={styles.reminderTitle}>{taskTitle}</h4>
                    <p className={styles.reminderDescription}>{taskDesc}</p>
                    <div className={styles.dueDate}>
                      Due: {formatDueDate(dueDate)}
                      <span className={styles.timeRemaining}>
                        {timeRemaining}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
