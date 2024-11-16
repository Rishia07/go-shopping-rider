import axios from "../config/axiosConfig";
import * as SecureStore from "expo-secure-store";

const API_KEY = process.env.EXPO_PUBLIC_BACKEND_API_KEY;
const fetchRidersURL = `${API_KEY}/api/riders`;

export const fetchCurrentUser = async () => {
  const id = await SecureStore.getItemAsync("userId");
  if (!id) throw new Error("No rider ID found in SecureStore");
  const { data } = await axios.get(`${fetchRidersURL}/${id}`);
  return data;
};

export const fetchDelivery = async () => {
  const id = await SecureStore.getItemAsync("userId");
  if (!id) throw new Error("No rider ID found in SecureStore");
  const { data } = await axios.get(`${fetchRidersURL}/orders/${id}`);
  return data;
};

export const editInfo = async (updatedRider) => {
  const id = await SecureStore.getItemAsync("userId");
  if (!id) throw new Error("No rider ID found in SecureStore");
  const { data } = await axios.put(`${fetchRidersURL}/${id}`, updatedRider);
  return data;
};

export const changePassword = async (updatedPassword) => {
  const id = await SecureStore.getItemAsync("userId");
  if (!id) throw new Error("No rider ID found in SecureStore");
  await axios.put(`${fetchRidersURL}/${id}/change-password`, updatedPassword);
};
