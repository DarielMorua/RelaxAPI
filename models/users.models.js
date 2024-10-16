var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
