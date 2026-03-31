import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/courses";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types for course data
export interface CreateCourseData {
  title: string;
  description?: string;
  category?: string;
  level?: string;
  price: string;
}

export interface UpdateCourseData {
  title?: string;
  description?: string;
  category?: string;
  level?: string;
  price?: string;
}

export interface Course {
  course_id: number;
  title: string;
  description: string | null;
  category: string | null;
  level: string | null;
  price: string;
  created_at: string;
  updated_at: string | null;
}

export interface CourseResponse {
  success: boolean;
  message?: string;
  course?: Course;
  courses?: Course[];
  error?: string;
}

// Course service functions
export const courseService = {
  // Admin: create course
  async createCourse(courseData: CreateCourseData): Promise<CourseResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.post('/create-course', courseData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to create course' };
    }
  },

  // User: get all courses
  async getAllCourses(): Promise<CourseResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get('/get-all-courses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get all courses' };
    }
  },

  // User: get course by ID
  async getCourseById(id: number): Promise<CourseResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get(`/get-course/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get course' };
    }
  },

  // Admin: update course
  async updateCourse(id: number, updateData: UpdateCourseData): Promise<CourseResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.put(`/update-course/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to update course' };
    }
  },

  // Admin: delete course
  async deleteCourse(id: number): Promise<CourseResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.delete(`/delete-course/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to delete course' };
    }
  },

  // Helper function to validate course data
  validateCourseData(courseData: CreateCourseData | UpdateCourseData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if ('title' in courseData) {
      if (!courseData.title || courseData.title.trim() === '') {
        errors.push('Title is required');
      } else if (typeof courseData.title !== 'string') {
        errors.push('Title must be a string');
      } else if (courseData.title.trim().length < 3) {
        errors.push('Title must be at least 3 characters long');
      } else if (courseData.title.trim().length > 255) {
        errors.push('Title must be less than 255 characters');
      }
    }

    if ('description' in courseData && courseData.description) {
      if (typeof courseData.description !== 'string') {
        errors.push('Description must be a string');
      } else if (courseData.description.length > 1000) {
        errors.push('Description must be less than 1000 characters');
      }
    }

    if ('category' in courseData && courseData.category) {
      if (typeof courseData.category !== 'string') {
        errors.push('Category must be a string');
      } else if (courseData.category.length > 100) {
        errors.push('Category must be less than 100 characters');
      }
    }

    if ('level' in courseData && courseData.level) {
      const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
      if (typeof courseData.level !== 'string') {
        errors.push('Level must be a string');
      } else if (!validLevels.includes(courseData.level.toLowerCase())) {
        errors.push('Level must be one of: beginner, intermediate, advanced, expert');
      }
    }

    if ('price' in courseData) {
      if (!courseData.price || courseData.price.trim() === '') {
        errors.push('Price is required');
      } else if (typeof courseData.price !== 'string') {
        errors.push('Price must be a string');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Helper function to format course level for display
  formatLevel(level: string | null): string {
    if (!level) return 'Not specified';
    return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
  },

  // Helper function to get course statistics (would need backend implementation)
  async getCourseStats(_id: number): Promise<any> {
    // This would require a backend endpoint for course statistics
    // For now, return a placeholder
    try {
      // Example: const response = await api.get(`/courses/${id}/stats`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // return response.data;

      // Placeholder implementation
      return {
        success: true,
        stats: {
          totalStudents: 0,
          totalMaterials: 0,
          totalVideos: 0,
          averageRating: 0
        }
      };
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get course statistics' };
    }
  },
};

export default courseService;