import express from "express";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import mongoose from "mongoose";
import SessionCookie from "../models/sessionCookies.model.js"; // Modelo de MongoDB

const router = express.Router();
router.get("/redirect-boca", async (req, res) => {
  const session = await SessionCookie.findOne({ email: "ledesma-agustin@hotmail.com" });

  if (!session) {
      return res.status(403).send("No hay sesión guardada.");
  }

  const script = `
    <script>
      localStorage.setItem('boca-secure-storage\\\\authStore', '${session.localStorage["boca-secure-storage\\authStore"]}');
      window.location.href = "https://bocasocios.bocajuniors.com.ar/auth/login";
    </script>
  `;

  res.send(script);
});

export default router;
