var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var userController = require("../controllers/users.controllers");

//obtener usuario por id
router.post("/obtener", userController.verifyToken, userController.getUser);

//crear usuario
router.post("/crear", userController.createUser);

//actualizar usuario por id
router.post(
  "/actualizar",
  userController.verifyToken,
  userController.updateUser
);

//desactivar, no borrar usuario por id
router.post("/eliminar", userController.verifyToken, userController.deleteUser);

router.post("/login", userController.login);

router.post(
  "/mostrar-favoritos",
  userController.verifyToken,
  userController.getFavoritesProfessionals
);

module.exports = router;
