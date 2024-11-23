var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var emotionController = require("../controllers/emotion.controllers");

router.post(
  "/submit-emotion",
  emotionController.verifyToken,
  emotionController.submitEmotion
);

router.post(
  "/get-emotions-by-user-id",
  emotionController.verifyToken,
  emotionController.getEmotionsByUserId
);

module.exports = router;
