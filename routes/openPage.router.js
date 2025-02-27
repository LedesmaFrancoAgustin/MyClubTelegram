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

      // Página intermedia para restaurar localStorage y sessionStorage antes de redirigir
      res.send(`
          <html>
          <head>
              <script>
                  try {
                      // Restaurar localStorage
                      localStorage.setItem('boca-secure-storage\\\\authStore', JSON.stringify(${JSON.stringify(session.localStorage)}));

                      // Restaurar sessionStorage
                      sessionStorage.setItem('_cltk', '${session.sessionStorage._cltk}');

                      console.log("Sesión restaurada, redirigiendo...");
                  } catch (error) {
                      console.error("Error restaurando sesión:", error);
                  }

                  // Esperar un segundo antes de redirigir
                  setTimeout(() => {
                      window.location.href = "https://bocasocios.bocajuniors.com.ar/auth/login";
                  }, 1000);
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
