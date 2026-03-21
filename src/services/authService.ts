import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/auth";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types for auth data
export interface RegisterData {
  name: string;
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
  name?: string;
  email?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    user_id: number;
    name: string;
    email: string;
    role_id: number;
    status: string;
    email_verified: boolean;
    registration_device: string;
    created_at: string;
    verification_token?: string | null;
    verification_token_expiry?: string | null;
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
      console.log('Making registration request to:', API_BASE_URL);
      console.log('Registration data:', userData);
      const response = await api.post("/register", userData);
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Registration error details:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      throw error.response?.data || { message: "Registration failed" };
    }
  },

  // Verify email with token
  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      console.log('Making email verification request to:', API_BASE_URL);
      console.log('Verification token:', token);
      const response = await api.post("/verify-email", { token });
      console.log('Email verification response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Email verification error details:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      throw error.response?.data || { message: "Email verification failed" };
    }
  },

  // Login user
  async login(credentials: LoginData): Promise<AuthResponse> {
    try {
      console.log('Making login request to:', API_BASE_URL);
      console.log('Login credentials:', { email: credentials.email, password: '***' });
      const response = await api.post("/login", credentials);
      console.log('Login response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login error details:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      throw error.response?.data || { message: "Login failed" };
    }
  },

  // Logout user
  async logout(): Promise<AuthResponse> {
    try {
      console.log('Making logout request to:', API_BASE_URL);
      const token = localStorage.getItem("accessToken");
      console.log('Logout token exists:', !!token);
      const response = await api.post(
        "/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Logout response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Logout error details:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      throw error.response?.data || { message: "Logout failed" };
    }
  },

  // Refresh access token
  // async refreshToken(): Promise<AuthResponse> {
  //   try {
  //     const refreshToken = localStorage.getItem("refreshToken");
  //     const response = await api.post("/refresh-token", { refreshToken });
  //     return response.data;
  //   } catch (error: any) {
  //     throw error.response?.data || { message: "Token refresh failed" };
  //   }
  // },

  // Get current user profile
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      console.log('Making get current user request to:', API_BASE_URL);
      const token = localStorage.getItem("accessToken");
      console.log('Get user token exists:', !!token);
      const response = await api.get("/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Get current user response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Get current user error details:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      throw error.response?.data || { message: "Failed to get user profile" };
    }
  },

  // Update user profile
  async updateProfile(profileData: UpdateProfileData): Promise<AuthResponse> {
    try {
      console.log('Making update profile request to:', API_BASE_URL);
      console.log('Profile data:', profileData);
      const token = localStorage.getItem("accessToken");
      console.log('Update profile token exists:', !!token);
      const response = await api.put("/profile", profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Update profile response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Update profile error details:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      throw error.response?.data || { message: "Profile update failed" };
    }
  },

  // Change password
  async changePassword(
    passwordData: ChangePasswordData,
  ): Promise<AuthResponse> {
    try {
      console.log('Making change password request to:', API_BASE_URL);
      console.log('Password data:', { currentPassword: '***', newPassword: '***' });
      const token = localStorage.getItem("accessToken");
      console.log('Change password token exists:', !!token);
      const response = await api.put("/change-password", passwordData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Change password response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Change password error details:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      throw error.response?.data || { message: "Password change failed" };
    }
  },

  // Request password reset
  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      console.log('Making forgot password request to:', API_BASE_URL);
      console.log('Forgot password email:', email);
      const response = await api.post("/forgot-password", { email });
      console.log('Forgot password response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Forgot password error details:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      throw (
        error.response?.data || { message: "Password reset request failed" }
      );
    }
  },

  // Validate reset token
  async validateResetToken(token: string): Promise<AuthResponse> {
    try {
      console.log('Making validate reset token request to:', API_BASE_URL);
      console.log('Reset token:', token);
      const response = await api.post("/validate-reset-token", { token });
      console.log('Validate reset token response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Validate reset token error details:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      throw error.response?.data || { message: "Invalid reset token" };
    }
  },

  // Reset password with token
  async resetPassword(resetData: ResetPasswordData): Promise<AuthResponse> {
    try {
      console.log('Making reset password request to:', API_BASE_URL);
      console.log('Reset password data:', { token: resetData.token, newPassword: '***' });
      const response = await api.post("/reset-password", resetData);
      console.log('Reset password response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Reset password error details:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      throw error.response?.data || { message: "Password reset failed" };
    }
  },

  // Helper functions for token management
  setTokens(accessToken: string) {
    localStorage.setItem("accessToken", accessToken);
  },

  clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },
};

export default authService;
