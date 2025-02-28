import express from "express";
import fetch from "node-fetch";
import SessionCookie from "../models/sessionCookies.model.js";

const router = express.Router();

router.get("/redirect-boca", async (req, res) => {
    try {
        const session = await SessionCookie.findOne({ email: "ledesma-agustin@hotmail.com" });

        if (!session) {
            return res.status(403).send("No hay sesión guardada.");
        }

        const authToken = session.localStorage["boca-secure-storage\\authStore"]
            ? JSON.parse(session.localStorage["boca-secure-storage\\authStore"]).state.userDetail.authToken
            : null;

        if (!authToken) {
            return res.status(403).send("No hay token guardado.");
        }

        console.log("🔄 Iniciando sesión desde el backend...");

        const response = await fetch("https://bocasocios.bocajuniors.com.ar/api/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            throw new Error("⚠️ No se pudo autenticar.");
        }

        console.log("✅ Autenticación exitosa. Redirigiendo...");

        res.redirect("https://bocasocios.bocajuniors.com.ar/auth/login");

    } catch (error) {
        console.error("❌ Error en /redirect-boca:", error);
        res.status(500).send("Error interno del servidor.");
    }
});

export default router;
