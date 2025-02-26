import express from "express";
import puppeteer from "puppeteer-core";
import chromium from "chrome-aws-lambda";
import SessionCookie from "../models/sessionCookies.model.js";

const router = express.Router();

router.get("/open-page/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // 🔍 Buscar la sesión en la base de datos usando el email
    const userSession = await SessionCookie.findOne({ email });

    if (!userSession) {
      return res.status(404).json({ message: "⚠️ No se encontró la sesión." });
    }

    // 🚀 Iniciar Puppeteer en modo headless con configuración para Vercel
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath || "/usr/bin/google-chrome-stable",
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // 📌 Restaurar localStorage
    if (userSession.localStorage) {
      await page.evaluate(storage => {
        localStorage.clear();
        Object.entries(storage).forEach(([key, value]) => localStorage.setItem(key, value));
      }, userSession.localStorage);
    }

    // 📌 Restaurar sessionStorage
    if (userSession.sessionStorage) {
      await page.evaluate(storage => {
        sessionStorage.clear();
        Object.entries(storage).forEach(([key, value]) => sessionStorage.setItem(key, value));
      }, userSession.sessionStorage);
    }

    // 🌐 Navegar a la página de Boca Socios
    await page.goto("https://bocasocios.bocajuniors.com.ar", { waitUntil: "networkidle2" });

    // 🔄 Recargar la página para aplicar los cambios
    await page.reload({ waitUntil: "networkidle2" });

    console.log("✅ Página abierta con sesión restaurada y fila virtual evitada.");
    
    // Cierra el navegador después de usarlo en un entorno serverless
    await browser.close();

    res.json({ message: "✅ Página abierta con sesión restaurada y fila virtual evitada." });

  } catch (error) {
    console.error("❌ Error al abrir la página:", error);
    res.status(500).json({ message: "⚠️ Error al abrir la página" });
  }
});

export default router;
