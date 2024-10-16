var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("profile");
});
router.put("/", function (req, res, next) {
  res.render("profile");
});
router.delete("/", function (req, res, next) {
  res.render("profile");
});

module.exports = router;
