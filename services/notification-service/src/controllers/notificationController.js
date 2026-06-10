const notificationService =
require("../services/notificationService");

const createNotification =
async (req, res) => {

  try {

    const result =
    await notificationService.createNotification(
      req.body
    );

    res.status(201).json(result);

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

const getNotifications =
async (req, res) => {

  try {

    const result =
    await notificationService.getNotifications();

    res.status(200).json(result);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

const getNotificationById =
async (req, res) => {

  try {

    const result =
    await notificationService.getNotificationById(
      req.params.id
    );

    res.status(200).json(result);

  } catch (error) {

    res.status(404).json({
      success: false,
      message: error.message
    });

  }

};

const deleteNotification =
async (req, res) => {

  try {

    const result =
    await notificationService.deleteNotification(
      req.params.id
    );

    res.status(200).json(result);

  } catch (error) {

    res.status(404).json({
      success: false,
      message: error.message
    });

  }

};

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  deleteNotification
};