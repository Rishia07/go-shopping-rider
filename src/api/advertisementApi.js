import axios from "../config/axiosConfig";

const API_KEY = process.env.EXPO_PUBLIC_BACKEND_API_KEY;
const fetchAdvertisementsURL = `${API_KEY}/api/advertisements`;

export const fetchAdvertisements = async () => {
  const { data } = await axios.get(fetchAdvertisementsURL);
  return data;
};

export const createAdvertisement = async (newAdvertisement) => {
  const { data } = await axios.post(fetchAdvertisementsURL, newAdvertisement);
  return data;
};

export const updateAdvertisement = async ({ id, updatedAdvertisement }) => {
  const { data } = await axios.put(
    `${fetchAdvertisementsURL}/${id}`,
    updatedAdvertisement
  );
  return data;
};

export const deleteAdvertisement = async (id) => {
  const { data } = await axios.delete(`${fetchAdvertisementsURL}/${id}`);
  return data;
};
