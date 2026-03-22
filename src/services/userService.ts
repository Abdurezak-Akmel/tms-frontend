import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/users";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types for user data
export interface UpdateUserData {
  name?: string;
  email?: string;
  role_id?: number;
  status?: string;
  email_verified?: boolean;
  registration_device?: string;
}

export interface User {
  user_id: number;
  name: string;
  email: string;
  role_id: number;
  status: string;
  email_verified: boolean;
  registration_device: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface UserResponse {
  success: boolean;
  message?: string;
  user?: User;
  users?: User[];
  count?: number;
  status?: string;
  error?: string;
}

// User service functions
export const userService = {
  // Admin: get all users
  async getAllUsers(): Promise<UserResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get('/get-all-users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get all users' };
    }
  },

  // Admin: get user by id
  async getUserById(id: number): Promise<UserResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get(`/get-user-by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get user' };
    }
  },

  // Admin: get users by status
  async getUsersByStatus(status: string): Promise<UserResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get(`/get-user-by-status/${status}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get users by status' };
    }
  },

  // Admin: update a user
  async updateUser(id: number, updateData: UpdateUserData): Promise<UserResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.put(`/update-user-by-id/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to update user' };
    }
  },

  // Admin: delete a user
  async deleteUser(id: number): Promise<UserResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.delete(`/delete-user-by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to delete user' };
    }
  },

  // Helper function to validate user update data
  validateUpdateData(updateData: UpdateUserData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate allowed fields
    const allowedFields = ['name', 'email', 'role_id', 'status', 'email_verified', 'registration_device'];
    const invalidFields = Object.keys(updateData).filter(field => !allowedFields.includes(field));
    
    if (invalidFields.length > 0) {
      errors.push(`Invalid fields: ${invalidFields.join(', ')}. Allowed fields: ${allowedFields.join(', ')}`);
    }

    // Validate name if provided
    if ('name' in updateData) {
      if (!updateData.name || updateData.name.trim() === '') {
        errors.push('Name is required');
      } else if (typeof updateData.name !== 'string') {
        errors.push('Name must be a string');
      } else if (updateData.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
      } else if (updateData.name.trim().length > 255) {
        errors.push('Name must be less than 255 characters');
      }
    }

    // Validate email if provided
    if ('email' in updateData) {
      if (!updateData.email || updateData.email.trim() === '') {
        errors.push('Email is required');
      } else if (typeof updateData.email !== 'string') {
        errors.push('Email must be a string');
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updateData.email.trim())) {
          errors.push('Invalid email format');
        }
      }
    }

    // Validate role_id if provided
    if ('role_id' in updateData && updateData.role_id !== undefined) {
      if (!Number.isInteger(updateData.role_id) || updateData.role_id <= 0) {
        errors.push('role_id must be a positive integer');
      }
    }

    // Validate status if provided
    if ('status' in updateData && updateData.status !== undefined) {
      const validStatuses = ['active', 'inactive', 'suspended', 'pending'];
      if (!validStatuses.includes(updateData.status)) {
        errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
      }
    }

    // Validate email_verified if provided
    if ('email_verified' in updateData) {
      if (typeof updateData.email_verified !== 'boolean') {
        errors.push('email_verified must be a boolean');
      }
    }

    // Validate registration_device if provided
    if ('registration_device' in updateData && updateData.registration_device) {
      if (typeof updateData.registration_device !== 'string') {
        errors.push('registration_device must be a string');
      } else if (updateData.registration_device.length > 255) {
        errors.push('registration_device must be less than 255 characters');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Helper function to format user status for display
  formatStatus(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'suspended':
        return 'Suspended';
      case 'pending':
        return 'Pending';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  },

  // Helper function to get status color for UI
  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return '#28A745'; // Green
      case 'inactive':
        return '#6C757D'; // Gray
      case 'suspended':
        return '#DC3545'; // Red
      case 'pending':
        return '#FFA500'; // Orange
      default:
        return '#6C757D'; // Gray
    }
  },

  // Helper function to format registration date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Helper function to search users by name or email
  searchUsers(users: User[], searchTerm: string): User[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return users;
    }

    const term = searchTerm.toLowerCase().trim();
    return users.filter(user => 
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  },

  // Helper function to sort users
  sortUsers(users: User[], sortBy: 'name' | 'email' | 'created_at' | 'status' = 'name', order: 'asc' | 'desc' = 'asc'): User[] {
    return [...users].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return order === 'desc' ? -comparison : comparison;
    });
  },

  // Helper function to filter users by status
  filterByStatus(users: User[], status: string): User[] {
    if (!status || status === 'all') {
      return users;
    }
    return users.filter(user => user.status === status);
  },

  // Helper function to filter users by role
  filterByRole(users: User[], roleId: number): User[] {
    if (!roleId || roleId === 0) {
      return users;
    }
    return users.filter(user => user.role_id === roleId);
  },

  // Helper function to get user statistics (would need backend implementation)
  async getUserStats(): Promise<any> {
    // This would require a backend endpoint for user statistics
    // For now, return a placeholder
    try {
      // Example: const response = await api.get('/users/stats', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // return response.data;
      
      // Placeholder implementation
      return {
        success: true,
        stats: {
          totalUsers: 0,
          activeUsers: 0,
          inactiveUsers: 0,
          suspendedUsers: 0,
          pendingUsers: 0
        }
      };
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get user statistics' };
    }
  },
};

export default userService;