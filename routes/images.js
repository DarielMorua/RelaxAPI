var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var imagesController = require("../controllers/images.controllers");

router.post(
  "/create-image",
  imagesController.verifyToken,
  imagesController.createImage
);
router.post(
  "/get-images",
  imagesController.verifyToken,
  imagesController.getImages
);

router.post(
  "/delete-image",
  imagesController.verifyToken,
  imagesController.deleteImages
);
router.post(
  "/update-image",
  imagesController.verifyToken,
  imagesController.updateImages
);

module.exports = router;
