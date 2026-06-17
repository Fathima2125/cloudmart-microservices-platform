import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_ORDER_API_URL
});

export const createOrder = (
  orderData
) =>
  API.post("/", orderData);

export const getOrders = () =>
  API.get("/");

export const getOrderById = (
  id
) =>
  API.get(`/${id}`);