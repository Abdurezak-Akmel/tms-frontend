import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/landing-videos";

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Types for landing video data
export interface LandingVideo {
    land_video_id: number;
    title: string | null;
    description: string | null;
    youtube_url: string;
    order_index: number;
    duration: number | null;
    created_at?: string;
}

export interface CreateLandingVideoData {
    title?: string;
    description?: string;
    youtube_url: string;
    order_index?: number;
    duration?: number;
}

export interface UpdateLandingVideoData {
    title?: string;
    description?: string;
    youtube_url?: string;
    order_index?: number;
    duration?: number;
}

export interface LandingVideoResponse {
    success: boolean;
    message?: string;
    video?: LandingVideo;
    videos?: LandingVideo[];
    error?: string;
}

// Landing video service functions
export const landingVideoService = {

    // Admin: create landing video
    async createLandingVideo(videoData: CreateLandingVideoData): Promise<LandingVideoResponse> {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await api.post('/create-landing-video', videoData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to create landing video' };
        }
    },

    // Admin: update landing video
    async updateLandingVideo(id: number, updateData: UpdateLandingVideoData): Promise<LandingVideoResponse> {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await api.put(`/update-landing-video/${id}`, updateData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to update landing video' };
        }
    },

    // Admin: delete landing video
    async deleteLandingVideo(id: number): Promise<LandingVideoResponse> {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await api.delete(`/delete-landing-video/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to delete landing video' };
        }
    },

    // Public: get all landing videos
    async getAllLandingVideos(): Promise<LandingVideoResponse> {
        try {
            const response = await api.get('/get-all-landing-videos');
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to get landing videos' };
        }
    },

    // Public: get landing video by ID
    async getLandingVideoById(id: number): Promise<LandingVideoResponse> {
        try {
            const response = await api.get(`/get-landing-video/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to get landing video' };
        }
    },
};

export default landingVideoService;
