import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import moment from "moment";
import TaskDetailModal from "./TaskDetailModal";
import styles from "./taskList.module.css";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Fetch tasks
    axiosInstance.get("/tasks").then((res) => setTasks(res.data));

    // Fetch courses for the dropdown
    axiosInstance.get("/courses").then((res) => setCourses(res.data));
  }, []);

  const handleStatusToggle = async (taskId, e) => {
    e.stopPropagation(); // Prevent opening modal
    const task = tasks.find((t) => t._id === taskId);
    const updated = { ...task, status: task.status === "Completed" ? "Incomplete" : "Completed" };

    await axiosInstance.put(`/tasks/${taskId}`, updated);
    setTasks(tasks.map((t) => (t._id === taskId ? updated : t)));
  };

  const openNewTaskModal = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const getChaptersForCourse = (courseId) => {
    const course = courses.find(c => c._id === courseId);
    return course?.chapters || [];
  };

  const handleSaveTask = async (taskData) => {
    // Handle delete
    if (taskData._delete) {
      await axiosInstance.delete(`/tasks/${taskData._id}`);
      setTasks(tasks.filter(t => t._id !== taskData._id));
      return;
    }

    // Create new task
    if (!taskData._id) {
      const res = await axiosInstance.post("/tasks", taskData);
      setTasks([...tasks, res.data]);
    }
    // Update existing task
    else {
      await axiosInstance.put(`/tasks/${taskData._id}`, taskData);
      setTasks(tasks.map((t) => (t._id === taskData._id ? taskData : t)));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.taskList}>
        <div className={styles.taskHeader}>
          <h2>Tasks</h2>
          <button className={styles.addTaskButton} onClick={openNewTaskModal}>
            Add Task
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className={styles.noTasks}>No tasks yet. Create one to get started!</div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className={`taskItem ${task.status === "Completed" ? "completed" : ""}`}
              onClick={() => openEditTaskModal(task)}
            >
              <input
                type="checkbox"
                checked={task.status === "Completed"}
                onChange={(e) => handleStatusToggle(task._id, e)}
                onClick={(e) => e.stopPropagation()}
              />

              <div className={styles.taskContent}>
                <div className={styles.taskTitleRow}>
                  <h4>{task.title}</h4>
                  <div
                    className={styles.priorityIndicator}
                    style={{
                      backgroundColor:
                        task.priority === "High"
                          ? "#f44336"
                          : task.priority === "Medium"
                            ? "#4285f4"
                            : "#ff9800",
                    }}
                  />
                </div>

                <p className={styles.taskDescription}>{task.description}</p>

                {task.start && task.end && (
                  <div className={styles.taskDates}>
                    <span>{moment(task.start).format("MMM D, h:mm A")}</span>
                    <span> - </span>
                    <span>{moment(task.end).format("MMM D, h:mm A")}</span>
                  </div>
                )}

                {task.courseId && (
                  <div className={styles.taskCourse}>
                    {courses.find(c => c._id === task.courseId)?.title}
                    {task.chapterId && ` > ${getChaptersForCourse(task.courseId).find(ch => ch._id === task.chapterId)?.title}`}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <TaskDetailModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        task={selectedTask}
        onSave={handleSaveTask}
        courses={courses}
        getChaptersForCourse={getChaptersForCourse}
      />
    </div>
  );
}