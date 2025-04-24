import React, { useEffect, useState } from 'react';
import moment from "moment";
import styles from './taskDetailModal.module.css';
import { Check, Save, Trash, X, Loader } from "lucide-react";
import { useTaskStore } from '../../store/useTaskStore';

const now = new Date();
const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

const newTask = {
  title: "",
  description: "",
  priority: "Low",
  status: "Incomplete",
  startTime: now.toISOString(),
  endTime: oneHourLater.toISOString(),
  courseId: null,
  chapterId: null,
};

const TaskDetailModal = ({ givenTask = null, givenTime = null, popupPosition = null, onClose = () => {} }) => {
  const [task, setTask] = useState(givenTask ? givenTask : newTask);
  const [warning, setWarning] = useState("");

  const { createTask, updateTask, deleteTask } = useTaskStore();

  useEffect(() => {
    if (!givenTask && givenTime) {
      setTask(prev => ({
        ...prev,
        startTime: givenTime.start,
        endTime: givenTime.end,
      }));
    }
  }, [givenTask, givenTime]);

  const handleSave = () => {
    if (!task.title.trim()) {
      setWarning("Title is required!");
      return;
    }

    if (givenTask) {
      // updateTask(task); // editing existing task
    } else {
      createTask({ ...task, _id: crypto.randomUUID() }); // creating new task
    }

    onClose();
  };

  const handleDelete = () => {
    if (givenTask?._id) {
      deleteTask(givenTask._id);
    }
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div
        className={styles.container}
        style={popupPosition && {
          position: 'absolute',
          left: `${popupPosition.x}px`,
          top: `${popupPosition.y}px`,
        }}
      >
        <div className={styles.header}>
          <input
            className={styles.titleInput}
            value={task.title}
            onChange={(e) => {
              setTask({ ...task, title: e.target.value });
              setWarning("");
            }}
            placeholder="Task title"
          />
        </div>

        {warning && (
          <p style={{ color: "red", marginBottom: "10px" }}>{warning}</p>
        )}

        <div className={styles.popupTime}>
          <div className={styles.timeLabel}>Start:</div>
          <input
            type="datetime-local"
            value={moment(task.startTime).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) =>
              setTask({ ...task, startTime: new Date(e.target.value).toISOString() })
            }
            className={styles.dateTimeInput}
          />
          <div className={styles.timeLabel}>Due:</div>
          <input
            type="datetime-local"
            value={moment(task.endTime).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) =>
              setTask({ ...task, endTime: new Date(e.target.value).toISOString() })
            }
            className={styles.dateTimeInput}
          />
        </div>

        <textarea
          className={styles.descriptionInput}
          value={task.description || ""}
          onChange={(e) =>
            setTask({ ...task, description: e.target.value })
          }
          placeholder="Add description"
        />

        {/* Course / Chapter selection logic can be added later if needed */}

        <div className={styles.popUpPriority}>
          <div
            className={styles.statusDot}
            style={{
              backgroundColor:
                task.priority === "High"
                  ? "#f44336"
                  : task.priority === "Medium"
                    ? "#4285f4"
                    : "#ff9800",
            }}
          />
          <select
            className={styles.courseSelect}
            value={task.priority || "Medium"}
            onChange={(e) =>
              setTask({ ...task, priority: e.target.value })
            }
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
        </div>

        <div className={styles.popupActions}>
          <select
            className={styles.actionButton}
            value={task.status}
            onChange={(e) => {
              const newStatus = e.target.value;
              setTask({ ...task, status: newStatus });
            }}
          >
            <option value="Incomplete">Incomplete</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          <button className={styles.actionButton} onClick={handleSave}>
            <Save size={16} />
            <span>Save</span>
          </button>

          {givenTask && (
            <button className={styles.actionButton} onClick={handleDelete}>
              <Trash size={16} />
              <span>Delete</span>
            </button>
          )}

          <button
            className={`${styles.actionButton} ${styles.closeButton}`}
            onClick={() => {
              onClose();
              setWarning("");
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
