const Emotion = require("../models/emotion.model");
var jwt = require("jsonwebtoken");
const privateKey = process.env.SECRET_KEY;
const payload = {
  name: "Jane Doe",
  profile: "GUEST",
  exp: Math.floor(Date.now() / 1000) + 60 * 60,
};
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ message: "Token no proporcionado" });
  }
  let authToken;
  if (authHeader && authHeader.length) {
    const tokenParts = authHeader.split(" ");
    if (tokenParts.length === 2) {
      authToken = tokenParts[1];
      console.log(authToken);
    }
    try {
      await jwt.verify(authToken, privateKey);
      next();
    } catch (error) {
      console.log(error);
      return res.status(403).json({ message: "Token inválido" });
    }
  }
}
async function submitEmotion(req, res) {
  try {
    const { emotion, date } = req.body;

    if (!emotion || !date) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const userId = req.user.id;
    if (!userId) {
      return res.status(403).json({ message: "Usuario no autorizado" });
    }

    const newEmotion = new Emotion({
      userId,
      emotion,
      date: new Date(date),
    });

    await newEmotion.save();

    res
      .status(201)
      .json({ message: "Emoción guardada exitosamente", emotion: newEmotion });
  } catch (error) {
    console.error("Error al guardar emoción:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function getEmotionsByUserId(req, res) {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "El userId es obligatorio" });
    }

    const emotions = await Emotion.find({ userId });

    res.status(200).json({ emotions });
  } catch (error) {
    console.error("Error al obtener emociones:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

module.exports = { submitEmotion, getEmotionsByUserId, verifyToken };
