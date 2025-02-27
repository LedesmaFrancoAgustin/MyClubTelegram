import express from "express";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import mongoose from "mongoose";
import SessionCookie from "../models/sessionCookies.model.js"; // Modelo de MongoDB

const router = express.Router();

router.get('/open-socio', async (req, res) => {
  try {
    console.log("🔹 Ruta '/open-socio' llamada");

    const email = "ledesma-agustin@hotmail.com"
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

    console.log("🔹 Iniciando Puppeteer...");
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: false, // Asegurar que se ve el navegador
    });

    console.log("✅ Navegador iniciado");
    const page = await browser.newPage();
    await page.goto("https://bocasocios.bocajuniors.com.ar/auth/login", { waitUntil: "networkidle2" });

    console.log("🔹 Página cargada en Puppeteer");

    // Inyectar localStorage y sessionStorage
    await page.evaluate((localData, sessionData) => {
      Object.keys(localData).forEach(key => {
        localStorage.setItem(key, localData[key]);
      });
      Object.keys(sessionData).forEach(key => {
        sessionStorage.setItem(key, sessionData[key]);
      });
    }, sessionData.localStorage, sessionData.sessionStorage);

    console.log("✅ Datos de sesión inyectados en el navegador");

    // Capturar una captura de pantalla para depuración
    await page.screenshot({ path: "debug.png" });
    console.log("📸 Captura de pantalla guardada como 'debug.png'");

    // Recargar la página con la sesión activa
    await page.reload({ waitUntil: "networkidle2" });
    console.log("🔄 Página recargada con sesión activa");

    res.send("✅ Sesión iniciada correctamente en SoySocio.");
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error);
    res.status(500).send("Error al abrir la página");
  }
});

export default router;

