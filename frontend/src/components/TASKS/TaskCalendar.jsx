import React, { useState, useRef, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { Check, Save, Trash, X, Loader } from "lucide-react";
import styles from "./taskCalendar.module.css";
import TaskDetailModal from "./TaskDetailModal.jsx";
import { useTaskStore } from "../../store/useTaskStore.js";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);




const TaskCalendar = () => {
  const { tasks, isFetchingTasks, fetchTasks } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const calendarRef = useRef(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {

    fetchTasks();
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


  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const moveTask = async ({ event, start, end }) => {
    if (start >= end) {
      end = new Date(start.getTime() + 60 * 60 * 1000); // Add 1 hour if invalid
    }

    await updateTask(event._id, { ...event, startTime: start, endTime: end })

    fetchTasks();
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
    const x = box ? box.x : 0;
    const y = box ? box.y : 0;

    const safePosition = calculateSafePosition(x, y);
    setPopupPosition(safePosition);


  };

  const handleSelectEvent = (event, e) => {
    if (e && e.pageX && e.pageY) {
      const safePosition = calculateSafePosition(e.pageX, e.pageY);
      setPopupPosition(safePosition);
    }
    setSelectedTask(event);
  };



  if (isFetchingTasks) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size={32} className={styles.spinner} />
        <p>Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>

      <div ref={calendarRef} className={styles.calendar}>
        <DnDCalendar
          localizer={localizer}
          events={tasks}
          startAccessor="start"
          endAccessor="end"
          selectable
          resizable
          defaultView={Views.WEEK}
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
      {isModalOpen &&
        <TaskDetailModal
          givenTask={selectedTask}
          popupPosition={popupPosition}
          onClose={closeModal}
        />
      }
    </div>
  );
};

export default TaskCalendar;