const express = require("express");

const router = express.Router();
const {
    getCategories 
} = require("../controllers/productController");


router.get("/", (req, res) => {
  res.send("Get Products Route");
});

router.get("/categories", getCategories);

router.get("/:id", (req, res) => {
  res.send("Get Product By ID Route");
});

module.exports = router;


