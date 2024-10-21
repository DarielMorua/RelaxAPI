var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var professionalController = require("../controllers/professional.controllers");

// Crear profesional
router.post("/crear-profesional", professionalController.createProfessional);

// Mostrar profesional
router.post("/mostrar-profesionales", professionalController.findProfessional);

// Actualizar profesional
router.post(
  "/actualizar-profesional",
  professionalController.updateProfessional
);

// Desactivar profesinal
router.post("/eliminar-profesional", professionalController.deleteProfessional);

// Dar Review
router.post("/give-review", professionalController.giveReview);

module.exports = router;
