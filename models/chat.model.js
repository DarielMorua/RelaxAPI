var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "User",

    required: true,
  },
  professionalId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "Professional",

    required: true,
  },
  date: { type: Date, required: true },
  message: { type: String, required: true },
});

module.exports = mongoose.model("Chat", chatSchema);
