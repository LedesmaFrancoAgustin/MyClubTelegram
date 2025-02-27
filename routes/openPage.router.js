import express from "express";
import mongoose from "mongoose";
import SessionCookie from "../models/sessionCookies.model.js"; // Importar el modelo de sesión

const router = express.Router();

router.get('/open-socio', async (req, res) => {
  try {
    const email = "ledesma-agustin@hotmail.com"; // Obtener email desde la consulta
    if (!email) {
      return res.status(400).send("Email es requerido");
    }

    const sessionData = await SessionCookie.findOne({ email });
    if (!sessionData) {
      return res.status(404).send("No se encontraron datos de sesión");
    }

    res.send(`
      <html>
        <head>
          <title>SoySocio</title>
          <script>
            window.onload = function() {
              const localData = ${JSON.stringify(sessionData.localStorage)};
              const sessionData = ${JSON.stringify(sessionData.sessionStorage)};
              
              Object.keys(localData).forEach(key => {
                localStorage.setItem(key, localData[key]);
              });
              
              Object.keys(sessionData).forEach(key => {
                sessionStorage.setItem(key, sessionData[key]);
              });
            };
          </script>
        </head>
        <body>
          <iframe src="https://bocasocios.bocajuniors.com.ar/auth/login" width="100%" height="800px" style="border:none;"></iframe>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error al cargar la página:', error);
    res.status(500).send('Error al abrir la página');
  }
});

export default router;
