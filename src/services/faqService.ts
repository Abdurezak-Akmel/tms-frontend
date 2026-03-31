import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/faqs";

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Types for FAQ data
export interface FAQData {
    question: string;
    answer: string;
}

export interface FAQ {
    faqs_id: number;
    question: string;
    answer: string;
    created_at: string;
}

export interface FAQResponse {
    success: boolean;
    message?: string;
    faq?: FAQ;
    faqs?: FAQ[];
    error?: string;
}

// FAQ service functions
export const faqService = {
    // Create FAQ
    async createFAQ(faqData: FAQData): Promise<FAQResponse> {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await api.post('/create-faq', faqData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to create FAQ' };
        }
    },

    // Public: get all FAQs
    async getAllFAQs(): Promise<FAQResponse> {
        try {
            const response = await api.get('/get-all-faq');
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to get FAQs' };
        }
    },

    // Get FAQ by ID
    async getFAQById(id: number): Promise<FAQResponse> {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await api.get(`/get-faq/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to get FAQ' };
        }
    },

    // Update FAQ
    async updateFAQ(id: number, faqData: Partial<FAQData>): Promise<FAQResponse> {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await api.put(`/update-faq/${id}`, faqData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to update FAQ' };
        }
    },

    // Delete FAQ
    async deleteFAQ(id: number): Promise<FAQResponse> {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await api.delete(`/delete-faq/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to delete FAQ' };
        }
    },

    // Helper: validate FAQ data
    validateFAQData(data: Partial<FAQData>): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        if ('question' in data && (!data.question || data.question.trim() === '')) {
            errors.push('Question is required');
        }
        if ('answer' in data && (!data.answer || data.answer.trim() === '')) {
            errors.push('Answer is required');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

export default faqService;
