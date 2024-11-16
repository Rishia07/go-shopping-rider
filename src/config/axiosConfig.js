import axios from 'axios';
import * as SecureStore from "expo-secure-store";

axios.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token available");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
