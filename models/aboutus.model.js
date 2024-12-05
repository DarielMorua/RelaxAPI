var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const aboutusSchema = new mongoose.Schema({
  dariel: { type: String, required: true },
  juvey: { type: String, required: true },
  materia: { type: String, required: true },
  descripcion: { type: String, required: true },
  linkdariel: { type: String, required: true },
  linkjuvey: { type: String, required: true },
});

module.exports = mongoose.model("Aboutus", aboutusSchema);
