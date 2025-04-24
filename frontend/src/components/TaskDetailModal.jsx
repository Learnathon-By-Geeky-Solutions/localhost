import React from "react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Check, X, Save, Trash } from "lucide-react";
import styles from "./taskDetailModal.module.css";



const PRIORITY_COLORS = {
    High: "#f44336",
    Medium: "#4285f4",
    Low: "#ff9800"
};

const getInitialTaskState = (taskObj = null) => ({
    title: "",
    description: "",
    priority: "Medium",
    status: "Incomplete",
    start: new Date(),
    end: new Date(Date.now() + 24 * 60 * 60 * 1000),
    courseId: null,
    chapterId: null,
    ...(taskObj || {})
});
const TaskDetailModal = ({
    isOpen,
    closeModal,
    task = null,
    onSave,
    courses = [],
    getChaptersForCourse = () => []
}) => {

    const isNewTask = !task?._id;
    const [warning, setWarning] = useState("");
    const [taskData, setTaskData] = useState(() => getInitialTaskState(task));


    useEffect(() => {
        // Reset form when task changes
        setTaskData({
            title: "",
            description: "",
            priority: "Medium",
            status: "Incomplete",
            start: new Date(),
            end: new Date(Date.now() + 24 * 60 * 60 * 1000),
            courseId: null,
            chapterId: null,
            ...(task || {})
        });
        setWarning("");
    }, [task, isOpen]);

    const handleMarkDone = () => {
        setTaskData({ ...taskData, status: "Completed" });
    };

    const handleMarkNotDone = () => {
        setTaskData({ ...taskData, status: "Incomplete" });
    };

    const handleSaveTask = () => {
        if (!taskData.title.trim()) {
            setWarning("Title is required");
            return;
        }

        onSave(taskData);
        closeModal();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
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
                    <p className={styles.warningText}>{warning}</p>
                )}

                <div className={styles.popupTime}>
                    <div className={styles.timeLabel}>Start:</div>
                    <input
                        type="datetime-local"
                        value={format(new Date(taskData.start), "yyyy-MM-dd'T'HH:mm")}
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
                        value={format(new Date(taskData.end), "yyyy-MM-dd'T'HH:mm")}
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
                    value={taskData.description}
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

                <div className={styles.popupPriority}>
                    <div
                        className={styles.statusDot}
                        style={{
                            backgroundColor: PRIORITY_COLORS[taskData.priority] || PRIORITY_COLORS.Medium
                        }}
                    />
                    <select
                        className={styles.courseSelect}
                        value={taskData.priority}
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
                                type="button"
                                onClick={handleMarkNotDone}
                            >
                                <X size={16} />
                                <span>Not Done</span>
                            </button>
                        ) : (
                            <button
                                className={styles.actionButton}
                                type="button"
                                onClick={handleMarkDone}
                            >
                                <Check size={16} />
                                <span>Done</span>
                            </button>
                        )
                    )}

                    <button
                        className={styles.actionButton}
                        type="button"
                        onClick={handleSaveTask}
                    >
                        <Save size={16} />
                        <span>Save</span>
                    </button>

                    {!isNewTask && (
                        <button
                            className={styles.actionButton}
                            type="button"
                            onClick={() => onSave({ ...taskData, _delete: true })}
                        >
                            <Trash size={16} />
                            <span>Delete</span>
                        </button>
                    )}

                    <button
                        className={`${styles.actionButton} ${styles.closeButton}`}
                        type="button"
                        onClick={() => {
                            closeModal();
                            setWarning("");
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TaskDetailModal;