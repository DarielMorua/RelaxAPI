var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var favoriteController = require("../controllers/favorites.controllers");

// Crear favorito
router.post(
  "/crear-favorito",
  favoriteController.verifyToken,
  favoriteController.crearFavorito
);

// Mostrar favoritos
router.post(
  "/ver-favoritos",
  favoriteController.verifyToken,
  favoriteController.buscarFavoritos
);

// Remover favorito
router.post(
  "/remover-favorito",
  favoriteController.verifyToken,
  favoriteController.removerFavoritos
);

module.exports = router;
