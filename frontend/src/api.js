import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const analyzeText = async (text, question = null) => {
    try {
        const response = await api.post('/analyze/', { text, question });
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};
