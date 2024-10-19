var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
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
});


<<<<<<< HEAD
module.exports = Favorite;
=======

module.exports = mongoose.model("Favorite", favoriteSchema);
>>>>>>> c9ca41e5b535efcfc71e7d32cfeb0a18445104ac
