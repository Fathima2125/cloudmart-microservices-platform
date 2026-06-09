const pool =
require("../config/db");

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

  return {
    success: true,
    message:
      "Order status updated",
    data: result.rows[0]
  };

};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
};