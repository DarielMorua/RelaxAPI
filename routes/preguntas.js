var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var privateKey;
var preguntasController = require("../controllers/preguntas.controllers");
const payload = {
  name: "Jane Doe",
  profile: "GUEST",
  exp: Math.floor(Date.now() / 1000) + 60 * 60,
};

router.post(
  "/crear-pregunta",
  preguntasController.verifyToken,
  preguntasController.createPregunta
);

router.post(
  "/mostrar-preguntas",
  preguntasController.verifyToken,
  preguntasController.getPreguntas
);

router.post(
  "/mostrar-pregunta",
  preguntasController.verifyToken,
  preguntasController.getPreguntaById
);

router.post(
  "/actualizar-pregunta",
  preguntasController.verifyToken,
  preguntasController.updatePregunta
);

router.post(
  "/borrar-pregunta",
  preguntasController.verifyToken,
  preguntasController.deletePregunta
);

module.exports = router;
