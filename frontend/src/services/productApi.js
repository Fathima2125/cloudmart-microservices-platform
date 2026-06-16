import axios from "axios";

const API =
  axios.create({

    baseURL:
      "http://localhost:5002/api/v1/products"

  });

export const getProducts =
  () => API.get("/");

export const getProductById =
  (id) => API.get(`/${id}`);

export const getCategories =
  () => API.get("/categories");