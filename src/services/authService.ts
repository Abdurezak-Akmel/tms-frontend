import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/auth";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types for auth data
export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    emailVerified: boolean;
    role: string;
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface VerifyEmailData {
  token: string;
}

// Auth service functions
export const authService = {
  // Register a new user
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post("/register", userData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Registration failed" };
    }
  },

  // Verify email with token
  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const response = await api.post("/verify-email", { token });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Email verification failed" };
    }
  },

  // Login user
  async login(credentials: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post("/login", credentials);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Login failed" };
    }
  },

  // Logout user
  async logout(): Promise<AuthResponse> {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.post(
        "/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Logout failed" };
    }
  },

  // Refresh access token
  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await api.post("/refresh-token", { refreshToken });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Token refresh failed" };
    }
  },

  // Get current user profile
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get("/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Failed to get user profile" };
    }
  },

  // Update user profile
  async updateProfile(profileData: UpdateProfileData): Promise<AuthResponse> {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.put("/profile", profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Profile update failed" };
    }
  },

  // Change password
  async changePassword(
    passwordData: ChangePasswordData,
  ): Promise<AuthResponse> {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.put("/change-password", passwordData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Password change failed" };
    }
  },

  // Request password reset
  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await api.post("/forgot-password", { email });
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data || { message: "Password reset request failed" }
      );
    }
  },

  // Validate reset token
  async validateResetToken(token: string): Promise<AuthResponse> {
    try {
      const response = await api.post("/validate-reset-token", { token });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Invalid reset token" };
    }
  },

  // Reset password with token
  async resetPassword(resetData: ResetPasswordData): Promise<AuthResponse> {
    try {
      const response = await api.post("/reset-password", resetData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Password reset failed" };
    }
  },

  // Helper functions for token management
  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },

  clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },
};

export default authService;
