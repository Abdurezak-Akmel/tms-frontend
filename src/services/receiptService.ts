import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types for receipt data
export interface Receipt {
  receipt_id: number;
  user_id: number;
  file_path: string;
  file_size?: number; // Added file_size
  upload_date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ReceiptResponse {
  success: boolean;
  message?: string;
  data?: Receipt | Receipt[];
  error?: string;
}

export interface UploadReceiptResponse {
  success: boolean;
  message?: string;
  data?: {
    receipt_id: number;
    file_path: string;
    upload_date: string;
    status: string;
    file_size?: number; // Added file_size
  };
  error?: string;
}

export interface AllReceiptsResponse {
  success: boolean;
  receipts: Receipt[];
  count: number;
  message?: string;
  error?: string;
}

// Receipt service functions
export const receiptService = {
  // User: upload receipt
  async uploadReceipt(file: File): Promise<UploadReceiptResponse> {
    try {
      const token = localStorage.getItem('accessToken');

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('receipt', file);

      const response = await api.post('/receipts/upload-receipt', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to upload receipt' };
    }
  },

  // User: get their receipts
  async getUserReceipts(): Promise<ReceiptResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get('/receipts/get-my-receipt', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get user receipts' };
    }
  },

  // User/Admin: get receipt by ID
  async getReceiptById(id: number): Promise<ReceiptResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get(`/receipts/get-receipt/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get receipt details' };
    }
  },

  // Admin: get all receipts
  async getAllReceipts(): Promise<AllReceiptsResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get('/receipts/get-all-receipts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get all receipts' };
    }
  },

  // Helper function to get receipt download URL
  getReceiptUrl(receipt: Receipt): string {
    return `${API_BASE_URL.replace('/api', '')}/uploads/receipts/${receipt.file_path}`;
  },

  // Helper function to validate receipt file type
  validateReceiptFileType(file: File): boolean {
    const allowedTypes = ['application/pdf'];
    const allowedExtensions = ['.pdf'];

    const hasValidType = allowedTypes.includes(file.type);
    const hasValidExtension = allowedExtensions.some(ext =>
      file.name.toLowerCase().endsWith(ext)
    );

    return hasValidType && hasValidExtension;
  },

  // Helper function to validate receipt file size (1MB limit)
  validateReceiptFileSize(file: File): boolean {
    const maxSize = 1 * 1024 * 1024; // 1MB
    return file.size <= maxSize;
  },

  // Helper function to format file size for display
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Helper function to format receipt status for display
  formatStatus(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pending Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  },

  // Helper function to get status color for UI
  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#FFA500'; // Orange
      case 'approved':
        return '#28A745'; // Green
      case 'rejected':
        return '#DC3545'; // Red
      default:
        return '#6C757D'; // Gray
    }
  },

  // Helper function to format upload date
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

  // Helper function to check if receipt is recent (uploaded within last 7 days)
  isRecentReceipt(uploadDate: string): boolean {
    const upload = new Date(uploadDate);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - upload.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays <= 7;
  },
};

export default receiptService;