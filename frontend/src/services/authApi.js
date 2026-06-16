import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api/v1/auth"
});

export const registerUser = (userData) => {
  return API.post("/register", userData);
};

export const loginUser = (userData) => {
  return API.post("/login", userData);
};