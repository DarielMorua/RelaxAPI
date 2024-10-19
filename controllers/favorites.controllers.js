var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const Favorite = require("../models/favorite.model");

async function crearFavorito(req, res) {
  try {
    const { userId, professionalId } = req.body;

    // Crear un nuevo favorito
    const newFavorite = new Favorite({
      userId: userId,
      professionalId: professionalId,
    });

    // Guardar el favorito en la base de datos
    await newFavorite.save();

    // Actualizar el campo isFavorite del profesional a true
    await Professional.findByIdAndUpdate(professionalId, { isFavorite: true });

    res.status(200).json({
      message: "Profesional agregado como favorito y actualizado con éxito",
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

    // Verificar si el userId está en la solicitud
    if (!userId) {
      return res.status(400).json({ message: "El userId es requerido" });
    }

    // Buscar todos los favoritos del usuario
    const favoritos = await Favorite.find({ userId: userId }).populate(
      "professionalId"
    );

    // Si no hay favoritos
    if (favoritos.length === 0) {
      return res.status(404).json({
        message: "No se encontraron profesionales favoritos para este usuario.",
      });
    }

    // Responder con la información de los profesionales favoritos
    res.status(200).json(favoritos);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los profesionales favoritos",
      error: error.message,
    });
  }
}

async function removerFavoritos(req, res) {
  try {
    const { userId, professionalId } = req.body;

    // Verificar si se ha enviado el userId y el professionalId
    if (!userId || !professionalId) {
      return res
        .status(400)
        .json({ message: "userId y professionalId son requeridos" });
    }

    // Eliminar el favorito
    const deletedFavorite = await Favorite.findOneAndDelete({
      userId: userId,
      professionalId: professionalId,
    });

    // Si no se encontró el favorito
    if (!deletedFavorite) {
      return res
        .status(404)
        .json({ message: "No se encontró este favorito para eliminar" });
    }

    // Actualizar el campo isFavorite en el profesional a false
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

module.exports = {
  crearFavorito,
  buscarFavoritos,
  removerFavoritos,
};
