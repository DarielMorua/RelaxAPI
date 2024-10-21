var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const ubicacionSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});

const profesionalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  creationDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  ubicacion: {
    type: ubicacionSchema,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
});

// Crear el modelo basado en el esquema
const Profesional = mongoose.model("Profesional", profesionalSchema);

// Exportar el modelo, no solo el esquema
module.exports = Profesional;
