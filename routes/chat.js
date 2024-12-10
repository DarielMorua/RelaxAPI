var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var chatController = require("../controllers/chat.controllers");

router.post(
  "/crear-chat",
  chatController.verifyToken,
  chatController.createChat
);

router.post(
  "/mandar-mensaje",
  chatController.verifyToken,
  chatController.sendMessage
);

router.post(
  "/mostrar-mensajes",
  chatController.verifyToken,
  chatController.showChat
);

router.post(
  "/obtener-chats-profesional",
  chatController.verifyToken,
  chatController.getChatByIdProfesional
);
module.exports = router;
