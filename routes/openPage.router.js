import express from "express";
import puppeteer from "puppeteer";
import { getDb } from "../db.js"; // Obtener la conexión activa a MongoDB

const router = express.Router();

async function getSessionFromDB() {
    const db = getDb(); // Usa la conexión existente
    const collection = db.collection("sessions");
    
    // Buscar la última sesión guardada
    const session = await collection.findOne({}, { sort: { _id: -1 } });

    return session;
}

router.get("/open-page", async (req, res) => {
    try {
        const savedSession = await getSessionFromDB();

        if (!savedSession || !savedSession.cookies || !Object.keys(savedSession.cookies).length) {
            return res.json({ message: "⚠️ No hay sesión guardada en la base de datos." });
        }

        const browser = await puppeteer.launch({
            headless: false,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
        const page = await browser.newPage();

        // Restaurar cookies
        const cookiesArray = Object.keys(savedSession.cookies).map(name => ({
            name,
            value: savedSession.cookies[name],
            domain: ".bocajuniors.com.ar",
            path: "/",
            httpOnly: false,
            secure: true,
            sameSite: "None"
        }));
        await page.setCookie(...cookiesArray);

        await page.goto("https://bocasocios.bocajuniors.com.ar", { waitUntil: "networkidle2" });

        // Restaurar localStorage y sessionStorage
        await page.evaluate(storage => {
            localStorage.clear();
            Object.entries(storage).forEach(([key, value]) => localStorage.setItem(key, value));
        }, savedSession.localStorage);

        await page.evaluate(storage => {
            sessionStorage.clear();
            Object.entries(storage).forEach(([key, value]) => sessionStorage.setItem(key, value));
        }, savedSession.sessionStorage);

        await page.reload({ waitUntil: "networkidle2" });

        console.log("✅ Página abierta con sesión restaurada y fila virtual evitada");
        res.json({ message: "✅ Página abierta con sesión restaurada y fila virtual evitada" });

    } catch (error) {
        console.error("❌ Error al abrir la página:", error);
        res.status(500).json({ message: "⚠️ Error al abrir la página" });
    }
});

export default router;
