import express from "express";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import mongoose from "mongoose";
import SessionCookie from "../models/sessionCookies.model.js"; // Modelo de MongoDB

const router = express.Router();
router.get("/redirect-boca", async (req, res) => {
  // Buscar cookies de MongoDB
  const session = await SessionCookie.findOne({ email: "ledesma-agustin@hotmail.com" });

  if (!session) {
      return res.status(403).send("No hay sesión guardada.");
  }

  // Enviar un HTML con un script que restaura `localStorage` y `sessionStorage`
  res.send(`
      <html>
      <head>
          <title>Redireccionando...</title>
          <script>
              (function() {
                  // Restaurar LocalStorage
                  const localData = ${JSON.stringify(session.localStorage)};
                  Object.keys(localData).forEach(key => localStorage.setItem(key, localData[key]));

                  // Restaurar SessionStorage
                  const sessionData = ${JSON.stringify(session.sessionStorage)};
                  Object.keys(sessionData).forEach(key => sessionStorage.setItem(key, sessionData[key]));

                  // Redirigir a Boca
                  setTimeout(() => {
                      window.location.href = "https://bocasocios.bocajuniors.com.ar/auth/login";
                  }, 1000);
              })();
          </script>
      </head>
      <body>
          <p>Redirigiendo a Boca Juniors...</p>
      </body>
      </html>
  `);
});

export default router;
