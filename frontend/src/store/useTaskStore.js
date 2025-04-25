import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useTaskStore = create((set) => ({
  tasks: [],
  taskError: null,

  isFetchingTasks: false,
  isCreatingTask: false,
  isUpdatingTask: false,
  isDeletingTask: false,

  fetchTasks: async () => {
    set({ isFetchingTasks: true, taskError: null });
    try {
      const response = await axiosInstance.get("/tasks");
      set({ tasks: response.data });

    } catch (error) {
      console.error("Error fetching tasks:", error);
      set({ taskError: "Failed to fetch tasks: " + error.message });
    } finally {
      set({ isFetchingTasks: false });
    }
  },


  createTask: async (taskData) => {
    set({ isCreatingTask: true, taskError: null });
    try {
      const response = await axiosInstance.post("/tasks", taskData);
      set((state) => ({
        tasks: [...state.tasks, response.data],
      }));
    } catch (error) {
      console.error("Error creating task:", error);
      set({ taskError: "Failed to create task: " + error.message });
    } finally {
      set({ isCreatingTask: false });
    }
  },

  updateTask: async (id, newData) => {
    set({ isUpdatingTask: true, taskError: null });
    try {
      const response = await axiosInstance.put(`/tasks/${id}`, newData);
      // set((state) => ({
      //   tasks: state.tasks.map((task) =>
      //     task._id === id ? response.data : task
      //   ),
      // }));
    } catch (error) {
      console.error("Error updating task:", error);
      set({ taskError: "Failed to update task: " + error.message });
    } finally {
      set({ isUpdatingTask: false });
    }
  },

  changeStatus: async (id, newStatus) => {
    set({ isUpdatingTask: true, taskError: null });
    try {
      const response = await axiosInstance.patch(`/tasks/${id}`, newStatus);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? response.data : task
        ),
      }));
    } catch (error) {
      console.error("Error updating task:", error);
      set({ taskError: "Failed to update task: " + error.message });
    } finally {
      set({ isUpdatingTask: false });
    }
  },

  deleteTask: async (id) => {
    set({ isDeletingTask: true, taskError: null });
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== id),
      }));
    } catch (error) {
      console.error("Error deleting task:", error);
      set({ taskError: "Failed to delete task: " + error.message });
    } finally {
      set({ isDeletingTask: false });
    }
  },


  // fetchTasksByCourse: async (courseId) => {
  //   set({ isFetchingTasks: true, taskError: null });
  //   try {
  //     const response = await axiosInstance.get(`/task/course/${courseId}`);
  //     set({ tasks: response.data });
  //   } catch (error) {
  //     console.error("Error fetching course tasks:", error);
  //     set({ taskError: "Failed to fetch course tasks: " + error.message });
  //   } finally {
  //     set({ isFetchingTasks: false });
  //   }
  // },

  // fetchTasksByChapter: async (chapterId) => {
  //   set({ isFetchingTasks: true, taskError: null });
  //   try {
  //     const response = await axiosInstance.get(`/tasks/chapter/${chapterId}`);
  //     set({ tasks: response.data });
  //   } catch (error) {
  //     console.error("Error fetching chapter tasks:", error);
  //     set({ taskError: "Failed to fetch chapter tasks: " + error.message });
  //   } finally {
  //     set({ isFetchingTasks: false });
  //   }
  // },


}));
