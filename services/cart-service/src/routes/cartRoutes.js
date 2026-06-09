const express = require("express");

const router = express.Router();

const {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem,
  clearCart
} = require(
  "../controllers/cartController"
);

router.post("/", addToCart);

router.get("/:userId", getCart);

router.put("/:itemId", updateCartItem);

router.delete("/:itemId", deleteCartItem);

router.delete(
  "/user/:userId",
  clearCart
);

module.exports = router;