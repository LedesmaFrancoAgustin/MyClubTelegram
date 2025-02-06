import { Telegraf } from 'telegraf';
import express from 'express';
// Importar comandos y handlers
import { startCommand } from './commands/startCommands.js';
import { callbackHandler } from './handlers/callbackHandlers.js';
//import { messageHandler } from './handlers/messageHandlers.js'; // Nuevo handler
import {initMongoDB} from './db.js'; // Conexión a MongoDB
import { sessionConfig } from './dbSession.js';
// Leer las variables de entorno
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const PORT = process.env.PORT || 3000;

// Verificar que las variables estén definidas
if (!TELEGRAM_TOKEN || !WEBHOOK_URL) {
  throw new Error('Las variables de entorno TELEGRAM_TOKEN y WEBHOOK_URL son necesarias');
}

const bot = new Telegraf(TELEGRAM_TOKEN);
const app = express();

// Configuración de la sesión usando el archivo dbSeccion.js
sessionConfig(app);
// Conectar a la base de datos MongoDB
initMongoDB();

// Usar sesión de Telegraf
//bot.use(session());
// Configurar el webhook para Vercel
bot.telegram.setWebhook(WEBHOOK_URL);
app.use(bot.webhookCallback('/'));

app.listen(PORT, () => {
    console.log(`Bot corriendo en puerto ${PORT}`);
  });

// Configurar los comandos /start y los botones
startCommand(bot);
// Configuración de los comandos de callback
callbackHandler(bot);
// Configuración del manejo de los mensajes de texto (correo y contraseña)
//messageHandler(bot); // Ahora manejamos los mensajes de texto con el handler correspondiente


//curl -X POST https://api.telegram.org/bot7847475966:AAECmeLxqrf5kAfRflLXtD7ElcAhnoZ7A-c/setWebhook?url=https://https://telegram-pass-soy-socio.vercel.app/webhook

// 'https://telegram-pass-soy-socio.vercel.app'