var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    profesionalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profesional",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: Number,
        required: true,
    },
    endTime: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});