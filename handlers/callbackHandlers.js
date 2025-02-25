import {
  handleQuiensoy,
  handleInformacion,
  handlePass,
} from "../commands/reponseCommands.js";
import {
  handleSectorSelection,
  handleSectorCallback,
  handleConfirmPass,
  handleBuyPass
} from "../handlers/selectionMatchHandlers.js"; // Importamos las funciones relacionadas con partidos y sectores
import { isSessionValid, logout } from "../handlers/accessHandlers.js";


export const callbackHandler = (bot) => {
  bot.on("callback_query", async (ctx) => {
    const callbackData = ctx.callbackQuery.data;

    // Si no hay sesión, la creamos
    if (!ctx.session) ctx.session = {};

    // Verifica si el usuario ha iniciado sesión antes de permitir el acceso a la funcionalidad
    const isSessionExpired = isSessionValid(ctx);

    switch (callbackData) {
      case "Quiensoy":
        handleQuiensoy(ctx); // Como antes
        break;
      case "informacion":
        handleInformacion(ctx);
        break;
      case "IniciarSesion":
        try {
          return ctx.scene.enter("loginScene");
        } catch (error) {
          console.error(
            "Error al ingresar a la escena de inicio de sesión:",
            error,
          );
          await ctx.reply(
            "Ocurrió un error al intentar iniciar sesión. Inténtalo de nuevo más tarde.",
          );
        }
        break;
      case "registrar":
        try {
          return ctx.scene.enter("registerScene");
        } catch (error) {
          console.error("Error al ingresar a la escena de registro:", error);
          await ctx.reply(
            "Ocurrió un error al intentar registrarte. Inténtalo de nuevo más tarde.",
          );
        }
        break;
      case "Pass":
        if (isSessionExpired) {
          await handlePass(ctx); // Llamamos a handlePass cuando el usuario ha iniciado sesión
        } else {
          // Verificar si el usuario ha iniciado sesión antes de permitir el acceso a la funcionalidad
          return ctx.reply(
            "Tu sesión ha expirado o no has iniciado sesión. Por favor, inicia sesión nuevamente.",
            getLoginButton(),
          );
        }

        break;

      case "detener":
        logout(ctx);
        break;

      case callbackData.startsWith("match_") && callbackData: // Si es un partido
        if (isSessionExpired) {
          await handleSectorSelection(ctx); // Llamamos a handleSectorSelection si se ha seleccionado un partido
        } else {
          // Verificar si el usuario ha iniciado sesión antes de permitir el acceso a la funcionalidad
          return ctx.reply(
            "Tu sesión ha expirado o no has iniciado sesión. Por favor, inicia sesión nuevamente.",
          );
        }

        break;
      case callbackData.startsWith("sector_") && callbackData: // Si es un sector
        if (isSessionExpired) {
          await handleSectorCallback(ctx); // Llamamos a handleSectorCallback si se ha seleccionado un sector
        } else {
          // Verificar si el usuario ha iniciado sesión antes de permitir el acceso a la funcionalidad
          return ctx.reply(
            "Tu sesión ha expirado o no has iniciado sesión. Por favor, inicia sesión nuevamente.",
          );
        }

        break;
        case callbackData.startsWith("confirmar_") && callbackData:
          const matchId = callbackData.split("_")[1]; // Extrae el ID del partido
          ctx.session.selectedMatchId = matchId; // Guarda el ID en la sesión
          //await handleConfirmPass(ctx);
          await handleBuyPass(ctx);
        break;
        case callbackData.startsWith("comprar_"):
         
          await handleBuyPass(ctx);
        break

      default:
        ctx.reply("Comando no reconocido");
        break;
    }
  });
};

const getLoginButton = () => {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🔑 Iniciar Sesión", callback_data: "IniciarSesion" }],
      ],
    },
  };
};
