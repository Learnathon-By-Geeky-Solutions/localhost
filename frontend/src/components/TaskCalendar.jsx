import React, { useState, useRef, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { Check, Save, Trash, X } from "lucide-react";
import styles from "./taskCalendar.module.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const initialCourses = [
  {
    _id: "1",
    title: "Data Structures",
    description: "Learn fundamental data structures",
    userId: "user1",
  },
  {
    _id: "2",
    title: "Algorithms",
    description: "Master algorithmic problem solving",
    userId: "user1",
  },
];

const initialChapters = [
  {
    _id: "1",
    courseId: "1",
    title: "Arrays and Strings",
    content: "Basic array operations",
  },
  {
    _id: "2",
    courseId: "1",
    title: "Linked Lists",
    content: "Singly and doubly linked lists",
  },
  {
    _id: "3",
    courseId: "2",
    title: "Sorting Algorithms",
    content: "Different sorting techniques",
  },
];

const initialTasks = [
  {
    _id: "1",
    title: "Study DSA",
    description: "Learn about binary trees",
    courseId: "1",
    chapterId: "2",
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000),
    status: "Pending",
    priority: "High",
    user: "user1",
  },
  {
    _id: "2",
    title: "Practice Algorithms",
    description: "Solve sorting problems",
    courseId: "2",
    chapterId: "3",
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000), // 1-hour event    
    status: "Completed",
    priority: "Medium",
    user: "user1",
  },
];

const TaskCalendar = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState(null);
  const [courses] = useState(initialCourses);
  const [chapters] = useState(initialChapters);
  const calendarRef = useRef(null);
  const [warning, setWarning] = useState("");
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

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

  const moveTask = ({ event, start, end }) => {
    if (start >= end) {
      end = new Date(start.getTime() + 60 * 60 * 1000); // Add 1 hour if invalid
    }

    const updatedTasks = tasks.map((task) =>
      task._id === event._id ? { ...task, start, end } : task
    );
    setTasks(updatedTasks);
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
      _id: Date.now().toString(),
      title: "",
      description: "",
      courseId: null,
      chapterId: null,
      start,
      end,
      priority: "Medium",
      status: "Pending",
      user: "user1",
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

  const handleMarkDone = () => {
    setTasks(
      tasks.map((t) =>
        t._id === selectedTask._id ? { ...t, status: "Completed" } : t
      )
    );
    setSelectedTask(null);
  };

  const handleMarkNotDone = () => {
    setTasks(
      tasks.map((t) =>
        t._id === selectedTask._id ? { ...t, status: "Pending" } : t
      )
    );
    setSelectedTask(null);
  };

  const handleDelete = () => {
    setTasks(tasks.filter((t) => t._id !== selectedTask._id));
    setSelectedTask(null);
  };

  const handleUpdateTask = () => {
    if (selectedTask.title.trim()) {
      setTasks(
        tasks.map((t) => (t._id === selectedTask._id ? selectedTask : t))
      );
      setSelectedTask(null);
      setWarning("");
    } else {
      setWarning("Task title cannot be empty!");
    }
  };

  const handleCreateTask = (e) => {
    e.preventDefault();

    if (!newTask?.title?.trim()) {
      setWarning("Please enter a title for the task.");
      return;
    }

    setWarning("");
    setTasks((prev) => [...prev, newTask]);
    setNewTask(null);
  };

  const getChaptersForCourse = (courseId) => {
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
            onClick={isNewTask ? handleCreateTask : handleUpdateTask}
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

  return (
    <div className={styles.container}>
      {selectedTask && renderPopup(selectedTask, false)}
      {newTask && renderPopup(newTask, true)}

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
    </div>
  );
};

export default TaskCalendar;