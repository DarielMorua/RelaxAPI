const mongoose = require("mongoose");

const EmotionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  emotion: { type: String, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Emotion", EmotionSchema);
