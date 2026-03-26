const API_URL = import.meta.env.VITE_API_URL ||
    (import.meta.env.MODE === 'production'
        ? 'https://job-application-tracker-uqbn.onrender.com/api'
        : 'http://localhost:5000/api');

// Log API URL in development for debugging
if (import.meta.env.DEV) {
    console.log('🔗 API URL:', API_URL);
    console.log('📦 Mode:', import.meta.env.MODE);
    console.log('🔧 VITE_API_URL:', import.meta.env.VITE_API_URL);
}

export default API_URL;
