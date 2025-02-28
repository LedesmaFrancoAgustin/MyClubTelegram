import express from "express";
import SessionCookie from "../models/sessionCookies.model.js"; // Modelo de MongoDB

const router = express.Router();

router.get("/redirect-boca", async (req, res) => {
    try {
        // Buscar la sesión en MongoDB
        const session = await SessionCookie.findOne({ email: "ledesma-agustin@hotmail.com" });

        if (!session) {
            return res.status(403).send("No hay sesión guardada.");
        }

        // Verificar que session.cookies sea un array
        const cookiesData = Array.isArray(session.cookies) ? session.cookies : [];

        // Convertir datos a JSON seguro
        const localStorageData = session.localStorage ? JSON.stringify(session.localStorage) : null;
        const sessionStorageData = session.sessionStorage ? JSON.stringify(session.sessionStorage) : null;

        // Responder con una página que recupera la sesión
        res.send(`
            <html>
            <head>
                <script>
                    (function restoreSession() {
                        try {
                            console.log("🔄 Restaurando sesión...");

                            const localStorageData = ${localStorageData};
                            if (localStorageData) {
                                Object.keys(localStorageData).forEach(key => {
                                    localStorage.setItem(key, localStorageData[key]);
                                });
                                console.log("✅ localStorage restaurado.");
                            }

                            const sessionStorageData = ${sessionStorageData};
                            if (sessionStorageData) {
                                Object.keys(sessionStorageData).forEach(key => {
                                    sessionStorage.setItem(key, sessionStorageData[key]);
                                });
                                console.log("✅ sessionStorage restaurado.");
                            }

                            console.log("✔️ Sesión restaurada. Redirigiendo...");
                            setTimeout(() => {
                                window.location.href = "https://bocasocios.bocajuniors.com.ar/auth/login";
                            }, 2000);
                        } catch (error) {
                            console.error("❌ Error restaurando sesión:", error);
                        }
                    })();
                </script>
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
