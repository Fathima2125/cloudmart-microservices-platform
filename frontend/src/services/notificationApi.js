import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_NOTIFICATION_API_URL
});

export const getNotifications = (userId) =>
   API.get(`/user/${userId}`);