var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const preguntasSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  respuesta: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Preguntas", preguntasSchema);
