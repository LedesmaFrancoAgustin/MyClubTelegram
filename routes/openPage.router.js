import express from "express";
import axios from "axios";
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

        // Hacer la petición desde el servidor a BocaSocios
        const response = await axios.get("https://bocasocios.bocajuniors.com.ar/auth/login", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Cookie": session.cookies.map(({ name, value }) => `${name}=${value}`).join("; ")
            }
        });

        // Responder con una página que carga la sesión y redirige al usuario
        res.send(`
            <html>
            <head>
                <script>
                    (function restoreSession() {
                        try {
                            console.log("🔄 Restaurando sesión desde MongoDB...");

                            const localStorageData = ${localStorageData};
                            if (localStorageData) {
                                Object.keys(localStorageData).forEach(key => {
                                    localStorage.setItem(key, localStorageData[key]);
                                    console.log("✅ localStorage restaurado:", key);
                                });
                            }

                            const sessionStorageData = ${sessionStorageData};
                            if (sessionStorageData) {
                                Object.keys(sessionStorageData).forEach(key => {
                                    sessionStorage.setItem(key, sessionStorageData[key]);
                                    console.log("✅ sessionStorage restaurado:", key);
                                });
                            }

                            console.log("✔️ Sesión restaurada con éxito.");
                            setTimeout(() => {
                                console.log("➡️ Redirigiendo a BocaSocios...");
                                window.location.href = "https://bocasocios.bocajuniors.com.ar/auth/login";
                            }, 2000);
                        } catch (error) {
                            console.error("❌ Error restaurando sesión:", error);
                        }
                    })();
                </script>
            </head>
            <body>
                <h3>Redirigiendo a BocaSocios...</h3>
            </body>
            </html>
        `);
    } catch (error) {
        console.error("Error en /redirect-boca:", error);
        res.status(500).send("Error interno del servidor.");
    }
});

export default router;
