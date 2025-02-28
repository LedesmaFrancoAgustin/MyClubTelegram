import express from "express";
import mongoose from "mongoose";
import SessionCookie from "../models/sessionCookies.model.js"; // Modelo de MongoDB

const router = express.Router();

router.get("/redirect-boca", async (req, res) => {
    try {
        // Buscar la sesión en MongoDB
        const session = await SessionCookie.findOne({ email: "ledesma-agustin@hotmail.com" });

        if (!session) {
            return res.status(403).send("No hay sesión guardada.");
        }

        // Convertir datos a JSON seguro
        const localStorageData = session.localStorage ? JSON.stringify(session.localStorage) : null;
        const sessionStorageData = session.sessionStorage ? JSON.stringify(session.sessionStorage) : null;
        const cookiesData = Array.isArray(session.cookies) ? JSON.stringify(session.cookies) : null;

        // Responder con una página que carga el script externo
        res.send(`
            <html>
            <head>
                <script>
                    window.sessionData = {
                        localStorage: ${localStorageData},
                        sessionStorage: ${sessionStorageData},
                        cookies: ${cookiesData}
                    };
                </script>
                <script src="/js/restoreSession.js"></script>
            </head>
            <body>
                <h3>Restaurando sesión... Espere un momento...</h3>
            </body>
            </html>
        `);
    } catch (error) {
        console.error("Error en /redirect-boca:", error);
        res.status(500).send("Error interno del servidor.");
    }
});

export default router;
