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

async function getMoods(req, res) {
  try {
    const moods = await Mood.find();
    res.status(200).json(moods);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error getting moods", error: error.message });
  }
}

async function getMoodById(req, res) {
  try {
    const { id } = req.body;
    const mood = await Mood.findById(id);
    res.status(200).json(mood);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error getting mood", error: error.message });
  }
}

async function updateMood(req, res) {
  try {
    const { id, mood: moodValue } = req.body;
    await Mood.findByIdAndUpdate(id, { mood: moodValue });
    res.status(200).json({ message: "Mood updated successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating mood", error: error.message });
  }
}
