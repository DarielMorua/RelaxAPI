var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var userController = require("../controllers/users.controllers");

//obtener usuario por id
router.post("/obtener", userController.getUser);

//crear usuario
router.post("/crear", userController.createUser);

//actualizar usuario por id
router.post("/actualizar", userController.updateUser);

//desactivar, no borrar usuario por id
router.post("/eliminar", userController.deleteUser);

module.exports = router;
