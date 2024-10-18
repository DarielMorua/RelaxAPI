var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "User",

    required: true,
  },

  date: { type: Date, required: true },
  score: { type: Number, required: true },
  emotion: { type: String, required: true },
});

module.exports = mongoose.model("History", historySchema);
