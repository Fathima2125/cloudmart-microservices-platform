const express = require("express");

const router = express.Router();


const {
    getCategories,
     getProducts
} = require("../controllers/productController");




router.get("/", getProducts);

router.get("/categories", getCategories);

router.get("/:id", (req, res) => {
  res.send("Get Product By ID Route");
});

module.exports = router;


