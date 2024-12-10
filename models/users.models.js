var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  active: { type: Boolean, default: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profesional" }],
  emotion: [{ type: mongoose.Schema.Types.ObjectId, ref: "Emotion" }],
  rol: { type: String, default: "User" },
  photo: {
    type: String,
    default:
      "https://res.cloudinary.com/dbkv7w2jf/image/upload/fl_preserve_transparency/v1733437940/DALL_E_2024-12-05_16.32.08_-_A_simple_minimalistic_default_profile_picture_design_for_a_relaxation_app._The_image_features_a_soft_abstract_silhouette_of_a_human_head_and_shoulde_dd0wzf.jpg?_s=public-apps",
  },
});

//indice unico
userSchema.index({ email: 1 }, { unique: true });

//indice compuesto
userSchema.index({ rol: 1, active: 1, email: 1 });

//indice simple
userSchema.index({ name: 1 });

module.exports = mongoose.model("User", userSchema);
