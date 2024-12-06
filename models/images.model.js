var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
});

module.exports = mongoose.model("Image", imageSchema);
