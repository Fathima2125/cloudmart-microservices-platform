// const express = require("express");

// const router = express.Router();

// const {
//   createNotification,
//   getNotifications,
//   getNotificationById,
//   deleteNotification,
//   getNotificationsByUser
// } = require(
//   "../controllers/notificationController"
// );

// router.post("/", createNotification);

// router.get("/", getNotifications);

// router.get("/:id", getNotificationById);

// router.delete("/:id", deleteNotification);

// router.get("/user/:userId", getNotificationsByUser);

// module.exports = router;

const express = require("express");
const router = express.Router();

const {
  createNotification,
  getNotificationsByUser,
  getNotificationById,
  deleteNotification
} = require("../controllers/notificationController");

// create
// router.post("/", createNotification);

// // get all OR user-specific (choose one)
// router.get("/", getNotificationsByUser);

// get by user (optional if above not used)
router.get("/user/:userId", getNotificationsByUser);

// // get single notification
// router.get("/:id", getNotificationById);

// router.get("/user/:userId", getNotificationsByUser);

// // delete

// router.delete("/:id", deleteNotification);

router.post("/", createNotification);

// user notifications (IMPORTANT)
router.get("/user/:userId", getNotificationsByUser);

// single notification (admin/debug only)
router.get("/single/:id", getNotificationById);

router.delete("/:id", deleteNotification);


module.exports = router;