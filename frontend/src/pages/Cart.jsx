import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import "../styles/Cart.css";

import { CartContext } from "../context/cartContextValue";
import {
  getCartByUser,
  updateCartItem,
  deleteCartItem,
} from "../services/cartApi";

function Cart() {
  const { cartItems, setCartItems } = useContext(CartContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) {
        return;
      }

      try {
        const res = await getCartByUser();
        setCartItems(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCart();
  }, [setCartItems, userId]);

  const handleQuantity = async (itemId, quantity) => {
    try {
      const res = await updateCartItem(itemId, { quantity });

      const updatedCart = cartItems.map((item) =>
        item.id === itemId ? res.data.data : item
      );

      setCartItems(updatedCart);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteCartItem(itemId);

      const updatedCart = cartItems.filter(
        (item) => item.id !== itemId
      );

      setCartItems(updatedCart);
    } catch (err) {
      console.log(err);
    }
  };

  const subtotal = cartItems.reduce((total, item) => (
    total + Number(item.price) * Number(item.quantity)
  ), 0);

  return (
    <section className="cart-page page-container">
      <div className="page-header">
        <span className="eyebrow">Shopping bag</span>
        <h1>Your Cart</h1>
        <p>Review quantities before placing your CloudMart order.</p>
      </div>

      {!user ? (
        <div className="empty-state">
          <h2>Please login first</h2>
          <p>Login to view your saved cart and checkout securely.</p>
          <Link to="/login" className="primary-link">
            Login
          </Link>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="empty-state">
          <h2>Cart is empty</h2>
          <p>Explore products and add electronics to your cart.</p>
          <Link to="/products" className="primary-link">
            Shop Products
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {cartItems.map((item) => (
              <article key={item.id} className="cart-card">
                <div>
                  <h3>{item.product_name}</h3>
                  <p>AED {Number(item.price).toFixed(2)}</p>
                </div>

                <div className="cart-actions">
                  <button
                    onClick={() =>
                      handleQuantity(item.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    aria-label={`Decrease ${item.product_name} quantity`}
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      handleQuantity(item.id, item.quantity + 1)
                    }
                    aria-label={`Increase ${item.product_name} quantity`}
                  >
                    +
                  </button>

                  <button onClick={() => handleDelete(item.id)}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <span>Subtotal</span>
            <strong>AED {subtotal.toFixed(2)}</strong>
            <Link to="/checkout" className="checkout-btn">
              Checkout
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}

export default Cart;
