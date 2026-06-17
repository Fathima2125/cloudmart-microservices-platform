const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/products", productRoutes);

const PORT = process.env.PORT || 5002;

app.listen(PORT, "0.0.0.0",() => {
  console.log(`Product Service running on port ${PORT}`);
});