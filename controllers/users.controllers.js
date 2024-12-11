var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var User = require("../models/users.models");
const jwt = require("jsonwebtoken");
const Profesional = require("../models/professional.model");
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
    // crear el usuario
    const user = await User.create(req.body);

    // verificar si el rol es "Profesional"
    if (user.rol === "Profesional") {
      const { name, lastname, photo, phone } = req.body;

      // crear el documento del profesional
      const profesional = new Profesional({
        name,
        lastname,
        photo,
        phone,
        creationDate: new Date(),
        userId: user._id,
      });

      await profesional.save();

      user.favorites.push(profesional._id);
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]; // captura el campo duplicado (email o phone)
      res
        .status(400)
        .json({ message: `Error: el campo '${field}' ya está en uso.` });
    } else {
      res.status(400).json({ "Error al crear usuario": error.message });
    }
  }
}

//actualizar usuario por id
async function updateUser(req, res) {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "El id del usuario es requerido" });
    }

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
    const user = await User.findOne({ email, password });

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
          rol: user.rol,
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
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "El userId es obligatorio." });
    }

    const user = await User.findById(userId).populate("favorites");

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const favorites = user.favorites;

    return res.status(200).json(favorites);
  } catch (error) {
    console.error("Error al obtener profesionales favoritos:", error);
    return res.status(500).json({ error: "Error al obtener los favoritos." });
  }
}

async function getActiveUsersByRole(req, res) {
  try {
    const { rol } = req.body;

    const users = await User.find(
      { rol: rol, active: true },
      { email: 1, rol: 1, active: 1 }
    );

    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res
      .status(500)
      .json({ message: "Error al obtener usuarios", error: error.message });
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
  getActiveUsersByRole,
};
