//import { Telegraf } from "telegraf";
import { Telegraf, Scenes, session } from "telegraf";
import express from "express";

// Importar comandos y handlers
import { startCommand } from "./commands/startCommands.js";
import { callbackHandler } from "./handlers/callbackHandlers.js";
import { registerScene, loginScene } from "./handlers/accessHandlers.js"; // Ajusta la ru
import { initMongoDB } from "./db.js"; // Conexión a MongoDB
import path from "path";

import openPageRouter from "./routes/openPage.router.js";

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const PORT = process.env.PORT || 3000;

// Verificar que las variables estén definidas
if (!TELEGRAM_TOKEN || !WEBHOOK_URL) {
  throw new Error(
    "Las variables de entorno TELEGRAM_TOKEN y WEBHOOK_URL son necesarias",
  );
}

const bot = new Telegraf(TELEGRAM_TOKEN);

const stage = new Scenes.Stage([registerScene, loginScene]);
bot.use(session());
bot.use(stage.middleware());

//bot.use(session()); // Agregar soporte de sesiones
const app = express();

// Conectar a la base de datos MongoDB
initMongoDB();

bot.telegram.setWebhook(WEBHOOK_URL);
app.use(bot.webhookCallback("/"));
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", openPageRouter);



app.listen(PORT, () => {
  //console.log(`Bot corriendo en puerto ${PORT}`);
});
// Configurar los comandos /start y los botones
startCommand(bot);
// Configuración de los comandos de callback
callbackHandler(bot);


