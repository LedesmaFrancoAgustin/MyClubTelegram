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

      // Generar un script para almacenar los datos en localStorage y sessionStorage
      const script = `
          <script>
              localStorage.setItem('boca-secure-storage\\\\authStore', ${JSON.stringify(session.localStorage)});
              sessionStorage.setItem('_cltk', '${session.sessionStorage._cltk}');
              window.location.href = "https://bocasocios.bocajuniors.com.ar/auth/login";
          </script>
      `;

      res.send(script);

  } catch (error) {
      console.error("Error en /redirect-boca:", error);
      res.status(500).send("Error interno del servidor.");
  }
});

export default router;
