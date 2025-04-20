
// export default TaskCalendar;
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
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
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
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [currentDrag, setCurrentDrag] = useState(null);
  const calendarRef = useRef(null);
  const [warning, setWarning] = useState("");

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
    const updatedTasks = tasks.map((task) =>
      task._id === event._id ? { ...task, start, end } : task
    );
    setTasks(updatedTasks);
  };

  const handleSelectSlot = ({ start, end }) => {
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

  const handleSelectEvent = (event) => {
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

  return (
    <div className={styles.calendarWrapper}>
      {selectedTask && (
        <div className={styles.taskPopup}>
          <div className={styles.popupHeader}>
            <span
              className={styles.statusDot}
              style={{
                backgroundColor:
                  selectedTask.priority === "High"
                    ? "#f44336"
                    : selectedTask.priority === "Medium"
                    ? "#4285f4"
                    : "#ff9800",
              }}
            />
            <input
              className={styles.popupTitleInput}
              value={selectedTask.title}
              onChange={(e) => {
                setSelectedTask({ ...selectedTask, title: e.target.value });
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
              value={moment(selectedTask.start).format("YYYY-MM-DDTHH:mm")}
              onChange={(e) =>
                setSelectedTask({
                  ...selectedTask,
                  start: new Date(e.target.value),
                })
              }
              className={styles.dateTimeInput}
            />
            <div className={styles.timeLabel}>Due:</div>
            <input
              type="datetime-local"
              value={moment(selectedTask.end).format("YYYY-MM-DDTHH:mm")}
              onChange={(e) =>
                setSelectedTask({
                  ...selectedTask,
                  end: new Date(e.target.value),
                })
              }
              className={styles.dateTimeInput}
            />
          </div>
          <textarea
            className={styles.descriptionInput}
            value={selectedTask.description}
            onChange={(e) =>
              setSelectedTask({ ...selectedTask, description: e.target.value })
            }
            placeholder="Add description"
          />
          <div className={styles.courseSection}>
            <select
              className={styles.courseSelect}
              value={selectedTask.courseId || ""}
              onChange={(e) =>
                setSelectedTask({
                  ...selectedTask,
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
            {selectedTask.courseId && (
              <select
                className={styles.courseSelect}
                value={selectedTask.chapterId || ""}
                onChange={(e) =>
                  setSelectedTask({
                    ...selectedTask,
                    chapterId: e.target.value || null,
                  })
                }
              >
                <option value="">Select Chapter (Optional)</option>
                {getChaptersForCourse(selectedTask.courseId).map((chapter) => (
                  <option key={chapter._id} value={chapter._id}>
                    {chapter.title}
                  </option>
                ))}
              </select>
            )}
            <select
              className={styles.courseSelect}
              value={selectedTask.priority}
              onChange={(e) =>
                setSelectedTask({ ...selectedTask, priority: e.target.value })
              }
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>
          <div className={styles.popupActions}>
            {selectedTask.status === "Completed" ? (
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
            )}
            <button
              className={styles.actionButton}
              onClick={handleUpdateTask}
            >
              <Save size={16} />
              <span>Save</span>
            </button>
            <button
              className={styles.actionButton}
              onClick={handleDelete}
            >
              <Trash size={16} />
              <span>Delete</span>
            </button>
            <button
              className={`${styles.actionButton} ${styles.closeButton}`}
              onClick={() => setSelectedTask(null)}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {newTask && (
        <div className={styles.taskPopup}>
          <div className={styles.popupHeader}>
            <span
              className={styles.statusDot}
              style={{
                backgroundColor:
                  newTask.priority === "High"
                    ? "#f44336"
                    : newTask.priority === "Medium"
                    ? "#4285f4"
                    : "#ff9800",
              }}
            />
            <input
              className={styles.popupTitleInput}
              value={newTask.title}
              onChange={(e) => {
                setNewTask({ ...newTask, title: e.target.value });
                setWarning("");
              }}
              placeholder="Add title"
            />
          </div>
          {warning && (
            <p style={{ color: "red", marginBottom: "10px" }}>{warning}</p>
          )}
          <div className={styles.popupTime}>
            <div className={styles.timeLabel}>Start:</div>
            <input
              type="datetime-local"
              value={moment(newTask.start).format("YYYY-MM-DDTHH:mm")}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  start: new Date(e.target.value),
                })
              }
              className={styles.dateTimeInput}
            />
            <div className={styles.timeLabel}>Due:</div>
            <input
              type="datetime-local"
              value={moment(newTask.end).format("YYYY-MM-DDTHH:mm")}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  end: new Date(e.target.value),
                })
              }
              className={styles.dateTimeInput}
            />
          </div>
          <textarea
            className={styles.descriptionInput}
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            placeholder="Add description"
          />
          <div className={styles.courseSection}>
            <select
              className={styles.courseSelect}
              value={newTask.courseId || ""}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
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
            {newTask.courseId && (
              <select
                className={styles.courseSelect}
                value={newTask.chapterId || ""}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    chapterId: e.target.value || null,
                  })
                }
              >
                <option value="">Select Chapter (Optional)</option>
                {getChaptersForCourse(newTask.courseId).map((chapter) => (
                  <option key={chapter._id} value={chapter._id}>
                    {chapter.title}
                  </option>
                ))}
              </select>
            )}
            <select
              className={styles.courseSelect}
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value })
              }
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>
          <div className={styles.popupActions}>
            <button className={styles.actionButton} onClick={handleCreateTask}>
              <Save size={16} />
              <span>Save</span>
            </button>
            <button
              className={`${styles.actionButton} ${styles.closeButton}`}
              onClick={() => {
                setNewTask(null);
                setWarning("");
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div ref={calendarRef}>
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
          style={{ height: "85vh" }}
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
              borderRadius: "6px",
              border: "none",
              padding: "4px",
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