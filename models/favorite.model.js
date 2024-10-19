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

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;