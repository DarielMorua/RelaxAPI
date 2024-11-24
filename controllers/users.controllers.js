var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var User = require("../models/users.models");
const jwt = require("jsonwebtoken");

const privateKey = process.env.SECRET_KEY;

//obtener usuario por id
async function getUser(req, res) {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "El id del usuario es requerido" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ "Error al obtener usuario": error.message });
  }
}

//crear usuario
async function createUser(req, res) {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    if (error.code === 11000) {
      // Error de clave duplicada (E11000)
      const field = Object.keys(error.keyValue)[0]; // Captura el campo duplicado (email o phone)
      res
        .status(400)
        .json({ message: `Error: el campo '${field}' ya está en uso.` });
    } else {
      // Otro tipo de error
      res.status(400).json({ "Error al crear usuario": error.message });
    }
  }
}

//actualizar usuario por id
// Actualizar usuario por id desde el body sin usar el spread operator
async function updateUser(req, res) {
  try {
    const { id } = req.body; // Extraemos el id
    if (!id) {
      return res.status(400).json({ error: "El id del usuario es requerido" });
    }

    // Actualizamos directamente con el req.body
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ "Error al actualizar usuario": error.message });
  }
}

//desactivar, no borrar usuario por id
async function deleteUser(req, res) {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "El id del usuario es requerido" });
    }
    const user = await User.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ "Error al eliminar usuario": error.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Buscar el usuario por el email
    const user = await User.findOne({ email, password });

    // Verificar si la contraseña es correcta
    if (!user || user.password !== password) {
      return res
        .status(404)
        .json({ message: "Usuario o Contraseña incorrecto" });
    } else if (user.active === false) {
      return res.status(404).json({ message: "Usuario desactivado" });
    } else {
      console.log("Confirmación de sesión");
    }

    const payload = {
      id: user._id,
      name: "Jane Doe",
      profile: "GUEST",
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    try {
      const newToken = await jwt.sign(payload, privateKey, {
        algorithm: "HS256",
      });
      res.json({
        message: "Login exitoso",
        token: newToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          country: user.country,
        },
      });
    } catch (error) {
      console.log(error, "JWT error");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor", error: error });
  }
}

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

async function getFavoritesProfessionals(req, res) {
  try {
    const user = await User.findById(req.userId).populate("favorites");

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const favorites = user.favorites;

    return res.status(200).json(favorites);
  } catch (error) {
    console.error("Error al obtener profesionales favoritos:", error);
    return res.status(500).json({ error: "Error al obtener los favoritos" });
  }
}

module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  login,
  verifyToken,
  getFavoritesProfessionals,
};
