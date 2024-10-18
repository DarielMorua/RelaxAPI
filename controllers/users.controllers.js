var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var User = require("../models/users.models");

//obtener usuario por id
async function getUser(req, res) {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "El id del usuario es requerido" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ "Error al obtener usuario": error.message });
  }
}

//crear usuario
async function createUser(req, res) {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ "Error al crear usuario": error.message });
  }
}

//actualizar usuario por id
// Actualizar usuario por id desde el body sin usar el spread operator
async function updateUser(req, res) {
  try {
    const { id } = req.body; // Extraemos el id
    if (!id) {
      return res.status(400).json({ error: "El id del usuario es requerido" });
    }

    // Actualizamos directamente con el req.body
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ "Error al actualizar usuario": error.message });
  }
}

//desactivar, no borrar usuario por id
async function deleteUser(req, res) {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "El id del usuario es requerido" });
    }
    const user = await User.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ "Error al eliminar usuario": error.message });
  }
}
module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
