const Emotion = require("../models/emotion.model");
var jwt = require("jsonwebtoken");
const privateKey = process.env.SECRET_KEY;
const mongoose = require("mongoose");
var express = require("express");

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

  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2) {
    return res.status(403).json({ message: "Formato de token inválido" });
  }

  const authToken = tokenParts[1];
  try {
    const decoded = jwt.verify(authToken, privateKey); // Decodifica el token
    req.user = decoded; // Asigna los datos decodificados a req.user
    next(); // Continúa al siguiente middleware o controlador
  } catch (error) {
    console.error("Error al verificar token:", error.message);
    return res.status(403).json({ message: "Token inválido" });
  }
}
async function submitEmotion(req, res) {
  try {
    const { emotion, date } = req.body;

    if (!emotion || !date) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    // Obtén el usuario del token decodificado
    const userId = req.user.id;
    if (!userId) {
      return res.status(403).json({ message: "Usuario no autorizado" });
    }

    const newEmotion = new Emotion({
      userId, // Aquí usamos el id del usuario del token
      emotion,
      date: new Date(date),
    });

    await newEmotion.save();

    res
      .status(201)
      .json({ message: "Emoción guardada exitosamente", emotion: newEmotion });
  } catch (error) {
    console.error("Error al guardar emoción:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function getEmotionsByUserId(req, res) {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "El userId es obligatorio" });
    }

    const emotions = await Emotion.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) }, // Filtra las emociones por el userId
      },
      {
        $lookup: {
          from: "users", // Nombre de la colección de usuarios
          localField: "userId", // El campo de la colección de emociones
          foreignField: "_id", // El campo en la colección de usuarios
          as: "userDetails", // El nombre del campo donde se almacenarán los datos del usuario
        },
      },
      {
        $unwind: {
          path: "$userDetails", // Descompón el arreglo userDetails en un solo objeto
          preserveNullAndEmptyArrays: true, // Si no se encuentra información del usuario, no lo omite
        },
      },
      {
        $project: {
          // Proyección para devolver solo los campos deseados
          emotion: 1,
          date: 1,
          "userDetails.name": 1,
          "userDetails.lastname": 1,
          "userDetails.email": 1,
          "userDetails.phone": 1,
          "userDetails.country": 1,
          "userDetails.rol": 1,
          "userDetails.photo": 1,
        },
      },
    ]);

    res.status(200).json({ emotions });
  } catch (error) {
    console.error("Error al obtener emociones:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

module.exports = { submitEmotion, getEmotionsByUserId, verifyToken };
