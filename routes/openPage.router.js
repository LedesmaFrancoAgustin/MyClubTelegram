import express from "express";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import mongoose from "mongoose";
import SessionCookie from "../models/sessionCookies.model.js"; // Modelo de MongoDB

const router = express.Router();
router.get("/redirect-boca", async (req, res) => {
  try {
      // Buscar la sesión en la base de datos
      const session = await SessionCookie.findOne({ email: "ledesma-agustin@hotmail.com" });

      if (!session) {
          return res.status(403).send("No hay sesión guardada.");
      }

      // Convertir `localStorage` y `sessionStorage` en JSON para inyectarlos en el navegador
      const localStorageData = JSON.stringify(session.localStorage);
      const sessionStorageData = JSON.stringify(session.sessionStorage);

      // Enviar un HTML con un script para forzar la carga de `localStorage` y luego redirigir
      res.send(`
          <html>
              <head>
                  <script>
                      // Guardar localStorage y sessionStorage desde los datos de MongoDB
                      localStorage.setItem('boca-secure-storage\\\\authStore', ${JSON.stringify(localStorageData)});
                      sessionStorage.setItem('_cltk', ${JSON.stringify(sessionStorageData)});

                      // Redirigir a la página de Boca después de almacenar los datos
                      window.location.href = "https://bocasocios.bocajuniors.com.ar/auth/login";
                  </script>
              </head>
              <body>
                  <p>Redirigiendo...</p>
              </body>
          </html>
      `);
  } catch (error) {
      console.error("❌ Error al redirigir:", error);
      res.status(500).send("Error interno del servidor.");
  }
});

export default router;
