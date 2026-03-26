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
        // Log detailed error information for debugging
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
        });

        if (error.response) {
            const message = error.response.data?.message || 'An error occurred';

            // Handle authentication errors
            if (error.response.status === 401) {
                // Only redirect if not already on login or register page
                const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
                if (!isAuthPage) {
                    toast.error('Session expired. Please login again.');
                    window.location.href = '/login';
                } else {
                    // Show error on auth pages without redirecting
                    toast.error(message);
                }
            } else if (error.response.status === 429) {
                // Rate limit error
                toast.error('Too many attempts. Please try again later.');
            } else {
                toast.error(message);
            }
        } else if (error.request) {
            // Network error - backend might not be running
            console.error('Network error - is the backend server running?');
            toast.error('Cannot connect to server. Please ensure the backend is running on http://localhost:5000');
        } else {
            toast.error('An unexpected error occurred.');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
