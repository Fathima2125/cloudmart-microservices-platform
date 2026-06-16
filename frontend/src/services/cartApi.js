import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5004/api/v1/cart",
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