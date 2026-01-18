import axios from './axios';
import {
    Application,
    ApplicationFilters,
    PaginatedResponse,
    ApiResponse,
    Interaction,
} from '../types';

export const applicationsApi = {
    getAll: async (filters?: ApplicationFilters): Promise<PaginatedResponse<Application>> => {
        const { data } = await axios.get<PaginatedResponse<Application>>('/applications', {
            params: filters,
        });
        return data;
    },

    getById: async (id: string): Promise<Application> => {
        const { data } = await axios.get<ApiResponse<Application>>(`/applications/${id}`);
        return data.data;
    },

    create: async (application: Partial<Application>): Promise<Application> => {
        const { data } = await axios.post<ApiResponse<Application>>('/applications', application);
        return data.data;
    },

    update: async (id: string, application: Partial<Application>): Promise<Application> => {
        const { data } = await axios.put<ApiResponse<Application>>(`/applications/${id}`, application);
        return data.data;
    },

    delete: async (id: string): Promise<void> => {
        await axios.delete(`/applications/${id}`);
    },

    getFollowUps: async (): Promise<Application[]> => {
        const { data } = await axios.get<ApiResponse<Application[]>>('/applications/follow-ups');
        return data.data;
    },

    exportCSV: async (): Promise<Blob> => {
        const { data } = await axios.get('/applications/export', {
            responseType: 'blob',
        });
        return data;
    },

    importCSV: async (file: File): Promise<Application[]> => {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await axios.post<ApiResponse<Application[]>>('/applications/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data.data;
    },

    addInteraction: async (id: string, interaction: Omit<Interaction, '_id'>): Promise<Application> => {
        const { data } = await axios.post<ApiResponse<Application>>(
            `/applications/${id}/interactions`,
            interaction
        );
        return data.data;
    },
};
