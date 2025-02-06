
import {
    handleQuiensoy,
    handleInformacion,
    handleIniciarSecion,
    handleRegistrar,
    handlePass,
    handleDetener
  } from '../commands/reponseCommands.js';

export const callbackHandler = (bot) => {
  bot.on('callback_query', (ctx) => {
    const callbackData = ctx.callbackQuery.data;

    switch (callbackData) {
      case 'Quiensoy':
        handleQuiensoy(ctx);  // Como antes
        break;
      case 'informacion':
        handleInformacion(ctx);
        break;
      case 'IniciarSecion':
        handleIniciarSecion(ctx); // Pedir el email cuando presionen Iniciar Seción
        break;
      case 'registrar':
        handleRegistrar(ctx);
        break;
      case 'Pass':
        handlePass(ctx);
        break;
      case 'detener':
        handleDetener(ctx);
        break;
      default:
        ctx.reply('Comando no reconocido');
        break;
    }
  });

  
};
