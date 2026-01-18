import axios from './axios';
import { AuthResponse, User } from '../types';

export const authApi = {
    register: async (name: string, email: string, password: string): Promise<User> => {
        const { data } = await axios.post<AuthResponse>('/auth/register', {
            name,
            email,
            password,
        });
        return data.data;
    },

    login: async (email: string, password: string): Promise<User> => {
        const { data } = await axios.post<AuthResponse>('/auth/login', {
            email,
            password,
        });
        return data.data;
    },

    logout: async (): Promise<void> => {
        await axios.post('/auth/logout');
    },

    getCurrentUser: async (): Promise<User> => {
        const { data } = await axios.get<AuthResponse>('/auth/me');
        return data.data;
    },
};
