import React, { useState, useEffect, useRef } from "react";
import styles from "./topbar.module.css";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import NotificationPanel from "./NotificationPanel";

export const Topbar = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [reminderCount, setReminderCount] = useState(0);

  const panelRef = useRef(null);

  const handleNotificatonBtn = () => {
    setShowNotification((prev) => !prev);
  };

  useEffect(() => {
    const fetchRemindersCount = async () => {
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

        const filteredReminders = reminderData.filter((reminder) => {
          const dueDate = new Date(reminder.taskId?.dueDate);
          // Include reminders due today and tomorrow
          return dueDate >= startOfToday && dueDate <= endOfTomorrow;
        });

        setReminderCount(filteredReminders.length);
      } catch (err) {
        console.error("Error fetching reminders count:", err);
      }
    };

    fetchRemindersCount();
    const intervalId = setInterval(fetchRemindersCount, 60000); // Refresh every 1 minute

    return () => clearInterval(intervalId);
  }, []);

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

  return (
    <>
      <div className={styles.container}>
        <button
          className={styles.logo}
          onClick={() => navigate("/dashboard")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate("/dashboard");
            }
          }}
        >
          STUDIFY
        </button>

        <div className={styles.rightSide}>
          <button
            className={styles.notification}
            onClick={handleNotificatonBtn}
          >
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
            {reminderCount > 0 && (
              <span className={styles.badge}>{reminderCount}</span>
            )}
          </button>

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
      {showNotification && (
        <div ref={panelRef}>
          <NotificationPanel onCountUpdate={setReminderCount} />
        </div>
      )}
    </>
  );
};
