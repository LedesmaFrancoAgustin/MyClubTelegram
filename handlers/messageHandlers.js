// messageHandlers.js

import { handleUserInput } from './authHandlers.js'; // Importamos la lógica de manejo del input

export const messageHandler = (bot) => {
  bot.on('text', async (ctx) => {
    try {
      // Llamamos a la función que maneja la entrada del usuario
      await handleUserInput(ctx);
    } catch (error) {
      console.error('Error manejando entrada del usuario: ', error);
      ctx.reply('Hubo un error al procesar tu mensaje. Intenta nuevamente.');
    }
  });
};
