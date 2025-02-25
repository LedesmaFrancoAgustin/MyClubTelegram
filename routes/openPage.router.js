// En, por ejemplo, router/saveSession.route.js
import express from "express";
import crypto from "crypto";

const router = express.Router();
const sessionStore = {}; // Simulación: idealmente, usarías una base de datos

router.post("/save-session", (req, res) => {
  const { sessionData } = req.body;
  const sessionId = crypto.randomUUID(); // Genera un ID único
  sessionStore[sessionId] = sessionData;
  res.json({ sessionId });
});

export default router;
