import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
if (!backendUrl) {
  throw new Error("VITE_BACKEND_URL is not defined");
}

const api = axios.create({
  baseURL: backendUrl,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = token;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export default api;
