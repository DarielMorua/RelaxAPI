var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var userController = require("../controllers/users.controllers");

//obtener usuario por id
router.get("/:id", userController.getUser);

//crear usuario
router.post("/crear", userController.createUser);

//actualizar usuario por id
router.put("/actualizar/:id", userController.updateUser);

//desactivar, no borrar usuario por id
router.post("/eliminar/:id", userController.deleteUser);

module.exports = router;
