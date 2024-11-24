var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const Favorite = require("../models/favorite.model");
const Professional = require("../models/professional.model");
const User = require("../models/users.models");
const Review = require("../models/review.model");
const privateKey = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");

const payload = {
  name: "Jane Doe",
  profile: "GUEST",
  exp: Math.floor(Date.now() / 1000) + 60 * 60,
};

async function crearFavorito(req, res) {
  try {
    const { userId, professionalId } = req.body;

    // Verificar si el profesional ya está en favoritos
    const existingFavorite = await Favorite.findOne({
      userId: userId,
      professionalId: professionalId,
    });

    if (existingFavorite) {
      return res.status(400).json({
        message: "El profesional ya está en favoritos.",
      });
    }

    // Crear un nuevo favorito
    const newFavorite = new Favorite({
      userId: userId,
      professionalId: professionalId,
    });

    // Guardar el favorito en la base de datos
    await newFavorite.save();

    // Agregar el profesional al array de favoritos del usuario
    await User.findByIdAndUpdate(userId, {
      $addToSet: { favorites: professionalId }, // Agregar sin duplicados
    });

    res.status(200).json({
      message: "Profesional agregado como favorito con éxito",
    });
  } catch (error) {
    res.status(400).json({
      message: "Error al agregar profesional como favorito",
      error: error.message,
    });
  }
}

async function buscarFavoritos(req, res) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "El userId es requerido" });
    }

    const favoritos = await Favorite.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "professionals",
          localField: "professionalId",
          foreignField: "_id",
          as: "professionalDetails",
        },
      },
      { $unwind: "$professionalDetails" },
      {
        $project: {
          _id: 1,
          userId: 1,
          professionalId: 1,
          "professionalDetails._id": 1,
          "professionalDetails.name": 1,
          "professionalDetails.photo": 1,
          "professionalDetails.score": 1,
          "professionalDetails.description": 1,
        },
      },
    ]);

    if (!favoritos || favoritos.length === 0) {
      return res.status(404).json({
        message: "No se encontraron profesionales favoritos para este usuario.",
      });
    }

    res.status(200).json(favoritos);
  } catch (error) {
    console.error("Error al obtener los favoritos:", error);
    res.status(500).json({
      message: "Error al obtener los profesionales favoritos",
      error: error.message,
    });
  }
}

async function removerFavoritos(req, res) {
  try {
    const { userId, professionalId } = req.body;

    if (!userId || !professionalId) {
      return res
        .status(400)
        .json({ message: "userId y professionalId son requeridos" });
    }

    const deletedFavorite = await Favorite.findOneAndDelete({
      userId: userId,
      professionalId: professionalId,
    });

    if (!deletedFavorite) {
      return res
        .status(404)
        .json({ message: "No se encontró este favorito para eliminar" });
    }

    await Professional.findByIdAndUpdate(professionalId, { isFavorite: false });

    res.status(200).json({
      message: "Favorito eliminado y profesional actualizado con éxito",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el favorito", error: error.message });
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
  crearFavorito,
  buscarFavoritos,
  removerFavoritos,
  verifyToken,
};
