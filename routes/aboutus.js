var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var aboutus = require("../controllers/aboutus.controllers");

router.post("/obtener-info", aboutus.getAboutus);
router.post("/crear-info", aboutus.createAboutus);
router.post("/actualizar-info", aboutus.updateAboutus);
router.post("/eliminar-info", aboutus.deleteAboutus);

module.exports = router;
