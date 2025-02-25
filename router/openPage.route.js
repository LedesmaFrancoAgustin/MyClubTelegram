import express from "express";
import puppeteer from "puppeteer";

const router = express.Router();

router.get("/open-page", async (req, res) => {
  const { session } = req.query;

  if (!session) {
    return res.status(400).send("⚠️ No se proporcionaron datos de sesión.");
  }

  try {
    // Convertir los datos de sesión desde la URL
    const sessionData = JSON.parse(decodeURIComponent(session));

    const browser = await puppeteer.launch({ headless: false }); // Cambiar a true si no necesitas ver el navegador
    const page = await browser.newPage();

    // Navegar a la página de inicio de sesión
    await page.goto("https://soysocio.bocajuniors.com.ar/", {
      waitUntil: "networkidle2",
    });

    // Inyectar los datos de localStorage y sessionStorage
    await page.evaluate((data) => {
      Object.entries(data.localStorage).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
      Object.entries(data.sessionStorage).forEach(([key, value]) => {
        sessionStorage.setItem(key, value);
      });
    }, sessionData);

    // Refrescar la página para aplicar la sesión
    await page.reload({ waitUntil: "networkidle2" });

    res.send("✅ Página abierta con la sesión restaurada.");
  } catch (error) {
    console.error("❌ Error al abrir la página:", error);
    res.status(500).send("⚠️ Error al abrir la página.");
  }
});

export default router;
