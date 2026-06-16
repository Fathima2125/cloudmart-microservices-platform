import {
  useContext
} from "react";

import "../styles/Checkout.css";

import {
  CartContext
} from "../context/cartContextValue";

import {
  createOrder
} from "../services/orderApi";

import {
  clearCart
} from "../services/cartApi";

import {
  useNavigate
} from "react-router-dom";

function Checkout() {

  const {
    cartItems,
    setCartItems
  } =
  useContext(CartContext);

  const navigate =
    useNavigate();

  const totalAmount =
    cartItems.reduce(
      (
        total,
        item
      ) =>
        total +
        (
          Number(item.price) *
          Number(item.quantity)
        ),
      0
    );

  const handlePlaceOrder =
    async () => {

      try {

        const user =
          JSON.parse(
            localStorage.getItem(
              "user"
            )
          );

          console.log({
                user_id: user.id,
                total_amount: totalAmount
            });
            await createOrder({

                user_id:
                 user.id,

            items:
                cartItems

            });     

        await clearCart(
          user.id
        );

        setCartItems([]);

        alert(
          "Order placed successfully"
        );

        navigate(
          "/orders"
        );

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <section className="checkout-page page-container">

      <div className="page-header">
        <span className="eyebrow">Secure checkout</span>
        <h1>
          Checkout
        </h1>
        <p>Confirm your CloudMart order details before placing the order.</p>
      </div>

      <div className="checkout-layout">
        <div className="checkout-list">

      {
        cartItems.map(
          (item) => (

            <div
              key={item.id}
              className="checkout-card"
            >

              <div>
                <h4>
                  {item.product_name}
                </h4>

                <p>
                  Qty: {item.quantity}
                </p>
              </div>

              <strong>
                AED {Number(item.price).toFixed(2)}
              </strong>

            </div>

          )
        )
      }

        </div>

        <aside className="checkout-summary">
          <span>Order total</span>
          <h3 className="checkout-total" >

            AED {totalAmount.toFixed(
              2
            )}

          </h3>

          <button
            onClick={
              handlePlaceOrder
            }
            disabled={cartItems.length === 0}
          >

            Place Order

          </button>
        </aside>
      </div>

    </section>

  );

}

export default Checkout;
