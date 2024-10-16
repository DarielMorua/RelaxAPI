var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, required: true },
});

module.exports = mongoose.model("Category", categorySchema);
