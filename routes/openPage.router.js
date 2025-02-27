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
      args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"], // ⚡ Evita restricciones
      executablePath: await chromium.executablePath(),
      headless: true, // 🏎 En Vercel debe ser headless
      timeout: 0 // ❌ Evita que se cierre antes de cargar
  });
  

    console.log("✅ Navegador iniciado");
    const page = await browser.newPage();
    await page.goto("https://bocasocios.bocajuniors.com.ar/auth/login", {
      waitUntil: "domcontentloaded", // ⚡ Carga más rápido
      timeout: 10000 // ⏳ Evita bloqueos largos
  });

  

    console.log("🔹 Página de login cargada");

    // Inyectar datos en el almacenamiento
    await page.evaluate((localData, sessionData) => {
      console.log("📌 Inyectando localStorage...");
      Object.keys(localData).forEach(key => {
        localStorage.setItem(key, localData[key]);
      });

      console.log("📌 Inyectando sessionStorage...");
      Object.keys(sessionData).forEach(key => {
        sessionStorage.setItem(key, sessionData[key]);
      });

      console.log("✅ Datos de sesión inyectados en el navegador");
    }, sessionData.localStorage, sessionData.sessionStorage);

   


    console.log("🔄 Recargando página para aplicar sesión...");
    await page.reload({ waitUntil: "networkidle2" });

    // Capturar captura de pantalla para depuración
    await page.screenshot({ path: "screenshot.png" });
    console.log("📸 Captura de pantalla guardada como 'screenshot.png'");

    // Comprobar si la sesión se inició correctamente
    const isLoggedIn = await page.evaluate(() => {
      const userData = localStorage.getItem('boca-secure-storage\\authStore');
      if (!userData) return false;

      const parsedData = JSON.parse(userData);
      return parsedData.state?.userDetail?.authToken ? true : false;
    });

    if (isLoggedIn) {
      console.log("✅ Sesión iniciada correctamente");
      res.send("✅ Sesión iniciada correctamente en SoySocio.");
    } else {
      console.log("⚠️ La sesión no se inició correctamente");
      res.status(401).send("⚠️ Error al iniciar sesión, verifique los datos de sesión.");
    }

  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error);
    res.status(500).send("Error al abrir la página");
  }
});

export default router;
