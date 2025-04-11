import { create } from 'zustand';
import { axiosInstance } from "../lib/axios.js";

export const useAuthStore = create((set) => ({
  user: null,
  authError: null,
  isLoggingIn: false,
  isCheckingAuth: false,
  isSigningUp: false, // Add signup state

  checkAuth: async () => {
    set({ user: null, isCheckingAuth: true });

    try {
      const response = await axiosInstance.get("/auth/me", {
        withCredentials: true,
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
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (credentials) => {
    set({ isLoggingIn: true });

    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      set({ user: response.data, authError: null });
    } catch (error) {
      set({ user: null, authError: error.response?.data?.message || error.message });
      console.log("Login error:", error.response?.data?.message || error.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signup: async (signupData) => {
    set({ isSigningUp: true });

    try {
      const response = await axiosInstance.post("/auth/signup", signupData, {
        withCredentials: true,
      });

      // Assuming the response includes the user info and sets cookie for auth
      set({ user: response.data, authError: null });
      console.log("Signup successful:", response.data);
    } catch (error) {
      set({ user: null, authError: error.response?.data?.message || error.message });
      console.error("Signup error:", error.response?.data?.message || error.message);
    } finally {
      set({ isSigningUp: false });
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
