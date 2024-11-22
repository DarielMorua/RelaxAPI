//CRUD de ejercicios, categoria,  Imagen, titulo, shortDescription, LongDescription, urlVideovar
var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const exercisesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  longDescription: {
    type: String,
    required: true,
  },
  urlVideo: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Exercises", exercisesSchema);
