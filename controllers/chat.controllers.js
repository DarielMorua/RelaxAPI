var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var User = require("../models/users.models");
var Professional = require("../models/professional.model"); // Importación corregida
var Chat = require("../models/chat.model");
var jwt = require("jsonwebtoken");

const privateKey = process.env.SECRET_KEY;
async function createChat(req, res) {
  try {
    const { userId, professionalId } = req.body;

    // buscar al usuario y al profesional
    const user = await User.findById(userId);
    const professional = await User.findById(professionalId);

    if (!user || !professional) {
      return res
        .status(404)
        .json({ message: "Usuario o profesional no encontrado" });
    }

    // verificar que el usuario tenga el rol "User" y "Profesional"
    if (user.rol !== "User") {
      return res.status(400).json({
        message: "Solo los usuarios con rol 'User' pueden iniciar un chat",
      });
    }

    if (professional.rol !== "Profesional") {
      return res
        .status(400)
        .json({ message: "El destinatario debe ser un profesional" });
    }

    // crear y guardar el nuevo chat
    const newChat = new Chat({
      user: userId,
      professional: professionalId,
    });

    await newChat.save();

    res.status(200).json({
      message: "Chat creado con éxito",
      chat: newChat,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error al crear chat",
      error: error.message,
    });
  }
}
async function sendMessage(req, res) {
  try {
    const { chatId, senderId, senderModel, content } = req.body;

    if (!content) {
      return res
        .status(400)
        .json({ message: "El mensaje no puede estar vacío" });
    }

    // validar si el chatId tiene el formato correcto por error en AndroidStudio
    if (!/^[a-fA-F0-9]{24}$/.test(chatId)) {
      return res.status(400).json({
        message: "El chatId debe ser una cadena de 24 caracteres hexadecimales",
      });
    }

    // convertir chatId a ObjectId correctamente
    const chatObjectId = new mongoose.Types.ObjectId(chatId);

    // buscar el chat por su ObjectId
    const chat = await Chat.findById(chatObjectId);

    if (!chat) {
      return res.status(404).json({ message: "Chat no encontrado" });
    }

    // verificar tenga rol "User"
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // agregar el mensaje al array de mensajes
    chat.messages.push({
      sender: senderId,
      senderModel: senderModel,
      content: content,
      timestamp: new Date(),
    });

    // actualizar la fecha de la ultima actualizacion
    chat.lastUpdated = new Date();

    await chat.save();

    res.status(200).json({
      message: "Mensaje enviado con éxito",
      chat: chat,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error al enviar mensaje",
      error: error.message,
    });
  }
}

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ message: "Token no proporcionado" });
  }

  const tokenParts = authHeader.split(" ");
  if (tokenParts.length === 2) {
    const authToken = tokenParts[1];
    try {
      jwt.verify(authToken, privateKey);
      next();
    } catch (error) {
      return res.status(403).json({ message: "Token inválido" });
    }
  } else {
    return res.status(400).json({ message: "Formato de token inválido" });
  }
}

async function showChat(req, res) {
  try {
    const { chatId } = req.body;

    const chat = await Chat.findById(chatId)
      .populate("user", "name")
      .populate("professional", "name")
      .exec();

    if (!chat) {
      return res.status(404).json({ message: "Chat no encontrado" });
    }

    res.status(200).json({ chat });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al mostrar chat", error: error.message });
  }
}

async function getChatByIdProfesional(req, res) {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (user.rol === "Profesional") {
      const chat = await Chat.find({ professional: userId })
        .populate("user", "name")
        .populate("professional", "name")
        .exec();

      if (!chat) {
        return res.status(404).json({ message: "Chat no encontrado" });
      }

      res.status(200).json({ chat });
    } else {
      return res.status(400).json({ message: "No es un profesional" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al mostrar chat", error: error.message });
  }
}

module.exports = {
  createChat,
  sendMessage,
  verifyToken,
  showChat,
  getChatByIdProfesional,
};
