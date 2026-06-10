const pool =
require("../config/db");

const createNotification =
async ({
  user_id,
  type,
  message
}) => {

  if (
    !user_id ||
    !type ||
    !message
  ) {
    throw new Error(
      "All fields are required"
    );
  }

  const result =
  await pool.query(
    `
    INSERT INTO notifications
    (
      user_id,
      type,
      message
    )
    VALUES ($1,$2,$3)
    RETURNING *
    `,
    [
      user_id,
      type,
      message
    ]
  );

  console.log(
    `Notification Sent: ${message}`
  );

  return {
    success: true,
    message:
      "Notification created",
    data: result.rows[0]
  };

};

const getNotifications =
async () => {

  const result =
  await pool.query(
    `
    SELECT *
    FROM notifications
    ORDER BY id DESC
    `
  );

  return {
    success: true,
    data: result.rows
  };

};

const getNotificationById =
async (id) => {

  const result =
  await pool.query(
    `
    SELECT *
    FROM notifications
    WHERE id = $1
    `,
    [id]
  );

  if (
    result.rows.length === 0
  ) {
    throw new Error(
      "Notification not found"
    );
  }

  return {
    success: true,
    data: result.rows[0]
  };

};

const deleteNotification =
async (id) => {

  const result =
  await pool.query(
    `
    DELETE FROM notifications
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  if (
    result.rows.length === 0
  ) {
    throw new Error(
      "Notification not found"
    );
  }

  return {
    success: true,
    message:
      "Notification deleted"
  };

};

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  deleteNotification
};


