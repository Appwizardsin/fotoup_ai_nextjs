import axios from "axios";

const API_BASE_URL = "https://i23wsqntum.us-east-1.awsapprunner.com/api";
// const API_BASE_URL = "http://localhost:3030/api";

// Create a function to get the API instance with optional token
const createAPI = (token) => {
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return api;
};

// Helper to safely access localStorage (only in browser)
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Create a server-side safe API instance for public endpoints
const publicAPI = createAPI();

export const auth = {
  register: async (userData) => {
    const response = await publicAPI.post("/auth/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await publicAPI.post("/auth/login", credentials);
    return response.data;
  },

  googleLogin: async (token) => {
    const response = await publicAPI.post("/auth/google", { token });
    return response.data;
  },
};

export const models = {
  getAll: async (params) => {
    const api = createAPI(getToken());
    const response = await api.get("/models", { params });
    return response.data;
  },

  getSingle: async (modelId) => {
    const api = createAPI(getToken());
    const response = await api.get(`/models/${modelId}`);
    return response.data;
  },

  run: async (data) => {
    const api = createAPI(getToken());
    const response = await api.post("/models/run", data);
    return response.data;
  },
};

export const users = {
  getProfile: async () => {
    const api = createAPI(getToken());
    const response = await api.get("/users/profile");
    return response.data;
  },

  updateProfile: async (userData) => {
    const api = createAPI(getToken());
    const response = await api.put("/users/profile", userData);
    return response.data;
  },

  cancelSubscription: async () => {
    const api = createAPI(getToken());
    const response = await api.delete(`/users/subscription`);
    return response.data;
  },

  upgradePlan: async (planId, billingCycle) => {
    const api = createAPI(getToken());
    const response = await api.post(`/users/subscription/upgrade`, {
      planId,
      billingCycle,
    });
    return response.data;
  },

  downgradePlan: async (planId, billingCycle) => {
    const api = createAPI(getToken());
    const response = await api.post(`/users/subscription/downgrade`, {
      planId,
      billingCycle,
    });
    return response.data;
  },

  getUsageHistory: async () => {
    const api = createAPI(getToken());
    const response = await api.get("/users/usage");
    return response.data;
  },

  getSubscription: async () => {
    const api = createAPI(getToken());
    const response = await api.get("/users/subscription");
    return response.data;
  },

  getUserImages: async (page = 1, limit = 20, source = "all") => {
    const api = createAPI(getToken());
    const response = await api.get(
      `/users/user-images?page=${page}&limit=${limit}&source=${source}`
    );
    return response.data;
  },
};

export const plans = {
  getAll: async () => {
    const api = createAPI(getToken());
    const response = await api.get("/plans");
    return response.data;
  },
};

export const home = {
  get: async () => {
    const response = await publicAPI.get("/home");
    return response.data;
  },
};

export const media = {
  upload: async (file) => {
    const api = createAPI(getToken());
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post("/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default createAPI(getToken());
