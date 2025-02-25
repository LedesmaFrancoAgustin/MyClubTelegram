import express from "express";
import puppeteer from "puppeteer";
import SessionCookie from "../models/SessionCookie.js";

const router = express.Router();

router.get("/open-page/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    // 🔍 Buscar la sesión en la base de datos usando el sessionId
    const userSession = await SessionCookie.findOne({ _id: sessionId });

    if (!userSession) {
      return res.status(404).json({ message: "⚠️ No se encontró la sesión." });
    }

    // 🚀 Iniciar Puppeteer en modo headless
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // 📌 Restaurar cookies en el navegador
    if (userSession.cookies) {
      const cookiesArray = Object.keys(userSession.cookies).map(name => ({
        name,
        value: userSession.cookies[name],
        domain: '.bocajuniors.com.ar',
        path: '/',
        httpOnly: false,
        secure: true,
        sameSite: 'None'
      }));
      await page.setCookie(...cookiesArray);
    }

    // 🌐 Navegar a la página de Boca Socios
    await page.goto("https://bocasocios.bocajuniors.com.ar", { waitUntil: "networkidle2" });

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

    // 🔄 Recargar la página para aplicar los cambios
    await page.reload({ waitUntil: "networkidle2" });

    console.log("✅ Página abierta con sesión restaurada y fila virtual evitada.");
    res.json({ message: "✅ Página abierta con sesión restaurada y fila virtual evitada." });

  } catch (error) {
    console.error("❌ Error al abrir la página:", error);
    res.status(500).json({ message: "⚠️ Error al abrir la página" });
  }
});

export default router;
