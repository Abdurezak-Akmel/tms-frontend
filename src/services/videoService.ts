import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types for video data
export interface CreateVideoData {
  course_id: number;
  title?: string;
  description?: string;
  youtube_url: string;
  order_index?: number;
  duration?: number;
}

export interface UpdateVideoData {
  course_id?: number;
  title?: string;
  description?: string;
  youtube_url?: string;
  order_index?: number;
  duration?: number;
}

export interface Video {
  video_id: number;
  course_id: number;
  title: string | null;
  description: string | null;
  youtube_url: string;
  order_index: number | null;
  duration: number | null;
  created_at: string;
  updated_at: string | null;
}

export interface VideoResponse {
  success: boolean;
  message?: string;
  video?: Video;
  videos?: Video[];
  error?: string;
}

// Video service functions
export const videoService = {
  // Admin: create video
  async createVideo(videoData: CreateVideoData): Promise<VideoResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.post('/videos/create-video', videoData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to create video' };
    }
  },

  // Admin: get all videos
  async getAllVideos(): Promise<VideoResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get('/videos/get-all-videos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get all videos' };
    }
  },

  // Admin/User: get single video by ID
  async getVideoById(id: number): Promise<VideoResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get(`/videos/get-video/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get video' };
    }
  },

  // User: get videos by course ID
  async getVideosByCourseId(course_id: number): Promise<VideoResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get(`/videos/get-videos/${course_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get videos by course ID' };
    }
  },

  // Admin: update video
  async updateVideo(id: number, updateData: UpdateVideoData): Promise<VideoResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.put(`/videos/update-video/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to update video' };
    }
  },

  // Admin: delete video
  async deleteVideo(id: number): Promise<VideoResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.delete(`/videos/delete-video/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to delete video' };
    }
  },

  // Helper function to validate video data
  validateVideoData(videoData: CreateVideoData | UpdateVideoData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate course_id if provided
    if ('course_id' in videoData && videoData.course_id !== undefined) {
      if (!Number.isInteger(videoData.course_id) || videoData.course_id <= 0) {
        errors.push('course_id must be a positive integer');
      }
    }

    // Validate title if provided
    if ('title' in videoData && videoData.title !== undefined) {
      if (videoData.title && typeof videoData.title !== 'string') {
        errors.push('title must be a string');
      } else if (videoData.title && videoData.title.trim().length > 255) {
        errors.push('title must be less than 255 characters');
      }
    }

    // Validate description if provided
    if ('description' in videoData && videoData.description !== undefined) {
      if (videoData.description && typeof videoData.description !== 'string') {
        errors.push('description must be a string');
      } else if (videoData.description && videoData.description.length > 1000) {
        errors.push('description must be less than 1000 characters');
      }
    }

    // Validate youtube_url if provided
    if ('youtube_url' in videoData && videoData.youtube_url !== undefined) {
      if (!videoData.youtube_url || videoData.youtube_url.trim() === '') {
        errors.push('youtube_url is required');
      } else if (typeof videoData.youtube_url !== 'string') {
        errors.push('youtube_url must be a string');
      } else {
        // Basic YouTube URL validation
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]{11}/;
        if (!youtubeRegex.test(videoData.youtube_url.trim())) {
          errors.push('Invalid YouTube URL format');
        }
      }
    }

    // Validate order_index if provided
    if ('order_index' in videoData && videoData.order_index !== undefined) {
      if (!Number.isInteger(videoData.order_index) || videoData.order_index < 0) {
        errors.push('order_index must be a non-negative integer');
      }
    }

    // Validate duration if provided
    if ('duration' in videoData && videoData.duration !== undefined) {
      if (!Number.isInteger(videoData.duration) || videoData.duration <= 0) {
        errors.push('duration must be a positive integer (in seconds)');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Helper function to extract YouTube video ID from URL
  extractYouTubeId(url: string): string | null {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  },

  // Helper function to get YouTube embed URL
  getEmbedUrl(youtubeUrl: string): string | null {
    const videoId = this.extractYouTubeId(youtubeUrl);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  },

  // Helper function to get YouTube thumbnail URL
  getThumbnailUrl(youtubeUrl: string, quality: 'default' | 'medium' | 'high' = 'medium'): string | null {
    const videoId = this.extractYouTubeId(youtubeUrl);
    if (!videoId) return null;

    const qualityMap = {
      default: 'default',
      medium: 'mqdefault',
      high: 'hqdefault'
    };

    return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
  },

  // Helper function to format duration for display
  formatDuration(seconds: number | null): string {
    if (!seconds) return 'Unknown';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
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

  // Helper function to fetch YouTube metadata (Title and Duration)
  async fetchYouTubeMetadata(url: string, apiKey?: string): Promise<{ title: string | null; duration: number | null }> {
    const videoId = this.extractYouTubeId(url);
    if (!videoId) return { title: null, duration: null };

    let title: string | null = null;
    let duration: number | null = null;

    try {
      // 1. Fetch Title using oEmbed (free, no key needed, generally CORS-friendly or manageable)
      const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const oEmbedRes = await axios.get(oEmbedUrl);
      if (oEmbedRes.data && oEmbedRes.data.title) {
        title = oEmbedRes.data.title;
      }
    } catch (error) {
      console.warn('Failed to fetch YouTube title via oEmbed:', error);
    }

    // 2. Fetch Duration using YouTube Data API if API Key is provided
    if (apiKey) {
      try {
        const dataApiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=contentDetails`;
        const dataRes = await axios.get(dataApiUrl);
        if (dataRes.data.items && dataRes.data.items.length > 0) {
          const isoDuration = dataRes.data.items[0].contentDetails.duration;
          // Parse ISO 8601 duration (e.g., PT15M33S)
          duration = this.parseISODuration(isoDuration);
        }
      } catch (error) {
        console.warn('Failed to fetch YouTube duration via Data API:', error);
      }
    }

    return { title, duration };
  },

  // Helper to parse ISO 8601 duration to seconds
  parseISODuration(isoDuration: string): number {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = isoDuration.match(regex);
    if (!matches) return 0;

    const hours = parseInt(matches[1] || '0');
    const minutes = parseInt(matches[2] || '0');
    const seconds = parseInt(matches[3] || '0');

    return hours * 3600 + minutes * 60 + seconds;
  },

  // Helper function to sort videos by order_index
  sortVideosByOrder(videos: Video[]): Video[] {
    return [...videos].sort((a, b) => {
      // Handle null order_index by putting them at the end
      if (a.order_index === null && b.order_index === null) return 0;
      if (a.order_index === null) return 1;
      if (b.order_index === null) return -1;
      return a.order_index - b.order_index;
    });
  },

  // Helper function to search videos by title or description
  searchVideos(videos: Video[], searchTerm: string): Video[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return videos;
    }

    const term = searchTerm.toLowerCase().trim();
    return videos.filter(video =>
      (video.title && video.title.toLowerCase().includes(term)) ||
      (video.description && video.description.toLowerCase().includes(term))
    );
  },

  // Helper function to get total duration of videos
  getTotalDuration(videos: Video[]): number {
    return videos.reduce((total, video) => total + (video.duration || 0), 0);
  },

  // Helper function to get video statistics (would need backend implementation)
  async getVideoStats(): Promise<any> {
    // This would require a backend endpoint for video statistics
    // For now, return a placeholder
    try {
      // Example: const response = await api.get('/videos/stats', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // return response.data;

      // Placeholder implementation
      return {
        success: true,
        stats: {
          totalVideos: 0,
          totalDuration: 0,
          averageDuration: 0,
          videosByCourse: {}
        }
      };
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get video statistics' };
    }
  },
};

export default videoService;