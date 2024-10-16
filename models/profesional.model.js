var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const ubicacionSchema = new mongoose.Schema({
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
});

const profesionalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    creationDate: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    ubicacion: {
        type: ubicacionSchema,
        required: true,
    },
});