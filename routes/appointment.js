var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var appointmentController = require("../controllers/appointment.controllers");

router.post("/create-appointment", appointmentController.crearCita); 

router.post("/delete-appointment", appointmentController.eliminarCita);

router.post("/appointment-list", appointmentController.listaCitas);

module.exports = router;
