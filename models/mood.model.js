var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const moodSchema = new mongoose.Schema({
  mood: { type: Number, required: true },
  date: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Mood", moodSchema);
