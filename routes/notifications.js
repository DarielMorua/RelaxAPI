var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var notificationsController = require("../controllers/notifications.controllers");

router.post(
  "/crear-notificacion",
  notificationsController.verifyToken,
  notificationsController.createNotification
);

router.post(
  "/mostrar-notificaciones",
  notificationsController.verifyToken,
  notificationsController.getNotifications
);

router.post(
  "/mostrar-notificacion",
  notificationsController.verifyToken,
  notificationsController.getNotificationById
);

router.post(
  "/actualizar-notificacion",
  notificationsController.verifyToken,
  notificationsController.updateNotification
);

router.post(
  "/borrar-notificacion",
  notificationsController.verifyToken,
  notificationsController.deleteNotification
);

module.exports = router;
