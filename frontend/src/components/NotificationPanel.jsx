import React, { useEffect, useState } from "react";
import PropTypes from "prop-types"; // <-- Import PropTypes
import styles from "./notificationPanel.module.css";
import { axiosInstance } from "../lib/axios";

const NotificationPanel = ({ viewedIds, onPanelClose }) => {
  const [newReminders, setNewReminders] = useState([]);
  const [olderReminders, setOlderReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialNewNotificationIds, setInitialNewNotificationIds] = useState(
    []
  );
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await axiosInstance.get("/reminders");

        const now = new Date();
        const dueReminders = response.data.filter((reminder) => {
          const notificationTime = new Date(reminder.notificationTime);
          return notificationTime <= now && !reminder.notificationSent;
        });

        const newRemindersArray = dueReminders.filter(
          (reminder) => !viewedIds.has(reminder._id)
        );
        const olderRemindersArray = dueReminders.filter((reminder) =>
          viewedIds.has(reminder._id)
        );

        const sortedNewReminders = newRemindersArray.sort((a, b) => {
          const dateA = new Date(a.notificationTime);
          const dateB = new Date(b.notificationTime);
          return dateB - dateA;
        });

        const sortedOlderReminders = olderRemindersArray.sort((a, b) => {
          const dateA = new Date(a.notificationTime);
          const dateB = new Date(b.notificationTime);
          return dateB - dateA;
        });

        setNewReminders(sortedNewReminders);
        setOlderReminders(sortedOlderReminders);

        if (isFirstLoad && sortedNewReminders.length > 0) {
          const newIds = sortedNewReminders.map((reminder) => reminder._id);
          setInitialNewNotificationIds(newIds);
          setIsFirstLoad(false);
        }
      } catch (error) {
        console.error("Failed to fetch reminders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
    const refreshInterval = setInterval(fetchReminders, 5000);

    return () => clearInterval(refreshInterval);
  }, [viewedIds, isFirstLoad]);

  useEffect(() => {
    return () => {
      if (initialNewNotificationIds.length > 0) {
        onPanelClose(initialNewNotificationIds);
      }
    };
  }, [initialNewNotificationIds, onPanelClose]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h3>NOTIFICATIONS</h3>
        <div className={styles.loadingDots}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3>NOTIFICATIONS</h3>
      {newReminders.length === 0 && olderReminders.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <>
          {newReminders.length > 0 && (
            <div className={styles.notificationSection}>
              <h4 className={styles.sectionHeader}>New</h4>
              <ul>
                {newReminders.map((reminder) => (
                  <li key={reminder._id} className={styles.newNotification}>
                    <div className={styles.taskTitle}>
                      {reminder.taskId?.title || "Unknown Task"}
                    </div>
                    <div className={styles.timestamp}>
                      Starts: {formatTime(reminder.taskId?.startTime)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {olderReminders.length > 0 && (
            <div className={styles.notificationSection}>
              <h4 className={styles.sectionHeader}>Earlier</h4>
              <ul>
                {olderReminders.map((reminder) => (
                  <li key={reminder._id}>
                    <div className={styles.taskTitle}>
                      {reminder.taskId?.title || "Unknown Task"}
                    </div>
                    <div className={styles.timestamp}>
                      Starts: {formatTime(reminder.taskId?.startTime)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ✅ Properly added PropTypes validation
NotificationPanel.propTypes = {
  onNotificationsViewed: PropTypes.func.isRequired,
  fetchNewNotifications: PropTypes.func.isRequired,
  viewedIds: PropTypes.instanceOf(Set).isRequired, // viewedIds is a Set
  onPanelClose: PropTypes.func.isRequired,
};

export default NotificationPanel;
