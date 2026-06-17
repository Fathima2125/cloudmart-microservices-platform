import {
  useEffect,
  useState
} from "react";

import {
  getOrders
} from "../services/orderApi";


import "../styles/Orders.css";

function Orders() {

  const [orders,
  setOrders] =
  useState([]);

  const [loading,
  setLoading] =
  useState(true);

  useEffect(() => {

    const fetchOrders =
    async () => {

      try {

        const response =
        await getOrders();

        setOrders(
          response.data.data
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    fetchOrders();

  }, []);

  if (loading) {

    return (
      <div className="page-container">
        <h2>
          Loading Orders...
        </h2>
      </div>
    );

  }

  return (

    <section className="orders-page page-container">

      <div className="page-header">
        <span className="eyebrow">Order history</span>
        <h1>
          My Orders
        </h1>
        <p>Track CloudMart orders created through the checkout flow.</p>
      </div>

      {
        orders.length === 0
        ? (
          <div className="empty-state">
            <h2>No orders found</h2>
            <p>Your placed orders will appear here.</p>
          </div>
        )
        : (
          <div className="orders-list">
            {orders.map(
              (order) => (

                <div
                  key={order.id}
                  className="order-card"
                >

                  <div>
                    <h3>
                      Order #{order.id}
                    </h3>

                    <p>

                      AED {
                        Number(order.total_amount).toFixed(2)
                      }

                    </p>
                  </div>

                  <span className={`status-pill status-${(order.status || "PENDING").toLowerCase()}`}>
                    {
                      order.status || "PENDING"
                    }
                  </span>

                </div>

              )
            )}
          </div>
        )
      }

    </section>

  );

}

export default Orders;
