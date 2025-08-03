import axios from "axios";

// Determine the backend URL based on the environment
const backendUrl = import.meta.env.PROD 
    ? import.meta.env.VITE_API_URL  // In Production (on Vercel), use the live URL
    : 'http://localhost:2000';      // In Development (on your machine), use localhost

const axiosClient = axios.create({
    baseURL: backendUrl,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosClient;
