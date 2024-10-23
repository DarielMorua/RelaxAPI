var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    professionalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Professional",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["PENDING", "CONFIRMED", "CANCELLED"],
        default: "PENDING",
    },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;