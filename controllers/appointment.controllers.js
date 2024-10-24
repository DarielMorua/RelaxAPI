var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const Appointment = require("../models/appointment.model");
const jwt = require("jsonwebtoken");

const payload = {
  name: "Jane Doe",
  profile: "GUEST",
  exp: Math.floor(Date.now() / 1000) + 60 * 60,
};

async function crearCita(req, res) {
    try {
        const { date, professionalId, userId } = req.body;

        const appointment = new Appointment({
            date,
            professionalId,
            userId,
        });
        
        // Verificación de que la fecha y hora de la cita no choque con una cita confirmada
        const appointments = await Appointment.find({
            professionalId,
            date: new Date(date), 
            status: "CONFIRMED" 
        });

        if (appointments.length > 0) {
        return res.status(400).json({ message: "El profesional ya tiene una cita confirmada para esa fecha y hora" });
        }

        // Verificacion de que la fecha de la cita no sea anterior a la fecha actual
        if (appointment.date < new Date()) {
            return res.status(400).json({ message: "La fecha de la cita no puede ser anterior a la fecha actual" });
        }

        appointment.status = "CONFIRMED";

        // Guardar la cita
        const savedAppointment = await appointment.save();

        // Mensaje de éxito
        res.status(200).json({ message: "Cita creada con éxito", savedAppointment });
    } catch (error) {
        // Error al crear cita
        res.status(400).json({ message: "Error al crear cita", error: error.message });
    }
};

async function eliminarCita(req, res) {
    try {
        const { id } = req.body;

        // Buscar la cita por ID
        const appointment = await Appointment.findById(id);

        // Verificar si la cita existe
        if (!appointment) {
            return res.status(404).json({ message: "Cita no encontrada" });
        }

        // Verificar si la cita ya ha sido cancelada
        if (appointment.status === "CANCELLED") {
            return res.status(400).json({ message: "La cita ya está cancelada" });
        }

        appointment.status = "CANCELLED";

        // Guardar los cambios
        const updatedAppointment = await appointment.save();

        // Responder con la cita actualizada
        res.status(200).json({ message: "Cita cancelada con éxito", updatedAppointment });
    } catch (error) {
        res.status(400).json({ message: "Error al cancelar la cita", error: error.message });
    }
};

async function listaCitas(req, res) {
    try {
        // Buscar citas
        const appointments = await Appointment.find();

        // Lista de citas
        res.status(200).json({ message: "Lista de citas", appointments });
    } catch (error) {
        // Error al obtener listas
        res.status(400).json({ message: "Error al obtener las citas", error: error.message });
    }
};

async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(403).json({ message: "Token no proporcionado" });
    }
    let authToken;
    if (authHeader && authHeader.length) {
      const tokenParts = authHeader.split(" ");
      if (tokenParts.length === 2) {
        authToken = tokenParts[1];
        console.log(authToken);
      }
      try {
        await jwt.verify(authToken, privateKey);
        next();
      } catch (error) {
        console.log(error);
        return res.status(403).json({ message: "Token inválido" });
      }
    }
  }

module.exports = {
    crearCita,
    eliminarCita,
    listaCitas,
    verifyToken
};
