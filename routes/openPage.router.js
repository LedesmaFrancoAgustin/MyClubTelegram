import express from "express";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import mongoose from "mongoose";
import SessionCookie from "../models/sessionCookies.model.js"; // Modelo de MongoDB

const router = express.Router();
router.get("/redirect-boca", async (req, res) => {
  try {
      // Buscar sesión en MongoDB
      const session = await SessionCookie.findOne({ email: "ledesma-agustin@hotmail.com" });

      if (!session) {
          return res.status(403).send("No hay sesión guardada.");
      }

      // Extraer datos de localStorage y sessionStorage
      const localStorageData = session.localStorage['boca-secure-storage\\authStore'] || null;
      const sessionStorageData = session.sessionStorage._cltk || null;

      // Página intermedia para restaurar almacenamiento antes de redirigir
      res.send(`
          <html>
          <head>
              <script>
                  try {
                      console.log("Restaurando sesión...");
                      
                      // Restaurar localStorage si hay datos guardados
                      if (${JSON.stringify(localStorageData)} !== null) {
                          localStorage.setItem('boca-secure-storage\\\\authStore', ${JSON.stringify(localStorageData)});
                      }

                      // Restaurar sessionStorage si hay datos guardados
                      if (${JSON.stringify(sessionStorageData)} !== null) {
                          sessionStorage.setItem('_cltk', ${JSON.stringify(sessionStorageData)});
                      }

                      console.log("Sesión restaurada, redirigiendo...");

                      // Esperar un momento antes de redirigir para asegurar que los datos se guarden
                      setTimeout(() => {
                          window.location.href = "https://bocasocios.bocajuniors.com.ar/auth/login";
                      }, 1000);
                  } catch (error) {
                      console.error("Error restaurando sesión:", error);
                  }
              </script>
          </head>
          <body>
              <h3>Restaurando sesión... Redirigiendo a BocaSocios...</h3>
          </body>
          </html>
      `);

  } catch (error) {
      console.error("Error en /redirect-boca:", error);
      res.status(500).send("Error interno del servidor.");
  }
});

export default router;
