var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var professionalController = require("../controllers/professional.controllers");

router.post(
  "/crear-profesional",
  professionalController.verifyToken,
  professionalController.createProfessional
);

router.post(
  "/mostrar-profesional",
  professionalController.verifyToken,
  professionalController.findProfessional
);

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

router.post(
  "/eliminar-profesional",
  professionalController.verifyToken,
  professionalController.deleteProfessional
);

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
