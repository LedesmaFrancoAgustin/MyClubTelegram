export const startCommand = (bot) => {
  bot.start((ctx) => {
    // Crear los botones de inline keyboard
    const keyboard = [
      [
        { text: "Quien soy", callback_data: "Quiensoy" },
        { text: "Informacion", callback_data: "informacion" },
      ],
      [
        { text: "Iniciar Secion", callback_data: "IniciarSesion" },
        { text: "Registrar", callback_data: "registrar" },
      ],
      [
        { text: "Pass", callback_data: "Pass" },
        { text: "Cerrar Sesión", callback_data: "detener" },
      ],
    ];

    // Enviar el mensaje con los botones
    return ctx.reply("¡Bienvenido, bostero! 💙💛💙\n Elige una opción:", {
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  });
};
