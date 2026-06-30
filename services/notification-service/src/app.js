const express = require("express");
const cors = require("cors");

require("dotenv").config();

const notificationRoutes =
require("./routes/notificationRoutes");
const {
  startSqsConsumer
} = require("./services/sqsConsumer");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/api/notifications",
  notificationRoutes
);



app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "notification-service"
  });
});

const PORT =
process.env.PORT || 5005;

app.listen(PORT,"0.0.0.0", () => {
  console.log(
    `Notification Service running on port ${PORT}`
  );
  startSqsConsumer();
});
