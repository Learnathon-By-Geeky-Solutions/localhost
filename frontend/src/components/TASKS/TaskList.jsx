import React, { useState, useEffect } from "react";
import { useTaskStore } from "../../store/useTaskStore";
import moment from "moment";
import TaskDetailModal from "./TaskDetailModal";
import styles from "./taskList.module.css";


const TaskList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const { tasks, isFetchingTasks, fetchTasks, changeStatus } = useTaskStore();


  useEffect(() => {
    fetchTasks();
  }, []);


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

  const handleStatusToggle = async (task) => {
    const newStatus = (task.status!=='Completed')?
      "Completed": "Incomplete";
    await changeStatus(task._id,{status:newStatus});
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

        {isFetchingTasks ?
          <div className={styles.noTasks}> fetching tasks... </div>
          : tasks.length === 0 ? (
            <div className={styles.noTasks}>No tasks yet. Create one to get started!</div>
          ) : (
            tasks.map((task) => (
              <button
                type="button"
                key={task._id}
                className={`${styles.taskItem} ${task.status === "Completed" ? styles.completed : ""}`}
                onClick={() => openEditTaskModal(task)}
                aria-label={`Edit task: ${task.title}`}
              >
                <input
                  type="checkbox"
                  checked={task.status === "Completed"}
                  onChange={(e) =>{
                    handleStatusToggle(task, e);
                    // task = {...task, title:"In-Progress"};
                  }}
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

                  {task.startTime && task.endTime && (
                    <div className={styles.taskDates}>
                      <span>{moment(task.startTime).format("MMM D, h:mm A")}</span>
                      <span> - </span>
                      <span>{moment(task.endTime).format("MMM D, h:mm A")}</span>
                    </div>
                  )}

                  {/* {task.courseId && (
                    <div className={styles.taskCourse}>
                      {courses.find(c => c._id === task.courseId)?.title || 'Unknown Course'}
                      {task.chapterId && ` > ${getChaptersForCourse(task.courseId).find(ch => ch._id === task.chapterId)?.title || 'Unknown Chapter'}`}
                    </div>
                  )} */}
                </div>
              </button>
            ))
          )}
      </div>

      {isModalOpen &&
        <TaskDetailModal
          givenTask={selectedTask}
          onClose={closeModal}
        />
      }
    </div>
  );
}



export default TaskList