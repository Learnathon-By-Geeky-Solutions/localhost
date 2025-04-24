import React, { useEffect, useState } from 'react'
import moment from "moment";
import styles from './taskDetailModal.module.css'
import { Check, Save, Trash, X, Loader } from "lucide-react";


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


const TaskDetailModal = (givenTask = null, givenTime = null) => {
  
  const [task, setTask] = useState(givenTask ? givenTask : newTask);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    if (!givenTask && givenTime) {
      setTask(prev => ({
        ...prev,
        startTime: givenTime.start,
        endTime: givenTime.end,
      }));
    }
  }, [givenTask, givenTime]);


  const popupPosition = { x: 100, y: 100 };

  return (
    <div className={styles.modalOverlay}>

      <div
        className={styles.container}
        style={{
          left: `${popupPosition.x}px`,
          top: `${popupPosition.y}px`,
        }}
      >
        <div className={styles.header}>
          <input
            className={styles.titleInput}
            // value={task.title}
            // onChange={(e) => {
            //   setTask({ ...task, title: e.target.value });
            //   setWarning("");
            // }}
            placeholder={(!task) ? "Add title" : "Task title"}
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
              setTask({
                ...task,
                startTime: new Date(e.target.value),
              })
            }
            className={styles.dateTimeInput}
          />
          <div className={styles.timeLabel}>Due:</div>
          <input
            type="datetime-local"
            value={moment(task.endTime).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) =>
              setTask({
                ...task,
                endTime: new Date(e.target.value),
              })
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
        <div className={styles.courseSection}>
          <select
            className={styles.courseSelect}
            value={task.courseId || ""}
            onChange={(e) =>
              setTask({
                ...task,
                courseId: e.target.value || null,
                chapterId: null,
              })
            }
          >
            <option value="">Select Course (Optional)</option>
            {/* {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))} */}
          </select>
          {task.courseId && (
            <select
              className={styles.courseSelect}
            // value={task.chapterId || ""}
            // onChange={(e) =>
            //   setTask({
            //     ...task,
            //     chapterId: e.target.value || null,
            //   })
            // }
            >
              <option value="">Select Chapter (Optional)</option>
              {/* {getChaptersForCourse(task.courseId).map((chapter) => (
                <option key={chapter._id} value={chapter._id}>
                  {chapter.title}
                </option>
              ))} */}
            </select>
          )}
        </div>

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
          // value={task.priority || "Medium"}
          // onChange={(e) =>
          //   setTask({ ...task, priority: e.target.value })
          // }
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
        </div>

        <div className={styles.popupActions}>
          {!(!task) && (
            task.status === "Completed" ? (
              <button
                className={styles.actionButton}
              // onClick={handleMarkNotDone}
              >
                <X size={16} />
                <span>Not Done</span>
              </button>
            ) : (
              <button
                className={styles.actionButton}
              // onClick={handleMarkDone}
              >
                <Check size={16} />
                <span>Done</span>
              </button>
            )
          )}
          <button
            className={styles.actionButton}
          // onClick={handleAction}
          >
            <Save size={16} />
            <span>Save</span>
          </button>
          {!(!task) && (
            <button
              className={styles.actionButton}
            // onClick={handleDelete}
            >
              <Trash size={16} />
              <span>Delete</span>
            </button>
          )}
          <button
            className={`${styles.actionButton} ${styles.closeButton}`}
            onClick={() => {
              // closePopup();
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