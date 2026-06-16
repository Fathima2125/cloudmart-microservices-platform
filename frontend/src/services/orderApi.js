import axios from "axios";

const API = axios.create({
  baseURL:
    "http://localhost:5003/api/v1/orders"
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