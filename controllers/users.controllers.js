var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var User = require("../models/User");

async function getUser(req, res) {
  const user = await User.findById(req.params.id);
  res.json(user);
}
