import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_CART_API_URL
});

// Add item
export const addToCart = (data) => API.post("/", data);

// Get user cart
export const getCartByUser = (userId) => API.get(`/${userId}`);

// Update quantity
export const updateCartItem = (itemId, data) =>
  API.put(`/${itemId}`, data);

// Delete single item
export const deleteCartItem = (itemId) =>
  API.delete(`/${itemId}`);

// Clear user cart
export const clearCart = (
  userId
) =>
  API.delete(
    `/user/${userId}`
  );