import axios from "../config/axiosConfig";

const API_KEY = process.env.EXPO_PUBLIC_BACKEND_API_KEY;
const fetchRidersURL = `${API_KEY}/api/riders`;

export const fetchRiders = async () => {
  const { data } = await axios.get(fetchRidersURL);
  return data;
};

export const createRider = async (newRider) => {
  const { data } = await axios.post(fetchRidersURL, newRider);
  return data;
};

export const updateRider = async ({ id, updatedRider }) => {
  const { data } = await axios.put(`${fetchRidersURL}/${id}`, updatedRider);
  return data;
};

export const deleteRider = async (id) => {
  const { data } = await axios.delete(`${fetchRidersURL}/${id}`);
  return data;
};

export const changePassword = async ({ id, updatedPassword }) => {
  const { data } = await axios.delete(`${fetchRidersURL}/${id}/change-password`, updatedPassword);
  return data;
};