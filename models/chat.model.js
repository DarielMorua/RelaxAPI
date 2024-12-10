var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var User = require("../models/users.models");
var Profesional = require("../models/professional.model");

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "senderModel", // puede ser un usuario o un profesional
        required: true,
      },
      senderModel: {
        type: String,
        required: true,
        enum: ["User", "Professional"], //   remitente es usuario o profesional
      },
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = mongoose.model("Chat", chatSchema);
