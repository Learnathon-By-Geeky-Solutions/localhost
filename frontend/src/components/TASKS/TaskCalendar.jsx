import React, { useState, useRef, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import {Loader } from "lucide-react";
import styles from "./taskCalendar.module.css";

import TaskDetailModal from "./TaskDetailModal.jsx";
import { useTaskStore } from "../../store/useTaskStore.js";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);




const TaskCalendar = () => {
  const { tasks, isFetchingTasks, fetchTasks } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const calendarRef = useRef(null);

  useEffect(() => {

    fetchTasks();
    console.log(tasks);
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


  
  const handleSelectSlot = ({ start, end, box }) => {

    setSelectedTime({startTime:start, endTime:end});
    setIsModalOpen(true);
    
  };
  
  const handleSelectEvent = (event, e) => {
    
    setSelectedTask(event);
    setSelectedTime(null);
    setIsModalOpen(true);

  };
  
  const moveTask = async ({ event, start, end }) => {
    if (start >= end) {
      end = new Date(start.getTime() + 60 * 60 * 1000); // Add 1 hour if invalid
    }
    
    await updateTask({ ...event, startTime: start, endTime: end })
    
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setSelectedTime(null);
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
          givenTime={selectedTime}
          onClose={closeModal}
        />
      }
    </div>
  );
};

export default TaskCalendar;