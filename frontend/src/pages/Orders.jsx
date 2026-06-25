import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

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

  const [refreshing,
  setRefreshing] =
  useState(false);

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const fetchOrders =
    async ({ silent = false } = {}) => {

      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {

        if (silent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response =
        await getOrders();

        setOrders(
          response.data.data
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
        setRefreshing(false);

      }

    };

  useEffect(() => {

    fetchOrders();

    const handleFocus = () => {
      fetchOrders({ silent: true });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchOrders({ silent: true });
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };

  }, [user?.id]);

  if (loading) {

    return (
      <div className="page-container">
        <h2>
          Loading Orders...
        </h2>
      </div>
    );

  }

  if (!user?.id) {
    return (
      <section className="orders-page page-container">
        <div className="empty-state">
          <h2>Please login first</h2>
          <p>Login to view your private order history.</p>
          <Link to="/login" className="primary-link">
            Login
          </Link>
        </div>
      </section>
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
        <button
          type="button"
          className="refresh-orders-button"
          onClick={() => fetchOrders({ silent: true })}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "Refresh orders"}
        </button>
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
