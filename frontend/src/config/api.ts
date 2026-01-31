const API_URL = import.meta.env.VITE_API_URL ||
    (import.meta.env.MODE === 'production'
        ? 'https://job-application-tracker-uqbn.onrender.com/api'
        : 'http://localhost:5000/api');

export default API_URL;

