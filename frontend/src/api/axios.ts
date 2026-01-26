import axios from 'axios';
import toast from 'react-hot-toast';
import API_URL from '../config/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const message = error.response.data?.message || 'An error occurred';

            // Handle authentication errors
            if (error.response.status === 401) {
                // Only redirect if not already on login or register page
                const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
                if (!isAuthPage) {
                    toast.error('Session expired. Please login again.');
                    window.location.href = '/login';
                }
            } else {
                toast.error(message);
            }
        } else if (error.request) {
            toast.error('Network error. Please check your connection.');
        } else {
            toast.error('An unexpected error occurred.');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
