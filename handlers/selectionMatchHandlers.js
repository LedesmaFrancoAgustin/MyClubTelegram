import Match from "../models/matches.model.js"; // Importamos el modelo de Match
import accountsModel from "../models/accounts.model.js"; // Importamos el modelo de Accounts
import SessionCookie from "../models/sessionCookies.model.js";
import fetch from "node-fetch"; // Asegúrate de tener node-fetch si usas Node.js antes de 18

// Arreglo de sectores disponibles
const sectores = [
  "Platea Baja",
  "Platea Media",
  "Platea Alta",
  "Torres/Terrazas",
  "Palco",
  "Palco Pref",
  "Cualquier sector",
];

// Manejador para mostrar los partidos y permitir selección
export const handlePassMatch = async (ctx) => {
  try {
    // Obtener los partidos (matches) disponibles desde la base de datos
    const matches = await Match.find({ enabled: true }); // Filtramos para solo mostrar partidos habilitados

    if (matches.length === 0) {
      ctx.reply("No hay partidos disponibles en este momento.");
    } else {
      // Crear el arreglo de botones inline para los partidos
      const buttons = matches.map((match) => {
        const partidoDate = match.date;
        return [
          {
            text: `${match.vs} - ${partidoDate}`,
            callback_data: `match_${match._id}`, // Usamos el _id del partido para identificarlo
          },
        ];
      });

      // Enviar el mensaje con los botones
      ctx.reply("Partidos disponibles:", {
        reply_markup: {
          inline_keyboard: buttons,
        },
      });
    }
  } catch (error) {
    console.error(error);
    ctx.reply("Hubo un error al obtener los partidos.");
  }
};

// Manejador de la selección de un partido
export const handleSectorSelection = (ctx) => {
  try {
    const matchId = ctx.callbackQuery.data.split("_")[1]; // Obtener el ID del partido seleccionado

    // Guardamos el ID del partido seleccionado en la sesión
    ctx.session.selectedMatchId = matchId;

    // Enviamos un teclado de sectores
    const sectorButtons = sectores.map((sector) => [
      {
        text: sector,
        callback_data: `sector_${sector}`, // Usamos el nombre del sector como callback_data
      },
    ]);

    ctx.reply("Selecciona el sector al que deseas ir:", {
      reply_markup: {
        inline_keyboard: sectorButtons,
      },
    });
  } catch (error) {
    console.error("Error al manejar la selección del partido:", error);
    ctx.reply(
      "Ocurrió un error al procesar la selección del partido. Inténtalo de nuevo más tarde.",
    );
  }
};

// Manejador para el callback de la selección del sector
export const handleSectorCallback = async (ctx) => {
  try {
    const sector = ctx.callbackQuery.data.split("_")[1]; // Obtener el sector seleccionado
    const matchId = ctx.session.selectedMatchId;
    const email = ctx.session.email;
    console.log("id de email: ", email);

    const match = await Match.findById(matchId); // Obtener los detalles del partido seleccionado
    if (!match) {
      return ctx.reply("No se encontró el partido seleccionado.");
    }

    const account = await accountsModel.findOne({ email: email });
    if (!account) {
      return ctx.reply(
        "No se encontró la cuenta asociada al correo electrónico.",
      );
    }

    const accountId = account._id;
    console.log("id de email: ", accountId);

    let userEntry = match.interestedUsers.find(
      (entry) => entry.accountId.toString() === accountId.toString(),
    );

    if (userEntry) {
      if (!userEntry.sector.includes(sector)) {
        await Match.updateOne(
          { _id: matchId, "interestedUsers.accountId": accountId },
          { $addToSet: { "interestedUsers.$.sector": sector } },
        );
        ctx.reply(
          `Has seleccionado el sector "${sector}" para el partido ${match.vs} el ${match.date}.`,
        );
      } else {
        ctx.reply(
          `Ya has seleccionado el sector "${sector}" para este partido.`,
        );
      }
    } else {
      await Match.updateOne(
        { _id: matchId },
        { $push: { interestedUsers: { accountId, sector: [sector] } } },
      );
      ctx.reply(
        `Has seleccionado el sector "${sector}" para el partido ${match.vs} el ${match.date}.`,
      );
    }
  } catch (error) {
    console.error("Error al manejar la selección del sector:", error);
    ctx.reply(
      "Ocurrió un error al procesar tu selección. Inténtalo de nuevo más tarde.",
    );
  }
};

export const handleConfirmPass = async (ctx) => {
  try {
    const matchId = ctx.session.selectedMatchId;
    const email = ctx.session.email;
    if (!matchId || !email) {
      return ctx.reply("Inicia session para completar la confirmacion");
    }

    const match = await Match.findById(matchId);
    if (!match) {
      return ctx.reply("No se encontró la información necesaria para confirmar.");
    }

    const account = await accountsModel.findOne({ email: email });
    if (!account) {
      return ctx.reply("No se encontró la cuenta asociada al correo electrónico.");
    }

    const accountId = account._id;
    let userEntry = match.interestedUsers.find(
      (entry) => entry.accountId.toString() === accountId.toString()
    );

    if (userEntry) {
      await Match.updateOne(
        { _id: matchId, "interestedUsers.accountId": accountId },
        { $set: { "interestedUsers.$.verifyPass": true } }
      );
      ctx.reply("✅ Has confirmado tu pass fue adquirido con exito.");
    } else {
      ctx.reply("No estás registrado como interesado en este partido.");
    }
  } catch (error) {
    console.error("Error al confirmar pase:", error);
    ctx.reply("Ocurrió un error al confirmar tu pase. Inténtalo de nuevo más tarde.");
  }
};




export const handleBuyPass = async (ctx) => {

  try {
    const userEmail = ctx.session.email;

    if (!userEmail) {
      return ctx.reply("⚠️ No se encontraron datos de sesión guardados.");
    }
    // Generamos la URL usando el sessionId
    const url = `https://my-club-telegram.vercel.app/api/open-page/${userEmail}`;

    // Enviamos el botón con la URL al usuario
    await ctx.reply("✅ Tu sesión ha sido restaurada. Presiona el botón para continuar:", {
      reply_markup: {
        inline_keyboard: [[{ text: "🛒 Abrir Página", url }]],
      },
    });
  } catch (error) {
    console.error("❌ Error al recuperar datos de sesión:", error);
    await ctx.reply("⚠️ Ocurrió un error al procesar la compra.");
  }
};
