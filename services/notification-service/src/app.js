const express = require("express");
const cors = require("cors");

require("dotenv").config();

const notificationRoutes =
require("./routes/notificationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/api/notifications",
  notificationRoutes
);

const PORT =
process.env.PORT || 5005;

app.listen(PORT,"0.0.0.0", () => {
  console.log(
    `Notification Service running on port ${PORT}`
  );
});