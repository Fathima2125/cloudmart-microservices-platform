const express = require("express");

const router = express.Router();


const {
    getCategories,
    getProducts,
    getProductById,
    createProduct
} = require("../controllers/productController");




router.get("/", getProducts);

router.get("/categories", getCategories);

router.get("/:id", getProductById);

router.post("/", createProduct);

module.exports = router;


