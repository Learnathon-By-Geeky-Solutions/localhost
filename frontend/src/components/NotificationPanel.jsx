import React, { useEffect, useState } from "react";
import styles from "./notificationPanel.module.css";
import { axiosInstance } from "../lib/axios";

const NotificationPanel = ({
  onNotificationsViewed,
  fetchNewNotifications,
  viewedIds,
  onPanelClose,
}) => {
  const [newReminders, setNewReminders] = useState([]);
  const [olderReminders, setOlderReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track IDs of notifications that were new when panel was opened
  const [initialNewNotificationIds, setInitialNewNotificationIds] = useState(
    []
  );

  // Flag to track first load
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

        // Split reminders into new and older based on viewedIds
        const newRemindersArray = dueReminders.filter(
          (reminder) => !viewedIds.has(reminder._id)
        );

        const olderRemindersArray = dueReminders.filter((reminder) =>
          viewedIds.has(reminder._id)
        );

        // Sort both arrays by notification time - NEW at TOP (newest first)
        const sortedNewReminders = newRemindersArray.sort((a, b) => {
          const dateA = new Date(a.notificationTime);
          const dateB = new Date(b.notificationTime);
          return dateB - dateA; // Newest first for new notifications
        });

        // Sort older reminders with oldest at bottom
        const sortedOlderReminders = olderRemindersArray.sort((a, b) => {
          const dateA = new Date(a.notificationTime);
          const dateB = new Date(b.notificationTime);
          return dateB - dateA; // Newest first for older notifications too
        });

        setNewReminders(sortedNewReminders);
        setOlderReminders(sortedOlderReminders);

        // Only capture the initial new notifications once when the component first loads
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

    // Set up periodic refresh of the panel contents
    const refreshInterval = setInterval(fetchReminders, 5000); // Check every 5 seconds

    return () => clearInterval(refreshInterval);
  }, [viewedIds, isFirstLoad]);

  // Only when the component unmounts (panel closes), pass the notification IDs to parent
  useEffect(() => {
    return () => {
      // Only run if we have IDs and they haven't been processed yet
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
          {/* New notifications section */}
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

          {/* Older notifications section */}
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

export default NotificationPanel;
