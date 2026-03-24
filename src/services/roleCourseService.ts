import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types for role-course data
export interface RoleCourseAssignment {
  assignment_id: number;
  role_id: number;
  course_id: number;
  assigned_at: string;
}

export interface AssignCourseData {
  role_id: number;
  course_id: number;
}

export interface AssignMultipleCoursesData {
  role_id: number;
  course_ids: number[];
}

export interface RemoveCourseData {
  role_id: number;
  course_id: number;
}

export interface RemoveMultipleCoursesData {
  role_id: number;
  course_ids: number[];
}

export interface RoleCourseResponse {
  success: boolean;
  message?: string;
  assignment?: RoleCourseAssignment;
  assignments?: RoleCourseAssignment[];
  courses?: any[];
  roles?: any[];
  removed_count?: number;
  error?: string;
}

// Role course service functions
export const roleCourseService = {
  // Admin: assign a single course to a role
  async assignCourseToRole(assignData: AssignCourseData): Promise<RoleCourseResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.post('role-course/assign-course', assignData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to assign course to role' };
    }
  },

  // Admin: remove a single course from a role
  async removeCourseFromRole(removeData: RemoveCourseData): Promise<RoleCourseResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.delete('role-course/remove-course', {
        data: removeData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to remove course from role' };
    }
  },

  // Admin: assign multiple courses to a role
  async assignMultipleCoursesToRole(assignData: AssignMultipleCoursesData): Promise<RoleCourseResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.post('role-course/assign-multiple-courses', assignData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to assign multiple courses to role' };
    }
  },

  // Admin: remove multiple courses from a role
  async removeMultipleCoursesFromRole(removeData: RemoveMultipleCoursesData): Promise<RoleCourseResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.delete('role-course/remove-multiple-courses', {
        data: removeData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to remove multiple courses from role' };
    }
  },

  // Admin: sync courses to a role
  async syncCoursesToRole(syncData: AssignMultipleCoursesData): Promise<RoleCourseResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.post('role-course/sync-courses', syncData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to sync courses to role' };
    }
  },

  // Admin: get all role-course assignments
  async getAllRoleCourseAssignments(): Promise<RoleCourseResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get('role-course/get-all-assignments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get all role-course assignments' };
    }
  },

  // Admin: get all courses assigned to a specific role
  async getCoursesByRoleId(role_id: number): Promise<RoleCourseResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get(`role-course/role/${role_id}/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get courses by role ID' };
    }
  },

  // Admin: get all roles assigned to a specific course
  async getRolesByCourseId(course_id: number): Promise<RoleCourseResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get(`role-course/course/${course_id}/roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get roles by course ID' };
    }
  },

  // Helper function to validate role-course assignment data
  validateAssignmentData(assignData: AssignCourseData | AssignMultipleCoursesData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!assignData.role_id || !Number.isInteger(assignData.role_id) || assignData.role_id <= 0) {
      errors.push('Valid role_id is required');
    }

    if ('course_id' in assignData) {
      if (!assignData.course_id || !Number.isInteger(assignData.course_id) || assignData.course_id <= 0) {
        errors.push('Valid course_id is required');
      }
    }

    if ('course_ids' in assignData) {
      if (!Array.isArray(assignData.course_ids) || assignData.course_ids.length === 0) {
        errors.push('course_ids must be a non-empty array');
      } else {
        const invalidIds = assignData.course_ids.filter(id => !Number.isInteger(id) || id <= 0);
        if (invalidIds.length > 0) {
          errors.push('All course_ids must be valid positive integers');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Helper function to validate removal data
  validateRemovalData(removeData: RemoveCourseData | RemoveMultipleCoursesData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!removeData.role_id || !Number.isInteger(removeData.role_id) || removeData.role_id <= 0) {
      errors.push('Valid role_id is required');
    }

    if ('course_id' in removeData) {
      if (!removeData.course_id || !Number.isInteger(removeData.course_id) || removeData.course_id <= 0) {
        errors.push('Valid course_id is required');
      }
    }

    if ('course_ids' in removeData) {
      if (!Array.isArray(removeData.course_ids) || removeData.course_ids.length === 0) {
        errors.push('course_ids must be a non-empty array');
      } else {
        const invalidIds = removeData.course_ids.filter(id => !Number.isInteger(id) || id <= 0);
        if (invalidIds.length > 0) {
          errors.push('All course_ids must be valid positive integers');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Helper function to format assignment date
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

  // Helper function to check if course is assigned to role
  isCourseAssigned(assignments: RoleCourseAssignment[], roleId: number, courseId: number): boolean {
    return assignments.some(
      assignment => assignment.role_id === roleId && assignment.course_id === courseId
    );
  },

  // Helper function to get assignments by role
  getAssignmentsByRole(assignments: RoleCourseAssignment[], roleId: number): RoleCourseAssignment[] {
    return assignments.filter(assignment => assignment.role_id === roleId);
  },

  // Helper function to get assignments by course
  getAssignmentsByCourse(assignments: RoleCourseAssignment[], courseId: number): RoleCourseAssignment[] {
    return assignments.filter(assignment => assignment.course_id === courseId);
  },
};

export default roleCourseService;