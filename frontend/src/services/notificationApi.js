import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5005/api/notifications"
});

export const getNotifications = (userId) =>
   API.get(`/user/${userId}`);