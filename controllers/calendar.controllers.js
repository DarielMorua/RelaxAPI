var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var User = require("../models/users.models");
const jwt = require("jsonwebtoken");
const Emotion = require("../models/emotion.model");
const privateKey = process.env.SECRET_KEY;

async function createCalendar(req, res) {
  try {
    const { userId } = req.body;
    const calendarData = { ...req.body, userId }; // Añadimos el userId al calendario
    const createCalendar = await Calendar.create(calendarData); // Creamos el calendario
    res.status(200).json(createCalendar);
  } catch (error) {
    res.status(400).json({ "Error al crear calendario": error.message });
  }
}

async function getCalendar(req, res) {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "El userId es requerido" });
    }

    const calendars = await Calendar.find({ userId }); // Buscamos los calendarios por userId
    if (calendars.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron calendarios para este usuario" });
    }
    res.status(200).json(calendars);
  } catch (error) {
    res.status(400).json({ "Error al obtener calendario": error.message });
  }
}

async function deleteCalendar(req, res) {
  try {
    const { userId, calendarId } = req.body; // Tomamos el userId y el calendarId desde el body
    if (!userId || !calendarId) {
      return res
        .status(400)
        .json({ error: "El userId y calendarId son requeridos" });
    }

    const calendar = await Calendar.findOneAndDelete({
      userId,
      _id: calendarId,
    });
    if (!calendar) {
      return res
        .status(404)
        .json({ error: "Calendario no encontrado para este usuario" });
    }
    res.status(200).json({ message: "Calendario eliminado" });
  } catch (error) {
    res.status(400).json({ "Error al eliminar calendario": error.message });
  }
}

async function updateCalendar(req, res) {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "El userId es requerido" });
    }
    const calendar = await Calendar.findOneAndUpdate({ userId }, req.body, {
      new: true,
    });
    if (!calendar) {
      return res
        .status(404)
        .json({ error: "Calendario no encontrado para este usuario" });
    }
    res.status(200).json(calendar);
  } catch (error) {
    res.status(400).json({ "Error al actualizar calendario": error.message });
  }
}

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

module.exports = {
  createCalendar,
  getCalendar,
  deleteCalendar,
  updateCalendar,
  verifyToken,
};
