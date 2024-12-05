var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const emotionModel = require("../models/emotion.model");

const calendarSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  hour: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
  },
  emotions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Emotion",
    },
  ],
});

module.exports = mongoose.model("Calendar", calendarSchema);
