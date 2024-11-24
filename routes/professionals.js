var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var professionalController = require("../controllers/professional.controllers");

// Crear profesional
router.post(
  "/crear-profesional",
  professionalController.verifyToken,
  professionalController.createProfessional
);

// Mostrar profesional
router.post(
  "/mostrar-profesional",
  professionalController.verifyToken,
  professionalController.findProfessional
);

// Actualizar profesional
router.post(
  "/actualizar-profesional",
  professionalController.verifyToken,
  professionalController.updateProfessional
);

router.post(
  "/mostrar-profesionales",
  professionalController.verifyToken,
  professionalController.showAllProfessionals
);

// Desactivar profesinal
router.post(
  "/eliminar-profesional",
  professionalController.verifyToken,
  professionalController.deleteProfessional
);

// Dar Review
router.post(
  "/give-review",
  professionalController.verifyToken,
  professionalController.giveReview
);

router.post(
  "/mostrar-reviews",
  professionalController.verifyToken,
  professionalController.showReviews
);

module.exports = router;
