import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || '/api';
// const API_URL = '/api';

const getBaseURL = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl && apiUrl.trim()) {
    return apiUrl;
  }
  return "/api";
};

const API_URL = getBaseURL();
// console.log('API Base URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (userData) => api.post("/v1/auth/register", userData),
  login: (credentials) => api.post("/v1/auth/login", credentials),
  getProfile: () => api.get("/v1/auth/profile"),
  updateProfile: (data) => api.put("/v1/auth/profile", data),
  changePassword: (data) => api.put("/v1/auth/change-password", data),
  uploadAvatar: (formData) =>
    api.post("/v1/auth/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteAvatar: () => api.delete("/v1/auth/avatar"),
  uploadResume: (formData) =>
    api.post("/v1/auth/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  downloadResume: (filename) =>
    api.get(`/v1/auth/resume/${filename}`, {
      responseType: "blob",
    }),
  deleteResume: () => api.delete("/v1/auth/resume"),
};

export const applicationApi = {
  getAll: () => api.get("/v1/applications"),
  getOne: (id) => api.get(`/v1/applications/${id}`),
  create: (data) => api.post("/v1/applications", data),
  update: (id, data) => api.put(`/v1/applications/${id}`, data),
  delete: (id) => api.delete(`/v1/applications/${id}`),
  getStats: () => api.get("/v1/applications/stats"),
  search: (query) => api.get(`/v1/applications/search?q=${query}`),
  uploadResume: (id, formData) =>
    api.post(`/v1/applications/${id}/resume`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  uploadCoverLetter: (id, formData) =>
    api.post(`/v1/applications/${id}/cover-letter`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const fileAPI = {
  download: (type, filename) =>
    api.get(`/v1/applications/files/${type}/${filename}`, {
      responseType: "blob",
    }),
  delete: (type, filename) =>
    api.delete(`/v1/applications/files/${type}/${filename}`),
};

// Helper function to get full URL for static files
export const getApiUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (apiUrl && apiUrl.trim()) {
    return apiUrl;
  }

  // For development, return empty string (files will be fetched via /api proxy)
  return "";
};

export default api;
