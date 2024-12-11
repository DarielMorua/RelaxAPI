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
  lastname: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default:
      "https://res.cloudinary.com/dbkv7w2jf/image/upload/fl_preserve_transparency/v1733437940/DALL_E_2024-12-05_16.32.08_-_A_simple_minimalistic_default_profile_picture_design_for_a_relaxation_app._The_image_features_a_soft_abstract_silhouette_of_a_human_head_and_shoulde_dd0wzf.jpg?_s=public-apps",
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
    default: "Profesional",
  },
  phone: {
    type: String,
    required: true,
  },
  ubicacion: {
    type: ubicacionSchema,
    default: {
      latitude: 0,
      longitude: 0,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Referencia al modelo User
    ref: "User",
    required: true,
  },
});
// indice unico
profesionalSchema.index({ phone: 1 }, { unique: true });

//indice compuesto
profesionalSchema.index({ name: 1, lastname: 1 });

//indice sparse
profesionalSchema.index({ reviews: 1 }, { sparse: true });

//indice simple
profesionalSchema.index({ creationDate: 1 });

const Profesional = mongoose.model("Profesional", profesionalSchema);

module.exports = Profesional;
