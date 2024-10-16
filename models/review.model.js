var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    professionalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Professional",
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
});