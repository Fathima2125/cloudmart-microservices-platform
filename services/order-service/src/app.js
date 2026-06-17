const express = require("express");
const cors = require("cors");
require("dotenv").config();

const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/orders", orderRoutes);

const PORT = process.env.PORT || 5003;

app.listen(PORT, "0.0.0.0",() => {
  console.log(`Order Service running on port ${PORT}`);
});