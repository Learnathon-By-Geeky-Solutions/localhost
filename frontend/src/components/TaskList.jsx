import React from 'react'
import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import moment from "moment";
import TaskDetailModal from "./TaskDetailModal";
import styles from "./taskList.module.css";


const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axiosInstance.get("/tasks", );
        
        if (res.status === 200) {
          console.log(res.data);
          setTasks(res.data);
        } else {
          console.error("Failed to fetch tasks:", res.status);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get("/courses");
        if (res.status === 200) {
          setCourses(res.data);
        } else {
          console.error("Failed to fetch courses:", res.status);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchTasks();
    fetchCourses();
  }, []);


  const handleStatusToggle = async (taskId, e) => {
    try {
      e.stopPropagation(); // Prevent modal from opening

      // Find the task to update
      const task = tasks.find((t) => t._id === taskId);
      if (!task) {
        console.error("Task not found");
        return;
      }

      // Prepare updated task object
      const newStatus = task.status === "Completed" ? "Incomplete" : "Completed";
      const updatedTask = { ...task, status: newStatus };

      // Update task on the server
      const res = await axiosInstance.put(`/tasks/${taskId}`, updatedTask);
      if (res.status !== 200) {
        console.error("Failed to update task:", res);
        return;
      }

      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === taskId ? updatedTask : t))
      );

    } catch (error) {
      console.error("Error toggling task status:", error.message);
    }
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
    try {
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
    } catch (error) {
      console.error("Failed to save task:", error);
      // Consider adding error state and user feedback
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.taskList}>
        <div className={styles.taskHeader}>
          <h2>Tasks</h2>
          <button type='button' className={styles.addTaskButton} onClick={openNewTaskModal}>
            Add Task
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className={styles.noTasks}>No tasks yet. Create one to get started!</div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className={`${styles.taskItem} ${task.status === "Completed" ? styles.completed : ""}`}
              onClick={() => openEditTaskModal(task)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  openEditTaskModal(task);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Edit task: ${task.title}`}
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
                    {courses.find(c => c._id === task.courseId)?.title || 'Unknown Course'}
                    {task.chapterId && ` > ${getChaptersForCourse(task.courseId).find(ch => ch._id === task.chapterId)?.title}`}
                    {task.chapterId && ` > ${getChaptersForCourse(task.courseId).find(ch => ch._id === task.chapterId)?.title || 'Unknown Chapter'}`}
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



export default TaskList