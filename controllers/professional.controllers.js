var express = require("express");
var router = express.Router();
const profesionalModel = require("../models/professional.model");
const Review = require("../models/review.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const privateKey = process.env.SECRET_KEY;

const payload = {
  name: "Jane Doe",
  profile: "GUEST",
  exp: Math.floor(Date.now() / 1000) + 60 * 60,
};

async function createProfessional(req, res, next) {
  try {
    var profesional = new profesionalModel({
      name: req.body.name,
      photo: req.body.photo,
      score: req.body.score,
      creationDate: new Date().getTime(),
      description: req.body.description,
      phone: req.body.phone,
      ubicacion: {
        latitude: req.body.ubicacion.latitude,
        longitude: req.body.ubicacion.longitude,
      },
    });

    const savedProfesional = await profesional.save();

    res
      .status(200)
      .json({ message: "Profesional creado con éxito", savedProfesional });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al crear profesional", error: error.message });
  }
}

async function findProfessional(req, res, next) {
  try {
    const profesional = await profesionalModel.findById(req.body.id);

    if (!profesional) {
      return res.status(404).json({ message: "Profesional no encontrado" });
    }

    res.status(200).json(profesional);
  } catch (error) {
    res.status(400).json({ message: "Error al buscar profesional", error });
  }
}

async function updateProfessional(req, res, next) {
  try {
    const updatedProfesional = await profesionalModel.findByIdAndUpdate(
      req.body.id,
      {
        name: req.body.name,
        photo: req.body.photo,
        score: req.body.score,
        creationDate: req.body.creationDate,
        description: req.body.description,
        phone: req.body.phone,
        ubicacion: {
          latitude: req.body.ubicacion.latitude,
          longitude: req.body.ubicacion.longitude,
        },
      },
      { new: true }
    );

    if (!updatedProfesional) {
      return res.status(400).json({ error: "Profesional no encontrado" });
    }

    res.status(200).json(updatedProfesional);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteProfessional(req, res, next) {
  try {
    const updatedProfesional = await profesionalModel.findByIdAndUpdate(
      req.body.id,
      { isActive: req.body.isActive },
      { new: true }
    );

    if (!updatedProfesional) {
      return res.status(404).json({ error: "Profesional no encontrado" });
    }

    res.status(200).json(updatedProfesional);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function giveReview(req, res) {
  try {
    // crear una nueva reseña con comentario score y los IDs
    const { comment, score, professionalId, userId } = req.body;
    const newReview = new Review({
      comment,
      score,
      professionalId,
      userId,
    });
    await newReview.save();

    // buscar el profesional y agregar la nueva reseña
    const professional = await profesionalModel.findById(professionalId);
    professional.reviews.push(newReview._id);

    // calcular el nuevo promedio de calificación
    const reviews = await Review.find({ professionalId: professionalId });

    //el promedio se calcula agarrando todo lo del array y se itera
    const totalScore = reviews.reduce((sum, review) => sum + review.score, 0);
    professional.score = totalScore / reviews.length;

    await professional.save();

    res.status(201).json({
      message: "Review agregada y score actualizade",
      review: newReview,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar review" + error.message });
  }
}

//obtener todos los profesionales solo foto y nombre
async function showAllProfessionals(req, res) {
  try {
    const professionals = await profesionalModel.find(
      {},
      { name: 1, photo: 1, userId: 1 }
    );
    res.status(200).json(professionals);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener profesionales" });
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

async function showReviews(req, res) {
  const { professionalId } = req.body;

  if (!professionalId) {
    return res.status(400).json({ error: "El professionalId es obligatorio." });
  }

  try {
    const reviews = await Review.find({ professionalId }).populate(
      "userId",
      "name"
    );
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error al obtener reviews:", error);
    res.status(500).json({ error: "Error al obtener las reviews." });
  }
}

module.exports = {
  createProfessional,
  findProfessional,
  updateProfessional,
  deleteProfessional,
  giveReview,
  showAllProfessionals,
  verifyToken,
  showReviews,
};
