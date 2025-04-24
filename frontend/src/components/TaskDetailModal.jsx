 const TaskDetailModal = (taskData, isNewTask = false,handleUpdateTask) => {
    const handleAction = isNewTask ? handleCreateTask : handleUpdateTask;
    const setTaskData = isNewTask ? setNewTask : setSelectedTask;
    const closePopup = () => isNewTask ? setNewTask(null) : setSelectedTask(null);

    return (
      <div
        className={styles.taskPopup}
        style={{
          left: `${popupPosition.x}px`,
          top: `${popupPosition.y}px`,
        }}
      >
        <div className={styles.popupHeader}>
          <input
            className={styles.popupTitleInput}
            value={taskData.title}
            onChange={(e) => {
              setTaskData({ ...taskData, title: e.target.value });
              setWarning("");
            }}
            placeholder={isNewTask ? "Add title" : "Task title"}
          />
        </div>
        {warning && (
          <p style={{ color: "red", marginBottom: "10px" }}>{warning}</p>
        )}
        <div className={styles.popupTime}>
          <div className={styles.timeLabel}>Start:</div>
          <input
            type="datetime-local"
            value={moment(taskData.start).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) =>
              setTaskData({
                ...taskData,
                start: new Date(e.target.value),
              })
            }
            className={styles.dateTimeInput}
          />
          <div className={styles.timeLabel}>Due:</div>
          <input
            type="datetime-local"
            value={moment(taskData.end).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) =>
              setTaskData({
                ...taskData,
                end: new Date(e.target.value),
              })
            }
            className={styles.dateTimeInput}
          />
        </div>
        <textarea
          className={styles.descriptionInput}
          value={taskData.description || ""}
          onChange={(e) =>
            setTaskData({ ...taskData, description: e.target.value })
          }
          placeholder="Add description"
        />
        <div className={styles.courseSection}>
          <select
            className={styles.courseSelect}
            value={taskData.courseId || ""}
            onChange={(e) =>
              setTaskData({
                ...taskData,
                courseId: e.target.value || null,
                chapterId: null,
              })
            }
          >
            <option value="">Select Course (Optional)</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
          {taskData.courseId && (
            <select
              className={styles.courseSelect}
              value={taskData.chapterId || ""}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  chapterId: e.target.value || null,
                })
              }
            >
              <option value="">Select Chapter (Optional)</option>
              {getChaptersForCourse(taskData.courseId).map((chapter) => (
                <option key={chapter._id} value={chapter._id}>
                  {chapter.title}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className={styles.popUpPriority}>
          <div
            className={styles.statusDot}
            style={{
              backgroundColor:
                taskData.priority === "High"
                  ? "#f44336"
                  : taskData.priority === "Medium"
                    ? "#4285f4"
                    : "#ff9800",
            }}
          />
          <select
            className={styles.courseSelect}
            value={taskData.priority || "Medium"}
            onChange={(e) =>
              setTaskData({ ...taskData, priority: e.target.value })
            }
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
        </div>

        <div className={styles.popupActions}>
          {!isNewTask && (
            taskData.status === "Completed" ? (
              <button
                className={styles.actionButton}
                onClick={handleMarkNotDone}
              >
                <X size={16} />
                <span>Not Done</span>
              </button>
            ) : (
              <button
                className={styles.actionButton}
                onClick={handleMarkDone}
              >
                <Check size={16} />
                <span>Done</span>
              </button>
            )
          )}
          <button
            className={styles.actionButton}
            onClick={handleAction}
          >
            <Save size={16} />
            <span>Save</span>
          </button>
          {!isNewTask && (
            <button
              className={styles.actionButton}
              onClick={handleDelete}
            >
              <Trash size={16} />
              <span>Delete</span>
            </button>
          )}
          <button
            className={`${styles.actionButton} ${styles.closeButton}`}
            onClick={() => {
              closePopup();
              setWarning("");
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  };

  export default TaskDetailModal;