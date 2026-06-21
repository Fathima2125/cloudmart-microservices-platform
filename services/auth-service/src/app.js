const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);



app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "auth-service"
  });
});


const PORT = process.env.PORT || 5001;

app.listen(PORT,"0.0.0.0", () => {
    console.log(`Auth Service running pn port ${PORT}`);

});
