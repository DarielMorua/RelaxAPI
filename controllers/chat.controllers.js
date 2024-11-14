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

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat no encontrado" });
    }

    if (senderModel !== "User" && senderModel !== "Professional") {
      return res.status(400).json({ message: "El remitente no es válido" });
    }

    chat.messages.push({
      sender: senderId,
      senderModel: senderModel,
      content: content,
      timestamp: new Date(),
    });

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

module.exports = {
  createChat,
  sendMessage,
  verifyToken,
  showChat,
};
