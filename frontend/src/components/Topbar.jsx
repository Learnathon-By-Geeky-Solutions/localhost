import React, { useState, useRef, useEffect } from "react";
import styles from "./topbar.module.css";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import NotificationPanel from "./NotificationPanel";
import { axiosInstance } from "../lib/axios";

export const Topbar = () => {
  const { user } = useAuthStore();
  const useNav = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [viewedNotificationIds, setViewedNotificationIds] = useState(() => {
    // Load viewed notification IDs from localStorage
    const saved = localStorage.getItem("viewedNotificationIds");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const panelRef = useRef(null); // <-- for detecting outside clicks

  // Flag to track if we already handled notifications in this session
  const processedIdsRef = useRef(new Set());

  const handleNotificationBtn = () => {
    setShowNotification((prev) => !prev);
  };

  // This function is now only called when the panel closes
  const handlePanelClose = (notificationIds) => {
    if (!notificationIds || notificationIds.length === 0) return;

    // Filter out IDs we've already processed
    const newIds = notificationIds.filter(
      (id) => !processedIdsRef.current.has(id)
    );
    if (newIds.length === 0) return;

    // Mark these IDs as processed for this session
    newIds.forEach((id) => processedIdsRef.current.add(id));

    // Add to viewedIds
    const updatedViewedIds = new Set([...viewedNotificationIds, ...newIds]);
    setViewedNotificationIds(updatedViewedIds);

    // Store in localStorage
    localStorage.setItem(
      "viewedNotificationIds",
      JSON.stringify([...updatedViewedIds])
    );

    // Reset notification count
    fetchUnreadNotifications();
  };

  const fetchUnreadNotifications = async () => {
    try {
      const response = await axiosInstance.get("/reminders");

      const now = new Date();
      const dueReminders = response.data.filter((reminder) => {
        const notificationTime = new Date(reminder.notificationTime);

        // Only include notifications that are:
        // 1. Due (notification time is in the past)
        // 2. Not marked as sent
        // 3. Not in our viewedNotificationIds set
        return (
          notificationTime <= now &&
          !reminder.notificationSent &&
          !viewedNotificationIds.has(reminder._id)
        );
      });

      // Update the notification count
      setNotificationCount(dueReminders.length);
      return dueReminders;
    } catch (error) {
      console.error("Failed to fetch notifications count:", error);
      return [];
    }
  };

  // Run when viewedNotificationIds changes or component mounts
  useEffect(() => {
    fetchUnreadNotifications();

    // Fetch notifications regularly
    const countInterval = setInterval(fetchUnreadNotifications, 5000);

    return () => clearInterval(countInterval);
  }, [viewedNotificationIds]);

  // Handle closing the panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowNotification(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset the processed IDs when the component mounts
  useEffect(() => {
    processedIdsRef.current = new Set();

    // Reset again when component unmounts
    return () => {
      processedIdsRef.current = new Set();
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.logo} onClick={() => useNav("/dashboard")}>
        STUDIFY
      </div>
      <div className={styles.rightSide}>
        {/* Wrap notification in a container */}
        <div className={styles.notificationContainer}>
          <div className={styles.notification} onClick={handleNotificationBtn}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
                clipRule="evenodd"
              />
            </svg>
            {notificationCount > 0 && (
              <span className={styles.notificationBadge}>
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </div>
          {/* Panel rendering logic */}
          {showNotification && (
            <div ref={panelRef}>
              <NotificationPanel
                fetchNewNotifications={fetchUnreadNotifications}
                viewedIds={viewedNotificationIds}
                onPanelClose={handlePanelClose}
              />
            </div>
          )}
        </div>
        <div className={styles.profile}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className={styles.name}>{user.fullName.toUpperCase()}</div>
      </div>
    </div>
  );
};
