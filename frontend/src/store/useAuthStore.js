import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useAuthStore = create((set) => ({
  user: null,
  authError: null,
  isLoggingIn: false,
  isCheckingAuth: false,
  isSigningUp: false,
  isResettingPassword: false,
  isSendingOtp: false,

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
      return { success: true, data: response.data };
    } catch (error) {
      set({
        user: null,
        authError: error.response?.data?.message || error.message,
      });
      console.log(
        "Login error:",
        error.response?.data?.message || error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
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
      return { success: true, data: response.data };
    } catch (error) {
      set({
        user: null,
        authError: error.response?.data?.message || error.message,
      });
      console.error(
        "Signup error:",
        error.response?.data?.message || error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    } finally {
      set({ isSigningUp: false });
    }
  },

  sendResetOtp: async (email) => {
    set({ isSendingOtp: true, authError: null });

    try {
      const response = await axiosInstance.post("/auth/send-reset-otp", {
        email,
      });
      set({ authError: null });
      console.log("OTP sent successfully");
      return { success: true, message: "OTP sent successfully" };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      set({ authError: errorMsg });
      console.error("Error sending OTP:", errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      set({ isSendingOtp: false });
    }
  },

  resetPassword: async (resetData) => {
    set({ isResettingPassword: true, authError: null });

    try {
      const response = await axiosInstance.post(
        "/auth/reset-password",
        resetData
      );

      // Check the response status and data to ensure success
      if (response.status === 200 && response.data.success) {
        set({ authError: null });
        console.log("Password reset successful");
        return { success: true, message: "Password reset successful" };
      } else {
        // Handle case where the API returns 200 but with error in payload
        const errorMsg = response.data.message || "Password reset failed";
        set({ authError: errorMsg });
        console.error("Error resetting password:", errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      set({ authError: errorMsg });
      console.error("Error resetting password:", errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      set({ isResettingPassword: false });
    }
  },

  logout: async () => {
    const url = import.meta.env.VITE_API_URL + "/auth/logout";
    try {
      const response = await axiosInstance.post(
        url,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status !== 200) {
        throw new Error("Logout failed");
      }

      set({ user: null, authError: null });
      console.log("Logout successful");
      return { success: true };
    } catch (error) {
      set({ authError: "Error logging out: " + error.message });
      console.error("Error logging out:", error);
      return { success: false, message: error.message };
    }
  },
}));
