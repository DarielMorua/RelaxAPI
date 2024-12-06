var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var imagesModel = require("../models/images.model");
const privateKey = process.env.SECRET_KEY;
var jwt = require("jsonwebtoken");
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
async function createImage(req, res) {
  try {
    const { url } = req.body;

    const newImage = new imagesModel({
      url,
    });

    await newImage.save();

    res.status(200).json({
      message: "Imagen creada con éxito",
      image: newImage,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error al crear imagen",
      error: error.message,
    });
  }
}

async function getImages(req, res) {
  try {
    const images = await imagesModel.find();
    res.status(200).json(images);
  } catch (error) {
    res.status(400).json({
      message: "Error al obtener imágenes",
      error: error.message,
    });
  }
}

async function deleteImages(req, res) {
  try {
    const { id } = req.body;
    await imagesModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Imagen eliminada con éxito" });
  } catch (error) {
    res.status(400).json({
      message: "Error al eliminar imagen",
      error: error.message,
    });
  }
}

async function updateImages(req, res) {
  try {
    const { id, url } = req.body;
    await imagesModel.findByIdAndUpdate(id, { url });

    res.status(200).json({ message: "Imagen actualizada con éxito" });
  } catch (error) {
    res.status(400).json({
      message: "Error al actualizar imagen",
      error: error.message,
    });
  }
}

module.exports = {
  createImage,
  getImages,
  deleteImages,
  updateImages,
  verifyToken,
};
