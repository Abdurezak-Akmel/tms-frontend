import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/projects";

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Types for project data
export interface CreateProjectData {
    title: string;
    description?: string;
    category?: string;
    level?: string;
}

export interface UpdateProjectData {
    title?: string;
    description?: string;
    category?: string;
    level?: string;
}

export interface Project {
    project_id: number;
    title: string;
    description: string | null;
    category: string | null;
    level: string | null;
    created_at: string;
}

export interface ProjectResponse {
    success: boolean;
    message?: string;
    project?: Project;
    projects?: Project[];
    error?: string;
}

// Project service functions
export const projectService = {
    // Admin: create project
    async createProject(projectData: CreateProjectData): Promise<ProjectResponse> {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await api.post('/create-project', projectData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to create project' };
        }
    },

    // User: get all projects
    async getAllProjects(): Promise<ProjectResponse> {
        try {
            const response = await api.get('/get-all-projects');
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to get all projects' };
        }
    },

    // User: get project by ID
    async getProjectById(id: number): Promise<ProjectResponse> {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await api.get(`/get-project/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to get project' };
        }
    },

    // Admin: update project
    async updateProject(id: number, updateData: UpdateProjectData): Promise<ProjectResponse> {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await api.put(`/update-project/${id}`, updateData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to update project' };
        }
    },

    // Admin: delete project
    async deleteProject(id: number): Promise<ProjectResponse> {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await api.delete(`/delete-project/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to delete project' };
        }
    },

    // Helper function to validate project data
    validateProjectData(projectData: CreateProjectData | UpdateProjectData): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if ('title' in projectData) {
            if (!projectData.title || projectData.title.trim() === '') {
                errors.push('Title is required');
            } else if (typeof projectData.title !== 'string') {
                errors.push('Title must be a string');
            } else if (projectData.title.trim().length < 3) {
                errors.push('Title must be at least 3 characters long');
            } else if (projectData.title.trim().length > 255) {
                errors.push('Title must be less than 255 characters');
            }
        }

        if ('description' in projectData && projectData.description) {
            if (typeof projectData.description !== 'string') {
                errors.push('Description must be a string');
            }
        }

        if ('category' in projectData && projectData.category) {
            if (typeof projectData.category !== 'string') {
                errors.push('Category must be a string');
            }
        }

        if ('level' in projectData && projectData.level) {
            const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
            if (typeof projectData.level !== 'string') {
                errors.push('Level must be a string');
            } else if (!validLevels.includes(projectData.level.toLowerCase())) {
                errors.push('Level must be one of: beginner, intermediate, advanced, expert');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Helper function to format project level for display
    formatLevel(level: string | null): string {
        if (!level) return 'Not specified';
        return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
    },
};

export default projectService;
