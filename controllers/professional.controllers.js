var express = require("express");
var router = express.Router();
const profesionalModel = require('../models/professional.model');

async function createProfessional(req, res, next) {
    try{
        // Crear un nuevo profesional
        var profesional = new profesionalModel({
            name: req.body.name,
            score: req.body.score,
            creationDate: new Date().getTime(),
            description: req.body.description,
            phone: req.body.phone,
            ubicacion: {
                latitude: req.body.ubicacion.latitude,
                longitude: req.body.ubicacion.longitude
            }
        });
    
        // Guardar profesional
        const savedProfesional = await profesional.save();
    
        // Mensaje de éxito
        res.status(200).json({message: "Profesional creado con éxito", savedProfesional});
    } catch (error) {
        // Error al crear profesional
        res.status(400).json({message: "Error al crear profesional", error: error.message});
    }
};

async function findProfessional(req, res, next) {
    try {
    // Buscar el profesional por ID
    const profesional = await profesionalModel.findById(req.body.id);

    // Verificar si se encontró el profesional
    if (!profesional) {
        return res.status(404).json({ message: "Profesional no encontrado" });
    }

    // Mensaje de éxito: devolver el profesional encontrado
    res.status(200).json(profesional);
} catch (error) {
    // Error al buscar profesional
    res.status(400).json({ message: "Error al buscar profesional", error });
}
};

async function updateProfessional(req, res, next) {
    try {
        // Buscar y actualizar el profesional por ID
        const updatedProfesional = await profesionalModel.findByIdAndUpdate(
 req.body.id,
            {
                name: req.body.name,
                score: req.body.score,
                creationDate: req.body.creationDate,
                description: req.body.description,
                phone: req.body.phone,
                ubicacion: {
                    latitude: req.body.ubicacion.latitude,
                    longitude: req.body.ubicacion.longitude
                }
            },
            { new: true } // Para devolver el documento actualizado
        );

        // Verificar si se encontró y actualizó el profesional
        if (!updatedProfesional) {
            return res.status(400).json({ error: "Profesional no encontrado" });
        }

        // Responder con el profesional actualizado
        res.status(200).json(updatedProfesional);
    } catch (err) {
        // Manejar errores
        res.status(500).json({ error: err.message });
    }
};

async function deleteProfessional(req, res, next) {
    try {
        // Buscar y actualizar el campo isActive del profesional por su ID
        const updatedProfesional = await profesionalModel.findByIdAndUpdate(
            req.body.id, // ID del profesional
            { isActive: req.body.isActive }, // Valor de isActive (true o false)
            { new: true } // Retorna el documento actualizado
        );

        // Verificar si se encontró y actualizó el profesional
        if (!updatedProfesional) {
            return res.status(404).json({ error: "Profesional no encontrado" });
        }

        // Responder con el profesional actualizado
        res.status(200).json(updatedProfesional);
    } catch (err) {
        // Manejar errores
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createProfessional,
    findProfessional,
    updateProfessional,
    deleteProfessional
};