var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var exercisesController = require("../controllers/exercises.controllers");

router.post(
  "/crear-ejercicio",
  exercisesController.verifyToken,
  exercisesController.createExercise
);

router.post(
  "/mostrar-ejercicios",
  exercisesController.verifyToken,
  exercisesController.getExercises
);

router.post(
  "/mostrar-ejercicio",
  exercisesController.verifyToken,
  exercisesController.getExerciseById
);

router.post(
  "/actualizar-ejercicio",
  exercisesController.verifyToken,
  exercisesController.updateExercise
);

router.post(
  "/borrar-ejercicio",
  exercisesController.verifyToken,
  exercisesController.deleteExercise
);

router.post(
  "/mostrar-ejercicios-recomendados",
  exercisesController.verifyToken,
  exercisesController.get5Exercises
);

router.post(
  "/mostrar-ejercicios-por-categoria",
  exercisesController.verifyToken,
  exercisesController.getExercisesByCategory
);

module.exports = router;
