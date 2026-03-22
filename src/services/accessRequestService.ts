import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/access-requests";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types for access request data
export interface CreateAccessRequestData {
  course_id: number;
  receipt_id?: number;
}

export interface UpdateAccessRequestStatusData {
  status: 'pending' | 'approved' | 'rejected';
  reviewed_at?: string;
}

export interface AccessRequest {
  request_id: number;
  user_id: number;
  course_id: number;
  receipt_id: number | null;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  reviewed_at: string | null;
}

export interface AccessRequestResponse {
  success: boolean;
  message?: string;
  data?: AccessRequest | AccessRequest[];
  error?: string;
}

// Access request service functions
export const accessRequestService = {
  // User routes

  // Create a new access request for a course (requires authentication)
  async createAccessRequest(requestData: CreateAccessRequestData): Promise<AccessRequestResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.post('/access-requests', requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to create access request' };
    }
  },

  // Get all access requests for the authenticated user
  async getUserAccessRequests(): Promise<AccessRequestResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get('/access-requests/access-requests', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get user access requests' };
    }
  },

  // Admin routes

  // Get all access requests with optional filtering (admin only)
  async getAllAccessRequests(filters?: {
    status?: string;
    course_id?: number;
    user_id?: number;
  }): Promise<AccessRequestResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams();
      
      if (filters?.status) params.append('status', filters.status);
      if (filters?.course_id) params.append('course_id', filters.course_id.toString());
      if (filters?.user_id) params.append('user_id', filters.user_id.toString());

      const response = await api.get(`/access-requests/admin/access-requests?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get all access requests' };
    }
  },

  // Get all pending access requests (admin only)
  async getPendingRequests(): Promise<AccessRequestResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get('/access-requests/admin/access-requests/pending', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get pending requests' };
    }
  },

  // Get all access requests for a specific course (admin only)
  async getRequestsByCourseId(course_id: number): Promise<AccessRequestResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get(`/access-requests/admin/access-requests/course/${course_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get requests by course ID' };
    }
  },

  // Get all access requests by status (admin only)
  async getRequestsByStatus(status: string): Promise<AccessRequestResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get(`/access-requests/admin/access-requests/status/${status}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get requests by status' };
    }
  },

  // Get a specific access request by ID (admin only)
  async getAccessRequestById(request_id: number): Promise<AccessRequestResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get(`/access-requests/admin/access-requests/${request_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get access request' };
    }
  },

  // Update access request status by ID (approve/reject) (admin only)
  async updateAccessRequestStatus(request_id: number, statusData: UpdateAccessRequestStatusData): Promise<AccessRequestResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.put(`/access-requests/admin/access-requests/${request_id}/status`, statusData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to update access request status' };
    }
  },

  // Delete an access request by ID (admin only)
  async deleteAccessRequest(request_id: number): Promise<AccessRequestResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.delete(`/access-requests/admin/access-requests/${request_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to delete access request' };
    }
  },
};

export default accessRequestService;