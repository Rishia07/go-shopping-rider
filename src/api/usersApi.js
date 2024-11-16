import axios from "../config/axiosConfig";

const API_KEY = process.env.EXPO_PUBLIC_BACKEND_API_KEY;
const fetchUsersURL = `${API_KEY}/api/users`;

export const fetchUsers = async () => {
  const { data } = await axios.get(fetchUsersURL);
  return data;
};

export const createUser = async (newUser) => {
  const { data } = await axios.post(fetchUsersURL, newUser);
  return data;
};

export const updateUser = async ({ id, updatedUser }) => {
  const { data } = await axios.put(`${fetchUsersURL}/${id}`, updatedUser);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await axios.delete(`${fetchUsersURL}/${id}`);
  return data;
};
