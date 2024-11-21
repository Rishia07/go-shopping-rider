import axios from "../config/axiosConfig";
import * as SecureStore from "expo-secure-store";

const API_KEY = process.env.EXPO_PUBLIC_BACKEND_API_KEY;
const fetchOrdersURL = `${API_KEY}/api/orders`;

export const fetchOrders = async () => {
  const { data } = await axios.get(fetchOrdersURL);
  return data;
};

export const getTodaysOrderCountForRider = async () => {
  const userId = await getUserIdFromSecureStore();
  const { data } = await axios.get(`${fetchOrdersURL}/${userId}/orders/today`);
  return data;
};


export const createOrder = async (newOrder) => {
  const { data } = await axios.post(fetchOrdersURL, newOrder);
  return data;
};

export const getOrderById = async ({ id }) => {
  const { data } = await axios.get(`${fetchOrdersURL}/${id}`);
  return data;
};

export const updateOrder = async ({ id, status }) => {
  try {
    const updatedData = await getUpdatedOrderData(id, status);
    const { data } = await axios.put(`${fetchOrdersURL}/${id}`, updatedData);
    return data;
  } catch (error) {
    throw new Error(`Failed to update order: ${error.message}`);
  }
};

const getUpdatedOrderData = async (id, status) => {
  const updatedData = { status };

  if (status === "To Ship") {
    const userId = await getUserIdFromSecureStore();
    updatedData.rider = userId; 
  }

  return updatedData; 
};

const getUserIdFromSecureStore = async () => {
  const userId = await SecureStore.getItemAsync("userId");
  if (!userId) throw new Error("No rider ID found in SecureStore");
  return userId;
};

export const deleteOrder = async (id) => {
  const { data } = await axios.delete(`${fetchOrdersURL}/${id}`);
  return data;
};
