import express from "express";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import mongoose from "mongoose";
import SessionCookie from "../models/sessionCookies.model.js"; // Modelo de MongoDB

const router = express.Router();

router.get('/open-socio', async (req, res) => {
  try {
    console.log("🔹 Ruta '/open-socio' llamada");

    const email = "ledesma-agustin@hotmail.com";
    if (!email) {
      console.log("⚠️ Email no proporcionado");
      return res.status(400).send("Email requerido");
    }

    console.log(`🔹 Buscando sesión para: ${email}`);
    const sessionData = await SessionCookie.findOne({ email });

    if (!sessionData) {
      console.log("⚠️ No se encontraron datos de sesión en MongoDB");
      return res.status(404).send("No se encontraron datos de sesión");
    }

    console.log("✅ Datos de sesión encontrados:", sessionData);

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless
  });
  
  

    console.log("✅ Navegador iniciado");
    const page = await browser.newPage();
    await page.goto("https://bocasocios.bocajuniors.com.ar/auth/login", {
      waitUntil: "domcontentloaded", // ⚡ Carga más rápido
      timeout: 10000 // ⏳ Evita bloqueos largos
  });

  

  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error);
    res.status(500).send("Error al abrir la página");
  }
});

export default router;
