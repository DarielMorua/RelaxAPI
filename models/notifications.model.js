var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
//crud de notificaciones

const notificationsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  seen: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Notifications", notificationsSchema);
