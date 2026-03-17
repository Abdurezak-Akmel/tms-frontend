import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types for course material data
export interface CreateMaterialData {
  course_id: number;
  title: string;
  description?: string;
  file: File;
}

export interface UpdateMaterialData {
  course_id?: number;
  title?: string;
  description?: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  file_url?: string;
}

export interface CourseMaterial {
  material_id: number;
  course_id: number;
  title: string;
  description: string | null;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  uploaded_at: string;
  updated_at: string | null;
}

export interface CourseMaterialResponse {
  success: boolean;
  message?: string;
  material?: CourseMaterial;
  materials?: CourseMaterial[];
  error?: string;
}

// Course material service functions
export const courseMaterialService = {
  // Admin: create course material (with file upload)
  async createMaterial(materialData: CreateMaterialData): Promise<CourseMaterialResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('course_id', materialData.course_id.toString());
      formData.append('title', materialData.title);
      if (materialData.description) {
        formData.append('description', materialData.description);
      }
      formData.append('file', materialData.file);

      const response = await api.post('/course-materials/create-course-material', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to create course material' };
    }
  },

  // Admin: get all course materials
  async getAllMaterials(): Promise<CourseMaterialResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get('/course-materials/all-course-materials', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get all materials' };
    }
  },

  // User: get material by ID
  async getMaterialById(id: number): Promise<CourseMaterialResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get(`/course-materials/course-material/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get material' };
    }
  },

  // User: get materials by course ID
  async getMaterialsByCourseId(course_id: number): Promise<CourseMaterialResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get(`/course-materials/course/${course_id}/materials`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get materials by course ID' };
    }
  },

  // Admin: get materials by title
  async getMaterialsByTitle(title: string): Promise<CourseMaterialResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get('/course-materials/search-by-title', {
        params: { title },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get materials by title' };
    }
  },

  // Admin: get materials by file name
  async getMaterialsByFilename(file_name: string): Promise<CourseMaterialResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get('/course-materials/search-by-filename', {
        params: { file_name },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get materials by filename' };
    }
  },

  // Admin: get materials by file type
  async getMaterialsByFileType(file_type: string): Promise<CourseMaterialResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get('/course-materials/search-by-filetype', {
        params: { file_type },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get materials by file type' };
    }
  },

  // Admin: update course material
  async updateMaterial(id: number, updateData: UpdateMaterialData): Promise<CourseMaterialResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.put(`/course-materials/update-course-material/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to update course material' };
    }
  },

  // Admin: delete course material
  async deleteMaterial(id: number): Promise<CourseMaterialResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.delete(`/course-materials/delete-course-material/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to delete course material' };
    }
  },

  // Helper function to get file download URL
  getFileUrl(material: CourseMaterial): string {
    return `${API_BASE_URL.replace('/api', '')}${material.file_url}`;
  },

  // Helper function to format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Helper function to validate file type
  validateFileType(file: File): boolean {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'video/avi',
      'video/mpeg',
      'audio/mpeg',
      'audio/wav',
      'application/zip',
      'application/x-zip-compressed'
    ];
    return allowedTypes.includes(file.type);
  },

  // Helper function to validate file size (10MB limit)
  validateFileSize(file: File): boolean {
    const maxSize = 10 * 1024 * 1024; // 10MB
    return file.size <= maxSize;
  },
};

export default courseMaterialService;