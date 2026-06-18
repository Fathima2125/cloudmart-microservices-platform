import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNotifications } from "../services/notificationApi";

import "../styles/Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!user?.id) {
          setLoading(false);
          return;
        }

        const res = await getNotifications();
        setNotifications(res.data.data || []);
      } catch (err) {
        console.log("ERROR FETCHING NOTIFICATIONS:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  if (loading) {
    return <div className="page-container"><h2>Loading notifications...</h2></div>;
  }

  if (!user?.id) {
    return (
      <section className="notifications-page page-container">
        <div className="empty-state">
          <h2>Please login first</h2>
          <p>Login to view your private notifications.</p>
          <Link to="/login" className="primary-link">
            Login
          </Link>
        </div>
      </section>
    );
  }

return (
  <section className="notifications-page page-container">
    <div className="page-header">
      <span className="eyebrow">Updates</span>
      <h1>Notifications</h1>
      <p>Order and account updates from your CloudMart services.</p>
    </div>

    {notifications.length === 0 ? (
      <div className="empty-state">
        <h2>No notifications</h2>
        <p>New order updates will appear here.</p>
      </div>
    ) : (
      <div className="notifications-list">
        {notifications.map((n) => (
          <article className="notification-card" key={n.id}>
            {n.order_id && (
              <h4>Order #{n.order_id}</h4>
            )}

            <p>{n.message}</p>

            <small>
              Status: {n.status}
            </small>
          </article>
        ))}
      </div>
    )}
  </section>
);
}

export default Notifications;
