var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
const Preguntas = require("../models/preguntas.model");
const privateKey = process.env.SECRET_KEY;

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

async function createPregunta(req, res) {
  try {
    const { titulo, respuesta } = req.body;
    const newPregunta = new Preguntas({
      titulo,
      respuesta,
    });
    await newPregunta.save();
    res.status(201).json({ message: "Pregunta creada con éxito" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la pregunta", error: error.message });
  }
}

async function getPreguntas(req, res) {
  try {
    const preguntas = await Preguntas.find();
    res.status(200).json(preguntas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las preguntas" });
  }
}

async function getPreguntaById(req, res) {
  try {
    const { id } = req.body;
    const pregunta = await Preguntas.findById(id);
    if (!pregunta) {
      return res.status(404).json({ message: "Pregunta no encontrada" });
    }
    res.status(200).json(pregunta);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la pregunta" });
  }
}

async function updatePregunta(req, res) {
  try {
    const { id, titulo, respuesta } = req.body;
    const pregunta = await Preguntas.findById(id);
    if (!pregunta) {
      return res.status(404).json({ message: "Pregunta no encontrada" });
    }
    pregunta.titulo = titulo;
    pregunta.respuesta = respuesta;
    await pregunta.save();
    res.status(200).json({ message: "Pregunta actualizada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la pregunta" });
  }
}

async function deletePregunta(req, res) {
  try {
    const { id } = req.body;
    const pregunta = await Preguntas.findById(id);
    if (!pregunta) {
      return res.status(404).json({ message: "Pregunta no encontrada" });
    }
    await pregunta.delete();
    res.status(200).json({ message: "Pregunta eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la pregunta" });
  }
}

module.exports = {
  createPregunta,
  getPreguntas,
  getPreguntaById,
  updatePregunta,
  deletePregunta,
  verifyToken,
};
