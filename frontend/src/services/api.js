import axios from "axios";

// Base API URL configured via Vite environment variable or default live Render backend
const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  "https://smart-student-placement-portal.onrender.com";
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "").replace(/\/api$/, "");

// Create Axios Instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT Bearer Token if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized / Expired Tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and user if unauthorized
      const currentPath = window.location.pathname;
      if (
        currentPath !== "/login" &&
        currentPath !== "/register" &&
        currentPath !== "/"
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ==========================================
// Authentication API
// ==========================================
export const authAPI = {
  login: async (credentials) => {
    const res = await api.post("/api/auth/login", credentials);
    if (res.data && res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  register: async (userData) => {
    const res = await api.post("/api/auth/register", userData);
    return res.data;
  },

  logout: async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (ignore) {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getMe: async () => {
    const res = await api.get("/api/auth/me");
    return res.data;
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken: () => localStorage.getItem("token"),

  isAuthenticated: () => !!localStorage.getItem("token"),

  getUserRole: () => {
    const user = authAPI.getCurrentUser();
    return user?.role || null;
  },
};

// ==========================================
// Jobs API
// ==========================================
export const jobsAPI = {
  getAll: async (params) => {
    const res = await api.get("/api/jobs", { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/api/jobs/${id}`);
    return res.data;
  },

  create: async (jobData) => {
    const res = await api.post("/api/jobs", jobData);
    return res.data;
  },

  update: async (id, jobData) => {
    const res = await api.put(`/api/jobs/${id}`, jobData);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/api/jobs/${id}`);
    return res.data;
  },

  getRecruiterJobs: async () => {
    const res = await api.get("/api/jobs/recruiter/my-jobs");
    return res.data;
  },

  getJobApplications: async (id) => {
    const res = await api.get(`/api/jobs/${id}/applications`);
    return res.data;
  },
};

// ==========================================
// Applications API
// ==========================================
export const applicationsAPI = {
  apply: async (jobId, notes = "") => {
    const res = await api.post("/api/applications", { jobId, notes });
    return res.data;
  },

  getMyApplications: async (params) => {
    const res = await api.get("/api/applications/my", { params });
    return res.data;
  },

  getStats: async () => {
    const res = await api.get("/api/applications/stats");
    return res.data;
  },

  getRecruiterApplicants: async (params) => {
    const res = await api.get("/api/applications/recruiter", { params });
    return res.data;
  },

  updateStatus: async (id, status, notes = "") => {
    const res = await api.patch(`/api/applications/${id}/status`, { status, notes });
    return res.data;
  },
};

// ==========================================
// Student Portal API
// ==========================================
export const studentAPI = {
  getProfile: async () => {
    const res = await api.get("/api/students/profile");
    return res.data;
  },

  updateProfile: async (profileData) => {
    const res = await api.put("/api/students/profile", profileData);
    return res.data;
  },

  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append("resume", file);
    const res = await api.post("/api/students/resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  getRecommendations: async () => {
    const res = await api.get("/api/students/recommendations");
    return res.data;
  },

  getDashboard: async () => {
    const res = await api.get("/api/students/dashboard");
    return res.data;
  },
};

// ==========================================
// Admin Portal API
// ==========================================
export const adminAPI = {
  getStats: async () => {
    const res = await api.get("/api/admin/stats");
    return res.data;
  },

  getUsers: async (params) => {
    const res = await api.get("/api/admin/users", { params });
    return res.data;
  },

  updateUserStatus: async (id, status) => {
    const res = await api.patch(`/api/admin/users/${id}/status`, { status });
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await api.delete(`/api/admin/users/${id}`);
    return res.data;
  },

  getJobs: async () => {
    const res = await api.get("/api/admin/jobs");
    return res.data;
  },

  getApplications: async () => {
    const res = await api.get("/api/admin/applications");
    return res.data;
  },

  getCompanies: async () => {
    const res = await api.get("/api/admin/companies");
    return res.data;
  },
};

// ==========================================
// User Profile API
// ==========================================
export const userAPI = {
  getProfile: async () => {
    const res = await api.get("/api/users/profile");
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await api.put("/api/users/profile", data);
    return res.data;
  },
};

export default api;