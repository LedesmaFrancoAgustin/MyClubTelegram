import express from "express";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import mongoose from "mongoose";
import SessionCookie from "../models/sessionCookies.model.js"; // Modelo de MongoDB

const router = express.Router();
router.get("/redirect-boca", async (req, res) => {
  // Buscar cookies de MongoDB
  const session = await SessionCookie.findOne({ email: "ledesma-agustin@hotmail.com" });
  
  if (!session) {
      return res.status(403).send("No hay sesión guardada.");
  }

  res.setHeader("Set-Cookie", `authToken=${session.localStorage.authToken}; Path=/; HttpOnly`);
  res.redirect("https://bocasocios.bocajuniors.com.ar/auth/login");
});


export default router;
