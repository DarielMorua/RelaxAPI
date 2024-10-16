var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  image: { type: String, required: true },
  nameActvity: { type: String, required: true, required: true },
  description: { type: String, required: true },
  video: { type: String, required: true, required: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

module.exports = mongoose.model("Activity", activitySchema);
