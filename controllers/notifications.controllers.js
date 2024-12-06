var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
const privateKey = process.env.SECRET_KEY;

var Notifications = require("../models/notifications.model");

const payload = {
  name: "Jane Doe",
  profile: "GUEST",
  exp: Math.floor(Date.now() / 1000) + 60 * 60,
};

async function createNotification(req, res) {
  try {
    const { title, message, date } = req.body;
    const newNotification = new Notifications({
      title,
      message,
      date,
    });
    await newNotification.save();
    res.status(201).json({ message: "Notificación creada con éxito" });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la notificación",
      error: error.message,
    });
  }
}
async function getNotifications(req, res) {
  try {
    const notifications = await Notifications.aggregate([
      {
        $sort: { date: -1 }, // Ordena las notificaciones por la fecha de forma descendente
      },
      {
        $project: {
          title: 1,
          message: 1,
          date: 1,
          seen: 1,
        },
      },
    ]);

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las notificaciones",
      error: error.message,
    });
  }
}

async function getNotification(req, res) {
  try {
    const { id } = req.body;
    const notification = await Notifications.findById(id);
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la notificación",
      error: error.message,
    });
  }
}

async function updateNotification(req, res) {
  try {
    const { id, title, message, date, seen } = req.body;
    await Notifications.findByIdAndUpdate(id, { title, message, date, seen });
    res.status(200).json({ message: "Notificación actualizada con éxito" });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la notificación",
      error: error.message,
    });
  }
}

async function deleteNotification(req, res) {
  try {
    const { id } = req.body;

    // Validar que el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }

    // Verificar si la notificación existe
    const notification = await Notifications.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }

    // Eliminar la notificación
    await Notifications.findByIdAndDelete(id);

    res.status(200).json({ message: "Notificación eliminada con éxito" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la notificación",
      error: error.message,
    });
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
  createNotification,
  getNotifications,
  getNotification,
  updateNotification,
  deleteNotification,
  verifyToken,
};
