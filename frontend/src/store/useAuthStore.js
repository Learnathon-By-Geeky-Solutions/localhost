import { create } from 'zustand';
import { axiosInstance } from "../lib/axios.js";

export const useAuthStore = create((set) => ({
  user: null,
  authError: null,
  isLoggingIn: false, // Added for logging state tracking

  checkAuth: async () => {
    set({ user: null });

    try {
      // Replaced fetch with axios
      const response = await axiosInstance.get("/auth/me", {
        withCredentials: true, // Include cookies if needed
      });

      if (response.data) {
        set({ user: response.data });
        console.log("Authenticated:", response.data);
      } else {
        set({ user: null });
      }
    } catch (error) {
      set({ user: null, authError: "Error checking auth: " + error.message });

      console.error("Error checking auth:", error);
    }
  },

  login: async (credentials) => {
    set({ isLoggingIn: true }); 
  
    try {
      
      const response = await axiosInstance.post("/auth/login", credentials);
      
      
      set({ user: response.data });
      set({ authError: null }); 
    } catch (error) {
      // Handle login failure: set user to null and store error message
      set({ user: null });
      set({ authError: error.response?.data?.message || error.message });
  
      console.log("Login error:", error.response?.data?.message || error.message); // Log the error for debugging
    } finally {
      set({ isLoggingIn: false }); // End logging in process, regardless of success or failure
    }
  },

  logout: async () => {
    const url = import.meta.env.VITE_API_URL + "/auth/logout";
    try {

      const response = await axiosInstance.post(url, {}, {
        withCredentials: true,
      });

      if (response.status !== 200) {
        throw new Error('Logout failed');
      }

      set({ user: null, authError: null });
      console.log("Logout successful");
    
    } catch (error) {
      set({ authError: "Error logging out: " + error.message });
      console.error("Error logging out:", error);
    }
    
  },
}));
