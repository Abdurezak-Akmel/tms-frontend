import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types for role data
export interface RoleData {
  role_name: string;
  description?: string;
}

export interface Role {
  role_id: number;
  role_name: string;
  description: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface RoleResponse {
  success: boolean;
  message?: string;
  role?: Role;
  roles?: Role[];
  error?: string;
}

// Role service functions
export const roleService = {
  // Admin: get all roles
  async getAllRoles(): Promise<RoleResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get('/roles/get-all-roles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get all roles' };
    }
  },

  // Admin: create new role
  async createRole(roleData: RoleData): Promise<RoleResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.post('/roles/create-new-role', roleData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to create role' };
    }
  },

  // Admin: update existing role
  async updateRole(id: number, roleData: RoleData): Promise<RoleResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.put(`/roles/update-role-by-id/${id}`, roleData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to update role' };
    }
  },

  // Admin: get role by ID
  async getRoleById(id: number): Promise<RoleResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get(`/roles/get-role-by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get role' };
    }
  },

  // Helper function to validate role data
  validateRoleData(roleData: RoleData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!roleData.role_name || roleData.role_name.trim() === '') {
      errors.push('Role name is required');
    } else if (typeof roleData.role_name !== 'string') {
      errors.push('Role name must be a string');
    } else if (roleData.role_name.trim().length < 2) {
      errors.push('Role name must be at least 2 characters long');
    } else if (roleData.role_name.trim().length > 100) {
      errors.push('Role name must be less than 100 characters');
    } else if (!/^[a-zA-Z0-9_\-\s]+$/.test(roleData.role_name.trim())) {
      errors.push('Role name can only contain letters, numbers, spaces, underscores, and hyphens');
    }

    if (roleData.description) {
      if (typeof roleData.description !== 'string') {
        errors.push('Description must be a string');
      } else if (roleData.description.trim().length > 500) {
        errors.push('Description must be less than 500 characters');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Helper function to format role name for display
  formatRoleName(roleName: string): string {
    return roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase().replace(/_/g, ' ');
  },

  // Helper function to format creation date
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

  // Helper function to check if role is system role
  isSystemRole(roleName: string): boolean {
    const systemRoles = ['admin', 'student', 'instructor', 'moderator'];
    return systemRoles.includes(roleName.toLowerCase());
  },

  // Helper function to get role display color
  getRoleColor(roleName: string): string {
    const roleColors: { [key: string]: string } = {
      admin: '#DC3545', // Red
      instructor: '#007BFF', // Blue
      student: '#28A745', // Green
      moderator: '#FFA500', // Orange
      default: '#6C757D' // Gray
    };

    const roleKey = roleName.toLowerCase();
    return roleColors[roleKey] || roleColors.default;
  },

  // Helper function to get role icon
  getRoleIcon(roleName: string): string {
    const roleIcons: { [key: string]: string } = {
      admin: '👑',
      instructor: '👨‍🏫',
      student: '👨‍🎓',
      moderator: '🛡️',
      default: '👤'
    };

    const roleKey = roleName.toLowerCase();
    return roleIcons[roleKey] || roleIcons.default;
  },

  // Helper function to search roles by name
  searchRoles(roles: Role[], searchTerm: string): Role[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return roles;
    }

    const term = searchTerm.toLowerCase().trim();
    return roles.filter(role =>
      role.role_name.toLowerCase().includes(term) ||
      (role.description && role.description.toLowerCase().includes(term))
    );
  },

  // Helper function to sort roles
  sortRoles(roles: Role[], sortBy: 'name' | 'created_at' = 'name', order: 'asc' | 'desc' = 'asc'): Role[] {
    return [...roles].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.role_name.localeCompare(b.role_name);
          break;
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }

      return order === 'desc' ? -comparison : comparison;
    });
  },

  // Helper function to get role statistics (would need backend implementation)
  async getRoleStats(_roleId: number): Promise<any> {
    // This would require a backend endpoint for role statistics
    // For now, return a placeholder
    try {
      // Example: const response = await api.get(`/roles/${roleId}/stats`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // return response.data;

      // Placeholder implementation
      return {
        success: true,
        stats: {
          totalUsers: 0,
          totalCourses: 0,
          totalPermissions: 0
        }
      };
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get role statistics' };
    }
  },
};

export default roleService;