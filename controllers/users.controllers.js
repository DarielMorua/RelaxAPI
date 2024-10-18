var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var User = require("../models/users.models");

//obtener usuario por id
async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ "Error al crear": error.message });
  }
}

//crear usuario
async function createUser(req, res) {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ "Error al crear": error.message });
  }
}

//actualizar usuario por id
async function updateUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ "Error al actualizar": error.message });
  }
}
//desactivar, no borrar usuario por id
async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { active: false });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ "Error al eliminar": error.message });
  }
}
module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
