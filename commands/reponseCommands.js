import { handlePassMatch } from "../handlers/selectionMatchHandlers.js";

export const handleQuiensoy = (ctx) => {
  ctx.reply(sendMessageChats.startMessage.text, getButtonOpcion()); // Enviar el mensaje al chat
};

export const handleInformacion = (ctx) => {
  ctx.reply(sendMessageChats.infoMessage.text, {
    parse_mode: "MarkdownV2",
    reply_markup: getButtonOpcion().reply_markup,
  });
};

export const handlePass = async (ctx) => {
  await handlePassMatch(ctx);
};

const sendMessageChats = {
  startMessage: {
    text: '¡Hola! 👋 Soy PassBot, tu asistente virtual de PassBocaSocio. 💙💛💙\n\nEstoy aquí para ayudarte a conseguir entradas para los partidos de Boca Juniors. 🎟️🏟️\nReservamos plateas y palcos exclusivamente para socios.\n\nPara más información sobre cómo obtener tu entrada, presiona "Información". 📩',
  },
  infoMessage: {
    text:
      "¡Hola\\! 👋 Soy PassBot, tu asistente virtual de PassSoySocio y tu mejor aliado para conseguir entradas para los partidos de Boca Juniors\\. 💙💛💙\n\n" +
      "Te ayudo a obtener plateas y palcos para que disfrutes de la cancha como se debe\\. 🎟️🏟️ Nuestro equipo se encarga de reservar entradas exclusivamente para socios \\(activos o adherentes, en cualquier categoría\\)\\.\n\n" +
      "Si aún no eres socio, únete en 👉 bocasocios\\.bocajuniors\\.com\\.ar y viví la pasión desde adentro\\. 🔥\n\n" +
      "🔸 Gestionamos reservas de plateas y palcos mediante el Abono Solidario a través de Boca Socios\\. 🎟️💙💛💙\n\n" +
      "🔸 *Pasos para solicitar tu entrada:*\n\n" +
      '🔹 Primero debes seleccionar la opción *"Registrar"* para vincular tu cuenta de Boca Socio\\. 📲\n\n' +
      "🔹 Recuerda que debes usar el *mismo email y contraseña* que utilizas en Boca Socios para completar el registro correctamente\\. 🔑\n\n" +
      '🔹 Una vez registrado, deberás seleccionar la opción *"Iniciar sesión"* e ingresar con tu cuenta de Boca Socio\\. 🔓\n\n' +
      '🔹 Luego de iniciar sesión, se habilitará la opción *"PASS"*, donde verás los partidos disponibles para inscripción\\. 🎟️\n\n' +
      "🔹 Al seleccionar un partido, podrás elegir el sector al que deseas ir\\. Puedes seleccionar varios sectores, pero el orden en que los elijas definirá la prioridad de asignación\\. ⚽\n\n" +
      "🔹 Una vez seleccionados los sectores, recibirás un mensaje confirmando tu inscripción al partido en el sector elegido\\. ✅\n\n" +
      "🔸 Te notificaremos por este mismo chat cuando iniciemos la búsqueda y cuando hayamos logrado la reserva\\. Si lo deseas, también podemos avisarte por Instagram para que no te pierdas ninguna notificación\\. 🔔💙💛💙\n\n" +
      "🔸 Una vez confirmada la reserva, podrás pagar la entrada como si la hubieras gestionado personalmente, tu carnet se habilitará automáticamente para el ingreso al estadio\\. 🎟️🏟️\n\n" +
      "👥 Si llevas invitados \\(solo para plateas\\), deberán retirar sus entradas en La Bombonera el día del partido\\. Para hacerlo, será necesario presentar el carnet del socio y su DNI\\. 📄\n" +
      "La venta para invitados depende exclusivamente del club y no de nosotros\\. 🎟️\n\n" +
      "🔸 *IMPORTANTE:* \n" +
      "Nuestro servicio tiene un costo adicional de \\$10,000 por entrada\\. Este monto se abona únicamente después de confirmar la compra\\. ✅\n\n" +
      "❌ No revendemos ni alquilamos carnets, solo ayudamos a los socios a obtener entradas\\. \n\n" +
      "📢 *Precio de entradas* \n\n" +
      "Los precios de las entradas, además del costo de nuestro servicio, son los siguientes:\n\n" +
      "🏟️ *Plateas:*\n" +
      "🔹 *1ra bandeja:* \\$114,000 \\- \\$144,000\n" +
      "🔹 *2da bandeja:* \\$114,000 \\- \\$144,000\n" +
      "🔹 *3ra bandeja:* \\$61,000 \\- \\$74,000\n" +
      "🔹 *Torres/Terrazas:* \\$100,000 \\- \\$124,000\n" +
      "🔹 *Palcos:* \\$100,000 \\- \\$197,000\n" +
      "🔹 *Preferenciales:* \\$121,000 \\- \\$200,000\n\n" +
      "⚠️ *Importante:* Los precios pueden estar sujetos a cambios por parte del club\\.",
  },
};


const getButtonOpcion = () => {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Quien soy", callback_data: "Quiensoy" },
          { text: "Informacion", callback_data: "informacion" },
        ],
        [
          { text: "Iniciar Sesión", callback_data: "IniciarSecion" },
          { text: "Registrar", callback_data: "registrar" },
        ],
        [
          { text: "Pass", callback_data: "Pass" },
          { text: "Cerrar Sesión", callback_data: "detener" },
        ],
      ],
    },
  };
};
