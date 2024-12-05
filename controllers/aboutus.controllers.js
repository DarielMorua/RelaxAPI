var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Aboutus = require("../models/aboutus.model");
const privateKey = process.env.SECRET_KEY;

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
async function getAboutus(req, res) {
  try {
    const aboutus = await Aboutus.find();
    res.json(aboutus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createAboutus(req, res) {
  const aboutus = new Aboutus(req.body);
  try {
    const newAboutus = await aboutus.save();
    res.status(201).json(newAboutus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function updateAboutus(req, res) {
  try {
    const updatedAboutus = await Aboutus.findByIdAndUpdate(req.body);
    res.json(updatedAboutus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteAboutus(req, res) {
  try {
    await Aboutus.findByIdAndDelete(req.params.id);
    res.json({ message: "Aboutus eliminado" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getAboutus,
  createAboutus,
  updateAboutus,
  deleteAboutus,
  verifyToken,
};
