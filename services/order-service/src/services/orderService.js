const pool =
require("../config/db");

const axios = require("axios");
const createOrder =
async ({ user_id, items }) => {

  if (
    !user_id ||
    !items ||
    items.length === 0
  ) {
    throw new Error(
      "User and items are required"
    );
  }

  let totalAmount = 0;

  items.forEach(item => {

    totalAmount +=
      item.price * item.quantity;

  });

  const orderResult =
  await pool.query(
    `
    INSERT INTO orders
    (
      user_id,
      total_amount
    )
    VALUES ($1,$2)
    RETURNING *
    `,
    [
      user_id,
      totalAmount
    ]
  );

  const order =
  orderResult.rows[0];

  for (const item of items) {

    await pool.query(
      `
      INSERT INTO order_items
      (
        order_id,
        product_id,
        quantity,
        price
      )
      VALUES
      ($1,$2,$3,$4)
      `,
      [
        order.id,
        item.product_id,
        item.quantity,
        item.price
      ]
    );

  }

//   await createNotification(
//   user_id,

//   `Your order #${order.id} has been placed successfully`
// );

await axios.post("http://notification-service:5005/api/notifications",{
  user_id,
  type: "ORDER",
  message: `Your order #${order.id} has been placed successfully`,
  order_id: order.id
});
  return {
    success: true,
    message:
      "Order created successfully",
    data: order
  };

};

const getOrders =
async () => {

  const result =
  await pool.query(
    `
    SELECT *
    FROM orders
    ORDER BY id DESC
    `
  );

  return {
    success: true,
    data: result.rows
  };

};

const getOrderById =
async (id) => {

  const order =
  await pool.query(
    `
    SELECT *
    FROM orders
    WHERE id = $1
    `,
    [id]
  );

  if (
    order.rows.length === 0
  ) {
    throw new Error(
      "Order not found"
    );
  }

  const items =
  await pool.query(
    `
    SELECT *
    FROM order_items
    WHERE order_id = $1
    `,
    [id]
  );

  return {
    success: true,
    data: {
      order: order.rows[0],
      items: items.rows
    }
  };

};

const updateOrderStatus =
async (
  id,
  status
) => {

  const result =
  await pool.query(
    `
    UPDATE orders
    SET status = $1
    WHERE id = $2
    RETURNING *
    `,
    [
      status,
      id
    ]
  );

  if (
    result.rows.length === 0
  ) {
    throw new Error(
      "Order not found"
    );
  }

  const order =
    result.rows[0];

  if (status === "SHIPPED") {

    await axios.post(
      "http://notification-service:5005/api/notifications",
      {
        user_id: order.user_id,
        type: "ORDER",
        message:
          `Your order #${order.id} has been shipped successfully`,
        order_id: order.id
      }
    );

  }

  if (status === "DELIVERED") {

    await axios.post(
      "http://notification-service:5005/api/notifications",
      {
        user_id: order.user_id,
        type: "ORDER",
        message:
          `Your order #${order.id} has been delivered successfully`,
        order_id: order.id
      }
    );

  }

  return {
    success: true,
    message:
      "Order status updated",
    data: order
  };

};





module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  
};