var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var categoryController = require("../controllers/category.controllers");

router.post(
  "/crear-categoria",
  categoryController.verifyToken,
  categoryController.createCategory
);

router.post(
  "/mostrar-categorias",
  categoryController.verifyToken,
  categoryController.getCategories
);

router.post(
  "/mostrar-categoria",
  categoryController.verifyToken,
  categoryController.getCategoryById
);

router.post(
  "/actualizar-categoria",
  categoryController.verifyToken,
  categoryController.updateCategory
);

router.post(
  "/borrar-categoria",
  categoryController.verifyToken,
  categoryController.deleteCategory
);

module.exports = router;
