//CRUD de ejercicios, categoria,  Imagen, titulo, shortDescription, LongDescription, urlVideovar
var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var privateKey = "myprivatekey";
var Exercises = require("../models/exercises.model");
const payload = {
  name: "Jane Doe",
  profile: "GUEST",
  exp: Math.floor(Date.now() / 1000) + 60 * 60,
};

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ message: "Token no proporcionado" });
  }
  let authToken;
  if (authHeader && authHeader.length) {
    const tokenParts = authHeader.split(" ");
    if (tokenParts.length === 2) {
      authToken = tokenParts[1];
      console.log(authToken);
    }
    try {
      await jwt.verify(authToken, privateKey);
      next();
    } catch (error) {
      console.log(error);
      return res.status(403).json({ message: "Token inválido" });
    }
  }
}

async function createExercise(req, res) {
  try {
    const {
      title,
      category,
      image,
      shortDescription,
      longDescription,
      urlVideo,
    } = req.body;
    const newExercise = new Exercises({
      title,
      category,
      image,
      shortDescription,
      longDescription,
      urlVideo,
    });
    await newExercise.save();
    res.status(201).json({ message: "Ejercicio creado con éxito" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el ejercicio", error: error.message });
  }
}

async function getExercises(req, res) {
  try {
    const exercises = await Exercises.find();
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los ejercicios",
      error: error.message,
    });
  }
}
async function getExerciseById(req, res) {
  try {
    const { id } = req.body;
    const exercise = await Exercises.findById(id);
    if (!exercise) {
      return res.status(404).json({ message: "Ejercicio no encontrado" });
    }
    res.status(200).json(exercise);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el ejercicio", error: error.message });
  }
}
async function updateExercise(req, res) {
  try {
    const {
      id,
      title,
      category,
      image,
      shortDescription,
      longDescription,
      urlVideo,
    } = req.body;
    const updatedExercise = await Exercises.findByIdAndUpdate(id, {
      title,
      category,
      image,
      shortDescription,
      longDescription,
      urlVideo,
    });
    if (!updatedExercise) {
      return res.status(404).json({ message: "Ejercicio no encontrado" });
    }
    res.status(200).json({ message: "Ejercicio actualizado con éxito" });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el ejercicio",
      error: error.message,
    });
  }
}
async function deleteExercise(req, res) {
  try {
    const { id } = req.body;
    const deletedExercise = await Exercises.findByIdAndDelete(id);
    if (!deletedExercise) {
      return res.status(404).json({ message: "Ejercicio no encontrado" });
    }
    res.status(200).json({ message: "Ejercicio eliminado con éxito" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el ejercicio",
      error: error.message,
    });
  }
}
module.exports = {
  createExercise,
  getExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
  verifyToken,
};
