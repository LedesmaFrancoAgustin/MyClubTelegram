import express from "express";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import mongoose from "mongoose";
import SessionCookie from "../models/sessionCookies.model.js"; // Modelo de MongoDB

const router = express.Router();

router.get('/open-socio', async (req, res) => {
  try {
    const email = "ledesma-agustin@hotmail.com";
    if (!email) {
      return res.status(400).send("Email requerido");
    }

    // Buscar los datos de sesión en la base de datos
    const sessionData = await SessionCookie.findOne({ email });
    if (!sessionData) {
      return res.status(404).send("No se encontraron datos de sesión");
    }

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: false,
    });

    const page = await browser.newPage();
    await page.goto("https://bocasocios.bocajuniors.com.ar/auth/login", { waitUntil: "networkidle2" });

    // Inyectar localStorage y sessionStorage
    await page.evaluate((localData, sessionData) => {
      Object.keys(localData).forEach(key => {
        localStorage.setItem(key, localData[key]);
      });
      Object.keys(sessionData).forEach(key => {
        sessionStorage.setItem(key, sessionData[key]);
      });
    }, sessionData.localStorage, sessionData.sessionStorage);

    // Recargar la página con la sesión activa
    await page.reload({ waitUntil: "networkidle2" });

    res.send("Sesión iniciada correctamente en SoySocio.");
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).send("Error al abrir la página");
  }
});

export default router;

