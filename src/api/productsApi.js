import axios from "../config/axiosConfig";

const API_KEY = import.meta.env.VITE_BACKEND_API_KEY;
const fetchProductsURL = `${API_KEY}/api/products`;

export const fetchProducts = async () => {
  const { data } = await axios.get(fetchProductsURL);
  return data;
};

export const createProduct = async (newProduct) => {
  const { data } = await axios.post(fetchProductsURL, newProduct);
  return data;
};

export const updateProduct = async ({ id, updatedProduct }) => {
  const { data } = await axios.put(`${fetchProductsURL}/${id}`, updatedProduct);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await axios.delete(`${fetchProductsURL}/${id}`);
  return data;
};
