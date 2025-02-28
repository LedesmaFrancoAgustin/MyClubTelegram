import express from "express";
import SessionCookie from "../models/sessionCookies.model.js";

const router = express.Router();

router.get("/redirect-boca", async (req, res) => {
    try {
        const session = await SessionCookie.findOne({ email: "ledesma-agustin@hotmail.com" });

        if (!session) {
            return res.status(403).send("No hay sesión guardada.");
        }

        // Asegurar que las cookies sean un array
        const cookiesData = Array.isArray(session.cookies) ? session.cookies : [];

        // Serializar datos para que puedan usarse en el navegador
        const localStorageData = session.localStorage ? JSON.stringify(session.localStorage) : "{}";
        const sessionStorageData = session.sessionStorage ? JSON.stringify(session.sessionStorage) : "{}";
        const cookiesJSON = JSON.stringify(cookiesData);

        res.send(`
            <html>
            <head>
                <script>
                    (function restoreSession() {
                        try {
                            console.log("🔄 Restaurando sesión...");

                            // Restaurar localStorage
                            const localStorageData = ${localStorageData};
                            Object.keys(localStorageData).forEach(key => {
                                localStorage.setItem(key, localStorageData[key]);
                            });
                            console.log("✅ localStorage restaurado.");

                            // Restaurar sessionStorage
                            const sessionStorageData = ${sessionStorageData};
                            Object.keys(sessionStorageData).forEach(key => {
                                sessionStorage.setItem(key, sessionStorageData[key]);
                            });
                            console.log("✅ sessionStorage restaurado.");

                            // Restaurar cookies (solo funciona en extensiones o servidores que puedan modificar headers)
                            const cookies = ${cookiesJSON};
                            cookies.forEach(cookie => {
                                document.cookie = cookie.name + "=" + cookie.value + "; path=" + cookie.path + "; domain=" + cookie.domain + ";";
                            });
                            console.log("✅ Cookies restauradas.");

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
