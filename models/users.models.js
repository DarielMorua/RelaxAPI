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
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Professional" }],
  emotion: [{ type: mongoose.Schema.Types.ObjectId, ref: "Emotion" }],
});

module.exports = mongoose.model("User", userSchema);
