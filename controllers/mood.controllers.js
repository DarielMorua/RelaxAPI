import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Mood from "../models/mood.model";

const router = express.Router();

async function createMood(req, res) {
  try {
    const { userId, mood: moodValue } = req.body;

    const newMood = new Mood({
      mood: moodValue,
      userId,
      date: new Date(),
    });

    const savedMood = await newMood.save();

    res.status(200).json({ message: "Mood created successfully", savedMood });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating mood", error: error.message });
  }
}
