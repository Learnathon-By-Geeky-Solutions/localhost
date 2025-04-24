import React, { useState, useRef, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { Check, Save, Trash, X, Loader } from "lucide-react";
import styles from "./taskCalendar.module.css";
import { axiosInstance } from "../lib/axios";
import ErrorBanner from "./ErrorBanner.jsx"; // Import the new component

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const TaskCalendar = () => {
  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState(null);
  const calendarRef = useRef(null);
  const [warning, setWarning] = useState("");
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all required data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError("");
      
      try {
        // Fetch tasks first
        const tasksResponse = await axiosInstance.get("/tasks");
        
        // Transform task data to match calendar format
        const transformedTasks = tasksResponse.data.map(task => ({
          ...task,
          start: new Date(task.startTime || Date.now()),
          end: new Date(task.endTime || Date.now() + 3600000), // Add 1 hour as default
        }));
        
        setTasks(transformedTasks);
        try {
          const coursesResponse = await axiosInstance.get("/courses");
          const courses = coursesResponse.data;
          setCourses(courses);
        
          if (courses.length > 0) {
            const courseId = courses[0]._id; // or whichever course you want
            const chapterResponse = await axiosInstance.get(`/chapters/all/${courseId}`);
            setChapters(chapterResponse.data);
          } else {
            setChapters([]);
          }
        } catch (err) {
          console.warn("Error fetching courses or chapters:", err);
          setCourses([]);
          setChapters([]);
        }
        
        
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, []);

  useEffect(() => {
    const cleanupDragMarks = () => {
      const dragBgElements = document.querySelectorAll(".rbc-drag-bg, .rbc-addons-dnd-drag-row");
      dragBgElements.forEach((el) => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });

      const slotElements = document.querySelectorAll(".rbc-day-slot");
      slotElements.forEach((el) => {
        el.style.position = "";
        el.style.zIndex = "";
      });
    };

    cleanupDragMarks();
    return cleanupDragMarks;
  }, [tasks]);

  const moveTask = async ({ event, start, end }) => {
    if (start >= end) {
      end = new Date(start.getTime() + 60 * 60 * 1000); // Add 1 hour if invalid
    }

    try {
      // Update frontend state optimistically
      const updatedTasks = tasks.map((task) =>
        task._id === event._id ? { ...task, start, end } : task
      );
      setTasks(updatedTasks);

      // Prepare task data for API
      const taskToUpdate = tasks.find(task => task._id === event._id);
      if (!taskToUpdate) return;

      // Send update to API
      await axiosInstance.put(`/tasks/${event._id}`, {
        startTime: start,
        endTime: end
      });
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task. Please try again.");
      
      // Revert to original state if API call fails
      fetchTasks();
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/tasks");
      const transformedTasks = response.data.map(task => ({
        ...task,
        start: new Date(task.startTime || Date.now()),
        end: new Date(task.endTime || Date.now() + 3600000)
      }));
      setTasks(transformedTasks);
      setError("");
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to refresh tasks.");
    } finally {
      setLoading(false);
    }
  };

  const calculateSafePosition = (x, y) => {
    if (!calendarRef.current) return { x: 0, y: 0 };

    const calendarRect = calendarRef.current.getBoundingClientRect();
    const W = calendarRect.width;
    const H = calendarRect.height;

    let safeX = 10;
    if (x < W / 2) {
      safeX = x + 10;
    }
    else {
      safeX = x - W / 2;
    }
    let safeY = H / 4;

    return { x: safeX, y: safeY };
  };

  const handleSelectSlot = ({ start, end, box }) => {
    // Use the box coordinates (if available) or default to the calendar's position
    const x = box ? box.x : 0;
    const y = box ? box.y : 0;

    // Calculate safe position
    const safePosition = calculateSafePosition(x, y);
    setPopupPosition(safePosition);

    const newTask = {
      title: "",
      description: "",
      courseId: null,
      chapterId: null,
      start,
      end,
      priority: "Medium",
      status: "Pending",
    };
    setNewTask(newTask);
  };

  const handleSelectEvent = (event, e) => {
    // Use the click event coordinates
    if (e && e.pageX && e.pageY) {
      const safePosition = calculateSafePosition(e.pageX, e.pageY);
      setPopupPosition(safePosition);
    }
    setSelectedTask(event);
  };

  const handleMarkDone = async () => {
    try {
      // Optimistic update
      setTasks(
        tasks.map((t) =>
          t._id === selectedTask._id ? { ...t, status: "Completed" } : t
        )
      );
      
      // API update
      await axiosInstance.put(`/tasks/${selectedTask._id}`, {
        status: "Completed"
      });
      
      setSelectedTask(null);
    } catch (err) {
      console.error("Error updating task status:", err);
      setError("Failed to update task status.");
      fetchTasks(); // Revert on failure
    }
  };

  const handleMarkNotDone = async () => {
    try {
      // Optimistic update
      setTasks(
        tasks.map((t) =>
          t._id === selectedTask._id ? { ...t, status: "Pending" } : t
        )
      );
      
      // API update
      await axiosInstance.put(`/tasks/${selectedTask._id}`, {
        status: "Pending"
      });
      
      setSelectedTask(null);
    } catch (err) {
      console.error("Error updating task status:", err);
      setError("Failed to update task status.");
      fetchTasks(); // Revert on failure
    }
  };

  const handleDelete = async () => {
    try {
      // Optimistic delete
      setTasks(tasks.filter((t) => t._id !== selectedTask._id));
      
      // API delete
      await axiosInstance.delete(`/tasks/${selectedTask._id}`);
      
      setSelectedTask(null);
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task.");
      fetchTasks(); // Revert on failure
    }
  };

  const handleUpdateTask = async () => {
    if (!selectedTask.title.trim()) {
      setWarning("Task title cannot be empty!");
      return;
    }

    try {
      // Prepare the data for API
      const taskData = {
        title: selectedTask.title,
        description: selectedTask.description,
        startTime: selectedTask.start,
        endTime: selectedTask.end,
        priority: selectedTask.priority,
        status: selectedTask.status,
        courseId: selectedTask.courseId || null,
        chapterId: selectedTask.chapterId || null
      };
      
      // Optimistic update
      setTasks(
        tasks.map((t) => (t._id === selectedTask._id ? selectedTask : t))
      );
      
      // API update
      await axiosInstance.put(`/tasks/${selectedTask._id}`, taskData);
      
      setSelectedTask(null);
      setWarning("");
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task.");
      fetchTasks(); // Revert on failure
    }
  };

  const handleCreateTask = async (e) => {
    if (e) e.preventDefault();

    if (!newTask?.title?.trim()) {
      setWarning("Please enter a title for the task.");
      return;
    }

    try {
      // Prepare the data for API
      const taskData = {
        title: newTask.title,
        description: newTask.description || "",
        startTime: newTask.start,
        endTime: newTask.end,
        priority: newTask.priority || "Medium",
        status: newTask.status || "Pending",
        courseId: newTask.courseId || null,
        chapterId: newTask.chapterId || null
      };
      
      // API create
      const response = await axiosInstance.post("/tasks", taskData);
      
      // Add the new task with API-generated ID to state
      const createdTask = {
        ...response.data,
        start: new Date(response.data.startTime),
        end: new Date(response.data.endTime)
      };
      
      setTasks(prev => [...prev, createdTask]);
      setNewTask(null);
      setWarning("");
    } catch (err) {
      console.error("Error creating task:", err);
      setError("Failed to create task.");
    }
  };

  const getChaptersForCourse = (courseId) => {
    if (!courseId) return [];
    return chapters.filter((chapter) => chapter.courseId === courseId);
  };

  // Render the popup with dynamic positioning
  const renderPopup = (taskData, isNewTask = false) => {
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

  const renderSimpleCalendar = () => {
    return (
      <div ref={calendarRef} className={styles.calendar}>
        <DnDCalendar
          localizer={localizer}
          events={tasks}
          startAccessor="start"
          endAccessor="end"
          selectable
          resizable
          defaultView={Views.MONTH}
          views={["month", "week", "day"]}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          onEventDrop={moveTask}
          onEventResize={moveTask}
          draggableAccessor={() => true}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor:
                event.status === "Completed"
                  ? "#4caf50"
                  : event.priority === "High"
                    ? "#f44336"
                    : event.priority === "Medium"
                      ? "#4285f4"
                      : "#ff9800",
              color: "#fff",
              width: "95%",
              opacity: event.status === "Completed" ? 0.9 : 1,
              cursor: "pointer",
            },
          })}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size={32} className={styles.spinner} />
        <p>Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ErrorBanner 
        error={error}
        onRetry={() => {
          setError("");
          fetchTasks();
        }}
      />

      {selectedTask && renderPopup(selectedTask, false)}
      {newTask && renderPopup(newTask, true)}

      {renderSimpleCalendar()}
    </div>
  );
};

export default TaskCalendar;