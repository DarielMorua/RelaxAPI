var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
const privateKey = process.env.SECRET_KEY;
var Category = require("../models/category.models");
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

async function createCategory(req, res) {
  try {
    const { name } = req.body;
    const newCategory = new Category({
      name,
    });
    await newCategory.save();
    res.status(201).json({ message: "Categoría creada con éxito" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la categoría", error: error.message });
  }
}

async function getCategories(req, res) {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las categorías",
      error: error.message,
    });
  }
}

async function getCategoryById(req, res) {
  try {
    const { id } = req.body;
    const category = await Category.findById(id);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la categoría",
      error: error.message,
    });
  }
}

async function updateCategory(req, res) {
  try {
    const { id, name } = req.body;
    await Category.findByIdAndUpdate(id, { name });
    res.status(200).json({ message: "Categoría actualizada con éxito" });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la categoría",
      error: error.message,
    });
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.body;
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Categoría eliminada con éxito" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la categoría",
      error: error.message,
    });
  }
}

module.exports = {
  verifyToken,
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
