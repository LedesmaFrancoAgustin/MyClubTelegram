import express from "express";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
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
  
        // Convertir los datos de localStorage, sessionStorage y cookies a cadenas JSON seguras
        const localStorageData = session.localStorage 
            ? JSON.stringify(session.localStorage).replace(/"/g, '&quot;') 
            : null;
        const sessionStorageData = session.sessionStorage 
            ? JSON.stringify(session.sessionStorage).replace(/"/g, '&quot;') 
            : null;
        const cookiesData = Array.isArray(session.cookies) 
            ? JSON.stringify(session.cookies).replace(/"/g, '&quot;') 
            : null;
  
        // Responder con una página que recupera la sesión
        res.send(`
            <html>
            <head>
                <script>
                    (function restoreSession() {
                        try {
                            console.log("🔄 Restaurando sesión desde MongoDB...");
  
                            // Restaurar localStorage si hay datos
                            const localStorageString = "${localStorageData}";
                            if (localStorageString !== "null") {
                                let localData = JSON.parse(localStorageString.replace(/&quot;/g, '"'));
                                Object.keys(localData).forEach(key => {
                                    localStorage.setItem(key, localData[key]);
                                    console.log("✅ localStorage restaurado:", key);
                                });
                            }
  
                            // Restaurar sessionStorage si hay datos
                            const sessionStorageString = "${sessionStorageData}";
                            if (sessionStorageString !== "null") {
                                let sessionData = JSON.parse(sessionStorageString.replace(/&quot;/g, '"'));
                                Object.keys(sessionData).forEach(key => {
                                    sessionStorage.setItem(key, sessionData[key]);
                                    console.log("✅ sessionStorage restaurado:", key);
                                });
                            }
  
                            // Restaurar cookies si hay datos
                            const cookiesString = "${cookiesData}";
                            if (cookiesString !== "null") {
                                let cookies = JSON.parse(cookiesString.replace(/&quot;/g, '"'));
                                if (Array.isArray(cookies)) {
                                    cookies.forEach(({ name, value, path = '/', domain = '' }) => {
                                        document.cookie = "${name}=${value}; path=${path}; domain=${domain}";
                                        console.log("✅ Cookie restaurada:", name);
                                    });
                                }
                            }
  
                            console.log("✔️ Sesión restaurada con éxito.");
                            
                            // Esperar 2 segundos para asegurar que se guarden los datos
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
